# La Frontera

Ecosistema digital para ciudades fronterizas de México: negocios, turismo, garitas y marketplace local.

**Stack:** React 19 + Vite (frontend) · Express + Prisma (backend) · PostgreSQL (Docker).

## Requisitos

- **Node.js 18+** (recomendado 20/22)
- **npm** (o pnpm/yarn)
- **Docker** + Docker Compose (para la base de datos)
- Git

## Estructura

```
la-frontera/
├── frontend/          # React 19 + Vite (SPA)
├── backend/           # Express + Prisma (auth)
│   └── prisma/schema.prisma   # Contrato de datos (fuente de verdad)
├── docker-compose.yml     # PostgreSQL
└── .env / backend/.env    # Variables de entorno
```

## Configuración paso a paso

### 1. Clonar e instalar

```bash
git clone <url-del-repo>
cd la-frontera
```

### 2. Levantar la base de datos (Docker)

```bash
docker compose up -d
```

Esto arranca PostgreSQL en el puerto `5433` (base/usuarios/contraseña: `lafrontera`).

> Si ya tienes un PostgreSQL local en el puerto `5432`, no hay conflicto: usamos `5433`.

### 3. Configurar el backend

```bash
cd backend
cp .env.example .env        # luego edita JWT_SECRET
npm install
npm run prisma:generate     # genera el cliente Prisma
npm run prisma:migrate -- --name init   # crea las tablas
```

### 4. Arrancar el backend

```bash
npm run dev                 # API en http://localhost:4000
```

### 5. Configurar y arrancar el frontend

En otra terminal:

```bash
cd frontend
npm ci                      # instala EXACTO desde package-lock.json
npm run dev                 # Vite en http://localhost:5173
```

Opcional: copia `frontend/.env.example` a `frontend/.env` si quieres un `VITE_API_URL` distinto (por defecto apunta a `http://localhost:4000/api/v1`).

### 6. Probar

Abre http://localhost:5173 y usa **Crear cuenta** (Cuenta → Ciudad → Intereses → Listo) o **Iniciar sesión**.

## Comandos útiles

| Dónde | Comando | Qué hace |
|---|---|---|
| raíz | `docker compose up -d` | Levanta PostgreSQL |
| raíz | `docker compose down` | Detiene PostgreSQL (los datos persisten en el volumen) |
| `backend/` | `npm run dev` | API con recarga (nodemon) en `:4000` |
| `backend/` | `npm run prisma:generate` | Regenera el cliente Prisma tras cambiar el schema |
| `backend/` | `npm run prisma:migrate -- --name <nombre>` | Crea/aplica una migración |
| `backend/` | `npm run prisma:studio` | Interfaz visual de Prisma |
| `backend/` | `npm run prisma:seed` | Puebla la BD: garitas reales + restaurantes, horarios, galería y reseñas de ejemplo (es seguro re-correrlo) |
| `frontend/` | `npm run dev` | Dev server (Vite) en `:5173` |
| `frontend/` | `npm run build` | TypeScript estricto + build de producción |

## Variables de entorno

### `backend/.env`

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL (puerto `5433`) |
| `JWT_SECRET` | Secreto para firmar los tokens. **Cada máquina debe usar el suyo** |
| `JWT_EXPIRES_IN` | Duración del access token (ej. `7d`) |
| `PORT` | Puerto del backend (default `4000`) |
| `CORS_ORIGIN` | Origen permitido por CORS (default `http://localhost:5173`) |
| `OPENWEATHER_API_KEY` | Key gratuita de [openweathermap.org](https://openweathermap.org/api) para el clima en `/garitas`. Cada quien debe registrar la suya (correo, sin tarjeta) |

### `frontend/.env`

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API (default `http://localhost:4000/api/v1`) |

## Notas

- **Auth** usa la API real (`backend`). **Restaurantes** y **Marketplace** usan la API real; los widgets de la landing aún leen **mocks** tipados en el frontend.
- El seed (`npm run prisma:seed`) puebla las garitas del feed CBP y crea un dueño demo `owner@lafrontera.mx` / `demo1234` (rol `BUSINESS_OWNER`), 13 restaurantes con horarios/galería y ~20 reseñas. Los negocios se sirven desde `GET /businesses`, `GET /businesses/:slug` y `GET|POST /businesses/:id/reviews`.
- El endpoint de **Google OAuth** es un stub (`501`) por ahora.
- `npm run lint` en el frontend falla porque `eslint` no está declarado/instalado; no hay scripts de test ni formateo.
- El schema vive en `backend/prisma/schema.prisma`; los scripts del backend ya apuntan a él (`npm run prisma:generate`, `prisma:migrate`).

## Marketplace

El módulo de marketplace permite a usuarios autenticados publicar artículos para compra/venta local.

**Características implementadas:**
- Listado con paginación (20 items por página)
- Filtros por ciudad, categoría y búsqueda de texto
- Vista de detalle con imagen grande, descripción completa y datos de contacto del vendedor
- Creación de publicaciones (requiere autenticación)
- Subida de imagen del artículo desde el dispositivo (drag & drop, 1 imagen JPG/PNG/WebP, validación magic bytes + sharp)
- Campos del formulario alineados al schema de base de datos

**Rutas:**
- `/marketplace` — Listado de publicaciones
- `/marketplace/:id` — Detalle de una publicación

**Endpoints:** Ver `frontend/API_ENDPOINTS.md` sección Marketplace.

## Solución de problemas

- **`docker compose` no se encuentra** → instala Docker Desktop y asegúrate de que esté corriendo.
- **Error de conexión a la BD** → verifica `docker compose ps` y que `DATABASE_URL` use `localhost:5433`.
- **`prisma migrate` no conecta** → confirma que la DB está arriba (`docker compose up -d`) antes de migrar.
- **Puerto `4000` ocupado** → cambia `PORT` en `backend/.env` y `VITE_API_URL` en el frontend.

## Módulo de garitas (`/garitas`)

Sección de estatus de cruces fronterizos: tiempos de espera en vivo por carril, clima local, tipo de cambio y recomendación de garita más rápida por ciudad.

### Fuentes de datos externas

| Dato | Fuente | Autenticación |
|---|---|---|
| Tiempos de espera en garitas | [CBP Border Wait Times](https://bwt.cbp.gov/xml/bwt.xml) | Sin key, feed XML público |
| Clima | [OpenWeatherMap](https://openweathermap.org/api) | Requiere `OPENWEATHER_API_KEY` (gratis, ver arriba) |
| Tipo de cambio USD → MXN | [Frankfurter](https://frankfurter.dev) | Sin key |

### Setup inicial (una sola vez por entorno)

Después de correr las migraciones normales del backend:

```bash
cd backend
npm run prisma:seed
```

Esto llena `BorderCrossing` con las ~41 garitas reales del lado mexicano (filtradas de carga comercial y duplicados del feed de CBP). Es seguro volver a correrlo — usa `upsert` por `portNumber`, así que no duplica nada, solo actualiza.

### Sincronización de tiempos de espera

El backend corre un cron job automático (definido en `server.js`) que:
- Cada **15 minutos**, descarga el feed de CBP y guarda un nuevo registro en `WaitTime` por cada garita/carril.
- Una vez al **día (3am)**, recalcula `WaitTimePattern` (promedios históricos por día de la semana + hora) a partir de todo lo acumulado en `WaitTime`.

No requiere configuración adicional — arranca solo con `npm run dev`. Mientras más tiempo lleve el backend corriendo (aunque sea en background), más útil se vuelve el patrón histórico y las gráficas de tendencia.

> **Nota:** los tiempos de espera reales solo se acumulan mientras el backend está corriendo. Si es la primera vez que levantas el proyecto, vas a ver pocos o ningún dato hasta que el cron corra un par de veces — esto es esperado, no un error.

### Imágenes de fondo por ciudad

`frontend/public/cities/` contiene una imagen de fondo por ciudad fronteriza (usada en `/garitas`), nombrada en minúsculas igual que el campo `city` en la base de datos (ej. `tijuana.jpg`, `ciudad_juarez.jpg`). Si falta la imagen de alguna ciudad, cae automáticamente a `default.jpg`.