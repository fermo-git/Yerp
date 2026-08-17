# LA FRONTERA — Guía de Estilo Obligatoria

> **Estado: VINCULANTE.** Todo agente que cree o modifique UI en `frontend/` DEBE
> cumplir esta guía. Si un cambio la contradice, el cambio está mal, no la guía.
> Para proponer una evolución de la identidad, edita primero este archivo.
>
> Dirección de arte: **«LA LÍNEA» — señalética fronteriza + guía editorial + tablero de datos vivos.**
> La interfaz se inspira en la señalética de carretera fronteriza (verde señal, tipografía
> expandida, placas monoespaciadas) y en la línea divisoria como elemento estructural.

---

## 1. Identidad en una frase

La Frontera es la **guía real de las ciudades fronterizas**: papel y tinta (editorial),
verde de señalética vial (acción), ámbar (datos vivos), y una línea que lo cruza todo.

## 2. Los 4 activos de marca (protégelos)

1. **La Línea** — hairline `ink/10` con el rombo de cruce (`RouteLine`). Es divisor,
   subrayado y firma. Nunca decoración aleatoria: marca transiciones de sección o cruce.
2. **El rombo de cruce** — el logotipo (línea + cuadrado rotado 45°). Fuente única:
   `components/brand/Icons.tsx` (`CrossingIcon`). PROHIBIDO duplicar el SVG inline.
3. **El Tablero** — superficie oscura `asphalt` + IBM Plex Mono + ámbar. Reservado
   EXCLUSIVAMENTE para datos vivos (garitas, tipo de cambio, gasolina, clima).
4. **Las calcomanías** — `Saguaro` / `Biznaga` (`components/brand/Cactus.tsx`). Máximo
   1 por vista. Son la única ilustración permitida.

## 3. Color (tokens en `frontend/src/index.css`)

| Token | Hex | Uso permitido |
|---|---|---|
| `paper` | `#FBFAF7` | Fondo global. SIEMPRE el fondo base. |
| `white` | `#FFFFFF` | Superficie de contenido sobre paper (cards, inputs, header de auth). Con borde hairline, nunca con sombra. |
| `ink` | `#1D1D1F` | Texto primario, bordes hairline (con alpha), CTA secundario. |
| `ink-soft` | `#6B6B70` | Texto secundario. Mínimo `ink/60` para texto pequeño (contraste). |
| `verde` | `#0F5C46` | Acción principal, links, estado activo, foco. Es verde de señalética, no «brand green» decorativo. |
| `verde-deep` | `#0A4333` | Hover de verde, texto sobre `verde-tint`. |
| `verde-tint` | `#EEF4F1` | Fondo de estados seleccionados/activos. |
| `amber` | `#E8A13C` | **SOLO datos vivos** (acento en Tablero, estrellas/ratings, ilustraciones). |
| `amber-deep` | `#B06A15` | Texto ámbar sobre fondos claros. |
| `amber-tint` | `#F6E7CD` | Fondo de badges de datos. |
| `asphalt` | `#181A1D` | Fondo del Tablero. NUNCA como bloque decorativo. |
| `asphalt-soft` | `#23262B` | Celdas dentro del Tablero. |
| `sand-deep` | `#DAD2BE` | Solo dentro de ilustraciones SVG. |
| `alto` (rojo señal) | `#B3362B` | Errores y estados destructivos. Token `--color-alto` en `@theme`. |

### Reglas de color

- **60 / 30 / 10**: ~60% paper, ~30% ink/blanco, ~10% verde. El ámbar es ≤3% (datos).
- PROHIBIDO: gradientes (salvo ninguno), glows, glassmorphism, púrpuras/azules «tech».
- Un acento por vista: si el Tablero (ámbar) está presente, nada más compite con él.
- Los errores usan `alto` (rojo), NO `amber-deep` (el ámbar significa «dato», no «error»).
- Sobre `asphalt`: texto `white`, labels `white/40`, números `white`, acento `amber`.

## 4. Tipografía

Fuentes cargadas en `index.html`: **Archivo variable** (wdth 62–125, wght 100–900) e
**IBM Plex Mono** (400/500/600). No añadir más familias.

| Rol | Fuente | Especificación |
|---|---|---|
| Display / H1 | Archivo **Expanded** (`font-stretch: 125%`, clase `.font-expanded`) | 800, tracking −0.02, leading 1.02, clamp 2.5rem→4.5rem. SOLO H1 de página y wordmark gigante. |
| H2 | Archivo normal | 700, tracking −0.01, 30–36px |
| H3 | Archivo normal | 600, 18–20px |
| Body | Archivo normal | 400/500, 15–16px, leading 1.6, medida máx. 65ch |
| Small | Archivo | 13–14px, `ink-soft` |
| Eyebrow / Label / Micro | **IBM Plex Mono** | 500, 11px, uppercase, tracking 0.16em, `ink-soft` (sobre asphalt: `white/40`) |
| Datos | IBM Plex Mono | `tabular-nums`, números del Tablero, precios, coordenadas, placas |

### Reglas tipográficas

- **Expanded se usa con cuentagotas**: H1 y firmas. Si todo es expandido, nada lo es.
- Todo micro-label del sistema es Mono uppercase (`Eyebrow`, headers de footer, labels
  del Tablero, pasos de formulario). Unificar cualquier label Archivo uppercase a Mono.
- Números que son **datos** → Mono. Números que son **contenido** (rating «4.5») → Archivo.
- Español (es-MX), sentence case en botones y títulos («Publica tu negocio», no «PUBLICA TU NEGOCIO»).
  Uppercase solo en eyebrows mono y en el wordmark.

## 5. Spacing y layout

- Escala base 4px: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- Ritmo de secciones: **80px desktop / 48px mobile** (`py-20` / `py-12`). No inventar
  valores intermedios por sección (hoy hay `py-14`, `py-16` mezclados → unificar).
- Contenedor: `.container-frontera` (max 80rem, padding 20px mobile / 32px ≥640px). No crear contenedores paralelos.
- Grid: 12 columnas desktop; grids de cards 4 → 3 → 2 (lg/sm/base).
- Las secciones se separan con **hairlines o aire**, no con sombras ni bandas de color.

## 6. Radius y bordes (sistema cerrado)

| Token | Valor | Uso |
|---|---|---|
| `rounded-md` | 8px | Botones, inputs, badges, chips |
| `rounded-xl` | 12px | Cards, imágenes, contenedores |
| `rounded-full` | — | Avatares, pills de filtro, dot «en vivo» |

- PROHIBIDO: `rounded-2xl` (16px), `rounded-3xl` (24px) y superiores en UI nueva.
  (La señalética es rectangular con radio corto; radios grandes = genérico.)
- Bordes: hairline `border-ink/10` (1px). Bordes de énfasis: `border-ink/15`.
- **Las sombras son solo para elementos flotantes reales** (dropdown, popover, menú móvil):
  `shadow-soft`. `shadow-raised` queda reservada al buscador del hero (único elemento
  «elevado» del sistema). Las cards NO llevan sombra: llevan hairline.

## 7. Componentes (reglas duras)

### Botones (`components/ui/Button.tsx`)
- Variantes: `primary` (verde), `secondary` (ink), `outline` (hairline), `ghost`.
- Radius `rounded-md` (8px). Sin sombra. Hover = cambio de fondo, 150–200ms.
- Un solo `primary` por vista/pantalla. Si hay dos CTAs, el segundo es `outline` o `ghost`.

### Cards
- Superficie blanca + `border border-ink/10`, radius `rounded-xl`, SIN sombra.
- Imagen `aspect-[4/3]`, `rounded-xl`, hover `scale-[1.03]` (no 105) 300ms.
- Chips sobre imagen: fondo blanco + hairline, sin sombra flotante.
- PROHIBIDO botones decorativos (corazón que no guarda, etc.): o funciona o se elimina.

### El Tablero (datos vivos)
- Único lugar con fondo `asphalt`. Labels mono uppercase `white/40`; valores mono
  `tabular-nums` 28–32px; sub-labels `white/45`.
- Ámbar SOLO en el dato que requiere atención (ej. tiempo de garita).
- El punto «en vivo» lleva SIEMPRE label «EN VIVO» en mono; pulso 2s.

### Forms
- Inputs: `rounded-md`, hairline `ink/10`, foco `border-verde` + `ring-2 ring-verde/20`.
- Labels: 12px `ink/70`. Errores: `alto` (rojo señal), texto específico de cómo corregir.
- Sin fondos de foto detrás de formularios.

### Navbar / Footer
- Navbar: sticky, `bg-paper`, hairline inferior, SIN sombra. Activo = underline 2px `ink`.
- Wordmark: `CrossingIcon` en tile verde `rounded-md` + «LA FRONTERA» Archivo Expanded 800 uppercase.
- Footer: blanco, hairlines, headers de columna mono uppercase. La firma final es el
  wordmark gigante Expanded cruzado por la línea (ver DESIGN AUDIT §13).
- Chips de idioma/moneda: prohibidos hasta que funcionen (nada de UI muerta).

### Estados
- **Empty**: `EmptyState` con `Biznaga`, borde dashed hairline, texto que invita a actuar.
- **Loading**: `Skeleton` con `bg-ink/8`, mismo layout que el contenido final.
- **Error**: qué pasó + cómo resolverlo, sin disculpas, acento `alto`.

## 8. Motion

- Durations: `120ms` (micro), `200ms` (estándar), easing `ease-out`. Nada de springs
  exagerados, parallax, ni animaciones en loop (excepción: dot «en vivo», 2s).
- **Movimiento firma**: la línea que se dibuja (subrayado del hero, `scaleX` 0→1).
  Es el ÚNICO momento de entrada coreografiado por página.
- Hover de imágenes: `scale-[1.03]`. Hover de links: color `verde`. Sin translateY mágicos.
- `prefers-reduced-motion` ya está en `index.css`: respetarlo, no desactivarlo.

## 9. Iconografía

- SVG inline stroke `currentColor`, **strokeWidth 1.8**, caps/joins round, viewBox 24.
- Nuevos iconos: añadirlos a `components/brand/Icons.tsx` o `lib/categoryIcons.tsx`.
  PROHIBIDO re-definir el mismo icono inline en varios componentes (el logo está
  duplicado 3 veces hoy — deuda a corregir).
- Los iconos acompañan labels; nunca sustituyen texto en acciones críticas ni decoran vacío.

## 10. Prohibido (anti-slop)

1. Gradientes decorativos · 2. Glassmorphism/backdrop-blur · 3. Glow azul/morado ·
4. Cards con sombra como sistema · 5. Radius >12px · 6. Badges sin función ·
7. Iconos puramente decorativos · 8. Animación constante/parallax · 9. UI muerta
(botones/chips que no hacen nada) · 10. Hero genérico con stock photo ·
11. Secciones con fondos de color sin función · 12. Emoji en UI.

**Test antes de añadir cualquier elemento visual:** ¿mejora comprensión, navegación,
jerarquía, identidad, conversión, accesibilidad, feedback o usabilidad? Si solo «se ve
cool», no va.

## 11. Checklist del agente (antes de dar por terminada cualquier UI)

- [ ] Solo tokens de `@theme` (nada de hex inline ni colores nuevos).
- [ ] Radius dentro del sistema (8/12/full). Cards sin sombra, con hairline.
- [ ] Micro-labels en IBM Plex Mono uppercase; números-dato en mono tabular.
- [ ] Un solo CTA primario; un solo acento ámbar por vista.
- [ ] Todos los controles funcionan o no existen (nada de `preventDefault()` muerto).
- [ ] Estados: hover / focus-visible / disabled / loading / empty / error definidos.
- [ ] Contraste: texto ≥ 4.5:1 (usar `ink/60`+ para texto pequeño sobre paper).
- [ ] `prefers-reduced-motion` intacto; duraciones ≤ 200ms salvo firma.
- [ ] Copy en español (es-MX), sentence case, voz activa.
- [ ] Responsive: composición pensada por breakpoint (ver DESIGN AUDIT §15), no solo «que quepa».
