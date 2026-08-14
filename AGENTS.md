# Agent Guide

## Scope

- `frontend/` — React 19 + Vite SPA. `backend/` — Express + Prisma API (auth + publicación de negocios).
- Auth y publicación de negocios (create + galería) usan la API real (`backend`); el listado/detalle de negocios y los widgets siguen leyendo mocks tipados.

## Database & backend

- PostgreSQL vía Docker: `docker compose up -d` (puerto `5433`, base `lafrontera`). Credenciales en `backend/.env`.
- Instalar backend: `npm install` desde `backend/`.
- Migrar/generar: `npm run prisma:generate` y `npm run prisma:migrate` desde `backend/` (apuntan a `backend/prisma/schema.prisma`).
- Arrancar backend: `npm run dev` desde `backend/` (Express en puerto `4000`).

## Frontend commands

- Run from `frontend/`; install exactly with `npm ci`.
- `npm run dev` (Vite, puerto `5173`), `npm run build` (TypeScript estricto antes de `vite build`).
- `npm run lint` currently fails before linting because `eslint` is not declared/installed. No test or formatter scripts.
- `VITE_API_URL` default en `services/api/client.ts` es `http://localhost:4000/api/v1` (coincide con el backend).

## Structure

- `frontend/src/main.tsx` is the React entrypoint; `frontend/src/App.tsx` owns route definitions and `frontend/src/layouts/MainLayout.tsx` wraps routed pages.
- Pages belong in `frontend/src/pages/`; reusable visual pieces belong in `frontend/src/components/`, grouped by `layout`, `ui`, `business`, or `widgets`.
- Server state uses TanStack Query via `frontend/src/hooks/`; keep API/mock implementation details in `frontend/src/services/api/` and `frontend/src/services/mocks/`, rather than in pages or components.
- Use the configured `@/*` alias for imports from `frontend/src` (for example, `@/lib/queryClient`).
- Tailwind v4 is CSS-first: edit design tokens and shared utilities in `frontend/src/index.css`; do not assume a `tailwind.config.js` exists.

## Integration

- `services/api/auth.ts` y `services/api/businesses.ts` (create + galería) usan `apiClient` (real); el resto de `businesses.ts` y los widgets siguen usando mocks con latencia (`mockDelay`).
- `apiClient` lee `VITE_API_URL`, adjunta `Authorization: Bearer` desde `localStorage` (`la-frontera:token`) y desenvuelve el campo `data` del envelope REST `{ data }` / `{ error: { code, message } }`.
- `apiClient.upload(path, FormData)` es la variante para `multipart/form-data` (NO fija `Content-Type`; deja que el navegador ponga el boundary y solo adjunta el `Authorization`).
- Endpoints auth implementados: `POST /auth/register|login`, `GET /auth/me`, `PATCH /users/me`, `GET|PUT /users/me/interests`. Google OAuth es un stub (`501`).
- Endpoints de negocios implementados: `POST /businesses` (crea negocio + horarios, solo `BUSINESS_OWNER`), `POST /businesses/:id/gallery` (imágenes, solo el dueño), `POST /businesses/:id/menu` (menú imagen/PDF, solo el dueño). El resto del contrato en `frontend/API_ENDPOINTS.md` (listado, detalle, reseñas, marketplace, eventos, widgets, search) sigue pendiente y se consume vía mocks.
- Endpoints geo implementados (proxy de Nominatim con caché + rate limit + `User-Agent` propio): `GET /geo/search?q=&city=` y `GET /geo/reverse?lat=&lng=` en `routes/geo.routes.js`. El frontend NO llama a Nominatim directo; usa `services/api/geo.ts`.

## Negocios — Publicar negocio (nuevo)

Funcionalidad: desde la pestaña "Negocios" (`/negocios/nuevo`, antes placeholder) un `BUSINESS_OWNER` publica un negocio y sube hasta 10 imágenes 16:9.

### Gating por rol (frontend y backend)
- Frontend (`pages/NewBusinessPage.tsx`): `status === "loading"` → spinner; sin sesión → aviso con "Iniciar sesión"/"Crear cuenta"; `role !== "BUSINESS_OWNER"` → aviso "Tu cuenta no puede publicar negocios"; `BUSINESS_OWNER` → botón que abre un modal con el formulario.
- Backend SIEMPRE revalida el rol con middleware (`authRequired` + `requireRole("BUSINESS_OWNER")`); el gating de UI es solo UX.

### Seguridad (defensa en profundidad, OWASP)
- Validación de entrada con `zod` en backend (`routes/businesses.routes.js`): longitudes máx, enums, regex de teléfono, `email`, `url` con esquema `http(s)://`, rechazo de HTML (`<`/`>`) y caracteres de control, normalización de espacios. Whitelist estricta → protege contra mass assignment (solo se pasa a Prisma lo validado).
- SQL injection: todo vía Prisma (queries parametrizadas). Prohibido concatenar SQL.
- XSS: React escapa por defecto; backend rechaza `<`/`>` en campos de texto; `website` valido que empiece con `http(s)://` (evita `javascript:`).
- Subida de imágenes (`lib/upload.js`): Multer memoryStorage con límites (5 MB/archivo, máx 10), `fileFilter` por MIME + verificación de **magic bytes** reales, `sharp` valida decodificación + dimensiones + relación 16:9 (±1%) + mínimo 1280×720. Se re-codifica con `sharp` (strip de EXIF/metadata) y se guarda con nombre **UUID** (nunca el nombre del usuario → evita path traversal). Almacenamiento en `backend/uploads/` (fuera del webroot de la app).
- `helmet()` global; rate limiting específico en `POST /businesses` (10/15min) y `POST /businesses/:id/gallery` (30/15min). Errores genéricos sin filtrar stack traces.
- Autorización de galería: se verifica `business.ownerId === req.userId`.

### Flujo de subida (frontend)
- `useCreateBusiness` + `useUploadGallery` (`hooks/useBusinesses.ts`) como `useMutation` (invalidan `["businesses"]`).
- Primero `POST /businesses` (devuelve `business.id`), luego `POST /businesses/:id/gallery` con las imágenes en un `FormData` (campo `"gallery"`). Si la galería falla tras crear el negocio, el formulario permite **reintentar la subida sin duplicar** el negocio (mantiene el `created.id`).
- `components/business/ImageUploader.tsx`: drag & drop + input, preview en grilla `aspect-video`, validación en vivo (tipo, 5 MB, 1280×720, 16:9 ±1%), contador N/10 y botón por imagen para quitarla.
- `components/business/NewBusinessForm.tsx`: `react-hook-form` + `zodResolver`, usa `Field`/`inputClassName`, `Button` y `StepIndicator`; el schema de zod espeja los límites del backend (la autoridad final es el servidor).

### Formulario por pasos
- El formulario se divide en 4 pasos (`STEPS = ["Negocio", "Ubicación", "Contacto y horarios", "Fotos y menú"]`) para mantener ventanas pequeñas: (1) nombre, descripción, categoría y rango de precios; (2) ciudad + `MapPicker`; (3) teléfono, WhatsApp, correo, sitio web + horarios; (4) imágenes + menú + envío.
- `STEP_FIELDS` agrupa los campos de cada paso y `trigger()` valida solo el paso actual antes de avanzar ("Siguiente"); en el paso 3 también valida horarios (`validateHours`). Los valores persisten entre pasos porque `react-hook-form` mantiene su estado en el mismo `<form>`.
- Rango de precios: obligatorio en el formulario. Usa `requiredEnum(PRICE_RANGES, "Por favor selecciona tu rango de precio")` (no `z.enum().optional()`), porque un `<option value="">` en blanco pasaba `""` y el enum fallaba con el error técnico "Invalid enum value". El backend igualmente acepta `priceRange` ausente (default `MODERADO`).

### Horarios de atención y menú
- Horarios: modelo relacional `BusinessHour` (`businessId`, `dayOfWeek` 0=domingo–6=sábado, `opensAt`/`closesAt` "HH:MM"). Un día sin fila = cerrado. El formulario (`NewBusinessForm.tsx`) tiene un toggle "Agregar horarios" + editor de 7 días (checkbox "Abierto" + inputs `type="time"`); solo envía los días abiertos. Backend valida formato HH:MM y `closesAt > opensAt`, y crea las filas con `businessHour.createMany`.
- Menú: `Business.menuUrl String?`. Subida en `POST /businesses/:id/menu` (campo `"menu"`, Multer 1 archivo/10 MB) con magic bytes para JPG/PNG/WebP/**PDF** (`%PDF`); PDF se guarda tal cual, imágenes se re-codifican con sharp. Frontend: input de archivo opcional en el formulario + `uploadBusinessMenu`/`useUploadMenu`.

### Ubicación (mapa + mejoras)
- `components/business/MapPicker.tsx`: Leaflet + OpenStreetMap; pin arrastrable + reverse-geocode que rellena la dirección; autocompletado (debounce) y búsqueda vía el proxy del backend; botón "Usar mi ubicación" (geolocalización) que avisa si el pin cae a >200 km de una ciudad cubierta.
- El proxy geo (`routes/geo.routes.js`) restringe la búsqueda a un `viewbox` de ~50 km alrededor de la ciudad elegida (`countrycodes=mx&bounded=1`); sin ciudad, busca en todo México.

### Archivos nuevos / modificados
- Backend nuevos: `backend/lib/slug.js`, `backend/lib/upload.js`, `backend/routes/businesses.routes.js`, `backend/routes/geo.routes.js`.
- Backend modificados: `backend/lib/auth.js` (`requireRole`), `backend/server.js` (helmet, multer, estático `/uploads`, montaje `/api/v1/businesses` y `/api/v1/geo`), `backend/.env.example` (`PUBLIC_BASE_URL`), `backend/package.json` (deps: `multer`, `helmet`, `express-rate-limit`, `sharp`).
- Frontend nuevos: `frontend/src/pages/NewBusinessPage.tsx`, `frontend/src/components/business/NewBusinessForm.tsx`, `frontend/src/components/business/ImageUploader.tsx`, `frontend/src/components/business/MapPicker.tsx`, `frontend/src/services/api/geo.ts`.
- Frontend modificados: `frontend/src/App.tsx` (ruta `/negocios/nuevo` → `NewBusinessPage`), `frontend/src/services/api/client.ts` (`apiClient.upload`), `frontend/src/services/api/businesses.ts` (`createBusiness`, `uploadBusinessGallery`, `uploadBusinessMenu`), `frontend/src/hooks/useBusinesses.ts` (`useCreateBusiness`, `useUploadGallery`, `useUploadMenu`), `frontend/src/types/business.ts` (`CreateBusinessInput`, `BusinessDTO`, `BusinessHourDTO`, `BORDER_CITIES`, `BUSINESS_CATEGORIES`, `PRICE_RANGES`/`PRICE_RANGE_OPTIONS`).
- Limpieza de imports no usados: `components/business/Hero.tsx` y `components/widgets/BorderWidgetsStrip.tsx` (ya no importan `Eyebrow`) — necesario para que `npm run build` (TS estricto, `noUnusedLocals`) pase.

### Notas
- Las imágenes y el menú se sirven en `http://localhost:4000/uploads/<uuid>.<ext>` (`express.static`); en producción conviene un bucket/CDN. `PUBLIC_BASE_URL` (en `backend/.env`) controla la base de las URLs; `helmet` se configura con `crossOriginResourcePolicy: cross-origin` para permitir cargarlas desde el frontend (5173).
- El `slug` lo genera el backend (`lib/slug.js`, sin acentos + sufijo aleatorio si colisiona); `status` por defecto `ACTIVE`; `featured`, `avgRating`, `reviewCount` y `ownerId` nunca los manda el cliente (`ownerId` sale de `req.userId`).
