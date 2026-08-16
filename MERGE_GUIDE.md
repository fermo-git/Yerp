# GUÍA DE MERGE — Repo `fermo-git/Yerp`

> **PELIGRO**: Este documento describe la integración de 6 ramas del repo `fermo-git/Yerp`.
> La regla de oro es: **TODO el trabajo se hace en un clon local de VERIFICACIÓN.**
> **El push al remoto es un paso OPCIONAL que SOLO se ejecuta con autorización explícita
> del usuario, bajo el procedimiento de "ambiente controlado" de la sección 6**
> (push de `testeos` verificado, sin `--force`, y `main` solo vía PR/MR).

---

## 1. Objetivo

Integrar sobre la rama local `testeos` (solo en un clon temporal) las siguientes ramas,
**en este orden exacto**:

1. `main`
2. `feature/marketplace`
3. `feature/garita-wait-times`
4. `formsyerp`
5. `Oskar`

(`feature/landingPage` es **idéntica** a `main` — mismo hash —, no aporta nada, se ignora.)

Resultado esperado: un repo en forma de **monorepo** (`frontend/` + `backend/`), con las
funcionalidades de marketplace, garita/tiempos de espera, registro de negocios (formsyerp)
y datos/horarios (Oskar) coexistiendo. Build de frontend y backend en verde.

---

## 2. Preparación del entorno (SOLO en clon temporal)

```bash
# Directorio de trabajo temporal (fuera del workspace real)
git clone <URL-del-repo> C:\Users\dnisc\AppData\Local\Temp\opencode\yerp-merge-test
cd C:\Users\dnisc\AppData\Local\Temp\opencode\yerp-merge-test

# Rama de trabajo local basada en la `testeos` REMOTA
git fetch origin
git checkout -b testeos origin/testeos
```

> Si ya existe el clon del intento anterior, reutilizarlo con `git fetch origin`
> y `git reset --hard origin/testeos` para empezar limpio.

---

## 3. Secuencia de merges

### Paso 1 — Merge de `main`

```bash
git merge origin/main
```

**Conflictos esperados y resolución:**

| Archivo | Conflicto | Resolver conservando |
|---|---|---|
| `src/**` → `frontend/src/**` | Estructura: `main` reestructuró a monorepo | **La estructura monorepo** de `main` |
| `Navbar` (modify/delete) | `testeos` modificó, `main` borró | Conservar el componente en su nueva ruta monorepo |
| App/router | Rutas nuevas vs. rutas viejas | Conservar ambas donde sea posible |

Al terminar los conflictos: `git add -A && git commit`.

**Paso 1b — Limpieza de módulos legacy de `testeos`:**
- Eliminar los módulos antiguos de marketplace/restaurants de `testeos` que usaban
  **tokens de diseño viejos** (no se llevan al nuevo diseño).
- **Conservar el enlace de navegación "Restaurantes"** en la Navbar.

Commit separado.

### Paso 2 — Merge de `feature/marketplace`

```bash
git merge origin/feature/marketplace
```

**Conflicto esperado:** `App.tsx` (rutas).
**Resolver:** combinar las rutas nuevas de marketplace con las existentes (no sobrescribir).

### Paso 3 — Merge de `feature/garita-wait-times`

```bash
git merge origin/feature/garita-wait-times
```

**Conflictos esperados:**

| Archivo | Resolver |
|---|---|
| `server.js` | Combinar: el endpoint de wait-times de la rama + los endpoints existentes |
| `App.tsx` | Combinar rutas de garita con las ya integradas |
| `Navbar` | Combinar el enlace de garita |
| `BorderWidgetsStrip` | Combinar (esta rama introduce el widget de border/garita) |

> **Bug conocido de esta rama (corregir al final):** en `frontend/tsconfig.json`
> trae `ignoreDeprecations: "6.0"`. Con TypeScript 5.9.x instalado, hay que
> cambiar a `"5.0"` para que `npm run build` pase.

### Paso 4 — Merge de `formsyerp`

```bash
git merge origin/formsyerp
```

**Conflictos esperados:**

| Archivo | Resolver |
|---|---|
| `.env.example` | Combinar variables nuevas con las existentes |
| `package.json` | Combinar deps (no sobrescribir las de garita) |
| `package-lock.json` | **Regenerar** con `npm install` en `backend/` — el lock de formsyerp **no incluye** `fast-xml-parser` ni `node-cron` (los necesita garita) |
| `server.js` | Combinar endpoints |
| `App.tsx` | Combinar rutas |
| `BorderWidgetsStrip` | Combinar |

> **Regla crítica:** `formsyerp` puede intentar **quitar `lucide-react`**.
> **CONSERVAR `lucide-react`** (lo usan las ramas ya integradas).

### Paso 5 — Merge de `Oskar`

```bash
git merge origin/Oskar
```

**Conflictos esperados:**

| Archivo | Resolver |
|---|---|
| `README.md` | Combinar contenido (no sobrescribir) |
| `prisma/seed.js` | **Add/add**: combinar ambas versiones (mantener datos de ambos) |
| `server.js` | Combinar endpoints |
| `App.tsx` | Combinar rutas |
| `Navbar` | **Deduplicar** (evitar entradas repetidas) |

**Limpieza de Oskar (post-merge):**
- Eliminar los **binarios de `backend/uploads/*`** (archivos subidos; no van al repo).
- **Unificar migraciones Prisma:** `Oskar` consolidó horarios+menú. Borrar las **2 migraciones
  de business-hours de formsyerp** y quedarse solo con:
  - `init`
  - `20260814150000_add_business_hours_and_menu`

---

## 4. Verificación (IMPORTANTE — hacer antes de dar por terminado)

### Frontend

```bash
cd frontend
npm ci          # instalar exacto según package-lock
npm run build   # TypeScript estricto + vite build → DEBE pasar
```

> Si `npm run build` falla por `ignoreDeprecations`, editar
> `frontend/tsconfig.json` a `"5.0"` y reintentar (ver Paso 3).

### Backend

```bash
cd backend
npm install     # regenera package-lock (deps fast-xml-parser y node-cron)
npm run prisma:generate
# Chequeo sintáctico de todos los .js:
for /r %f in (*.js) do node --check "%f"
# Chequeo de arranque:
node -e "import('./server.js')"
```

> `node -e "import('./server.js')"` solo verifica que el módulo carga sin errores;
> el servidor real se arranca con `npm run dev`.

---

## 5. Resultado esperado y commits

Historial típico sobre `testeos` (sirve de referencia):

```
a255d26  fix: build verification (tsconfig ignoreDeprecations)
9fd2a29  Merge de Oskar + limpieza uploads/migraciones
463afaa  Merge de formsyerp (lock regenerado, lucide-react conservado)
ff33254  Merge de feature/garita-wait-times
00a96f0  Merge de feature/marketplace
287ac00  Drop legacy testeos modules (tokens viejos)
c15b67e  Merge de main (estructura monorepo)
```

Checklist final (ANTES de cualquier push):
- [ ] `frontend/npm run build` en verde
- [ ] Backend `prisma generate` OK y `node --check` sin errores
- [ ] `package-lock.json` de backend regenerado
- [ ] `lucide-react` presente en `package.json`
- [ ] `tsconfig.json` con `ignoreDeprecations: "5.0"`
- [ ] Solo 2 migraciones Prisma (init + business_hours_and_menu)
- [ ] `backend/uploads/*` no versionado
- [ ] `git status` limpio (sin cambios sin commitear)

---

## 6. Publicar al remoto como AMBIENTE CONTROLADO

> Solo si el usuario lo autoriza explícitamente. El objetivo es que el remoto
> quede EXACTAMENTE igual a la rama local `testeos` verificada (ambiente controlado).
> **Nada de `--force`, nada de reescribir historial.**

### 6.1 Regla de oro

El remoto debe quedar **idéntico** a lo verificado localmente. Por eso:
- Se publica la rama `testeos` verificada tal cual.
- `main` **no se toca por push directo**: solo vía PR/MR para que quede registro.
- Si en el remoto la rama avanzó respecto al clon → **parar y preguntar**, nunca forzar.

### 6.2 Procedimiento de push controlado

```bash
# 1. Confirmar que el clon está al día y limpio
git status                     # limpio
git log --oneline -8           # revisar que esté el merge completo esperado

# 2. Ver si el remoto avanzó (no debe haber divergencia)
git fetch origin
git rev-parse origin/testeos    # anotar este hash

# 3. SI origin/testeos NO avanzó (mismo hash que la base):
git push origin testeos:testeos

# 4. Verificar que el remoto quedó idéntico al local (ambiente controlado):
git rev-parse testeos
git rev-parse origin/testeos    # DEBE ser el mismo hash

# 5. Para llevar el resultado a main: PR/MR desde testeos → main (NO push directo)
```

### 6.3 Si el remoto avanzó (divergencia)

```bash
# NO hacer push. Verificar qué cambió:
git log --oneline origin/testeos..testeos
git log --oneline testeos..origin/testeos

# Rebase de la rama verificada sobre el nuevo origin/testeos:
git rebase origin/testeos

# RE-VERIFICAR TODO (sección 4) y repetir el push.
# Si el rebase produce conflictos: parar y preguntar.
```

### 6.4 Artefactos que NO deben llegar al remoto

Antes de pushear, confirmar que no se versionan:
- `backend/uploads/*` (binarios subidos por Oskar)
- Migraciones Prisma duplicadas (solo `init` + `20260814150000_add_business_hours_and_menu`)
- `node_modules`, `.env`, `dist`, `.next`

```bash
git ls-files | grep -E "uploads/|node_modules|\.env$" || echo "LIMPIO: sin artefactos"
```

---

## 7. Reglas de seguridad (no negociables)

1. Trabajar **únicamente** en `C:\Users\dnisc\AppData\Local\Temp\opencode\yerp-merge-test`.
2. **NUNCA** `git push --force` ni reescribir historial en el remoto.
3. **NUNCA** push directo a `main`: usar PR/MR (deja registro y revisión).
4. El push de `testeos` **solo** se hace cuando el usuario lo autoriza y tras superar el checklist de la sección 4/5.
5. Tras cualquier push, verificar que `origin/testeos` == `testeos` local (ambiente controlado).
6. Si un merge produce conflictos no previstos: **parar y preguntar**, no resolver a ciegas.
7. Conservar funcionalidad de las ramas previas al resolver cada conflicto (combinar, no sobrescribir).
8. Si algo queda dudoso tras un merge, verificar con `npm run build` antes de continuar.