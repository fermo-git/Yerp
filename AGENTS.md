# Agent Guide

## Diseño (OBLIGATORIO)

- Toda tarea de UI en `frontend/` DEBE seguir `DESIGN_GUIDE.md` (raíz del repo): dirección «La Línea» (papel + tinta + verde señalética + ámbar para datos vivos), tokens de `frontend/src/index.css`, sistema de radius 8/12/full, cards sin sombra, micro-labels en IBM Plex Mono, cero UI muerta y lista anti-slop. Si una petición contradice la guía, señálalo antes de implementar.

## Scope

- `frontend/` — React 19 + Vite SPA. `backend/` — Express + Prisma API (auth + negocios: publicar, listar/detalle, reseñas).
- Auth, restaurantes (listado/detalle/reseñas) y publicación de negocios (create + galería + menú) usan la API real (`backend`); los widgets y la landing "destacados" siguen leyendo mocks tipados.

## Database & backend

- PostgreSQL vía Docker: `docker compose up -d` (puerto `5433`, base `lafrontera`). Credenciales en `backend/.env`.
- Producción con Docker: `docker compose up -d --build` levanta 3 servicios — `db` (PostgreSQL, NO modificar), `api` (`backend/Dockerfile`, node:20-bullseye-slim, corre `prisma migrate deploy` + reintentos al arrancar vía `docker-entrypoint.sh`) y `web` (`frontend/Dockerfile`, build multi-etapa + nginx con SPA fallback y caché de assets). Variables de puertos/URLs en `.env` raíz (ver `.env.example`); secretos del backend en `backend/.env`. Los uploads persisten en el volumen `uploads_data`.
- Instalar backend: `npm install` desde `backend/`.
- Migrar/generar: `npm run prisma:generate` y `npm run prisma:migrate` desde `backend/` (apuntan a `backend/prisma/schema.prisma`).
- Sembrar: `npm run prisma:seed` desde `backend/` (restaurantes + horarios + galería + reseñas; dueño demo `owner@lafrontera.mx` / `demo1234`).
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

- `services/api/auth.ts`, `restaurants.ts`, `reviews.ts` y `businesses.ts` (create + galería + menú) usan `apiClient` (real); los widgets y la actividad siguen usando mocks con latencia (`mockDelay`).
- `apiClient` lee `VITE_API_URL`, adjunta `Authorization: Bearer` desde `localStorage` (`la-frontera:token`) y desenvuelve el campo `data` del envelope REST `{ data }` / `{ error: { code, message } }`.
- `apiClient.upload(path, FormData)` es la variante para `multipart/form-data` (NO fija `Content-Type`; deja que el navegador ponga el boundary y solo adjunta el `Authorization`).
- Login (`pages/LoginPage.tsx`): captura el error de `login()` en `onSubmit` (estado local `rootError`) y lo muestra en un banner `role="alert"` (mismo estilo ámbar que los errores de `NewBusinessForm`). Con credenciales inválidas el backend responde 401 `INVALID_CREDENTIALS` ("Credenciales inválidas") y `apiClient` lanza ese mensaje como `Error`, que es lo que ve el usuario. `POST /auth/register` acepta `role` opcional con whitelist estricta `USER|BUSINESS_OWNER` (zod rechaza `ADMIN` con 400; nunca se asigna rol admin desde el cliente).
=======
- Endpoints auth implementados: `POST /auth/register|login`, `GET /auth/me`, `PATCH /users/me`, `GET|PUT /users/me/interests`. Google OAuth es un stub (`501`). `POST /auth/register` acepta `role` opcional con whitelist estricta `USER|BUSINESS_OWNER` (zod rechaza `ADMIN` con 400; nunca se asigna rol admin desde el cliente).
- Endpoints negocios (publicar): `POST /businesses` (crea negocio + horarios, solo `BUSINESS_OWNER`), `POST /businesses/:id/gallery` (imágenes, solo el dueño), `POST /businesses/:id/menu` (menú imagen/PDF, solo el dueño).
- Endpoints negocios (consumo): `GET /businesses` (filtros `city`, `category`, `q`, `minRating`, `priceRange`, `sort`), `GET /businesses/:slug`, `GET|POST /businesses/:id/reviews` (POST requiere auth, 1 reseña por usuario, recalcula `avgRating`/`reviewCount`). `isOpen` se calcula server-side con mapa ciudad→timezone en `backend/lib/hours.js`.
- Endpoints geo implementados (proxy de Nominatim con caché + rate limit + `User-Agent` propio): `GET /geo/search?q=&city=` y `GET /geo/reverse?lat=&lng=` en `routes/geo.routes.js`. El frontend NO llama a Nominatim directo; usa `services/api/geo.ts`.

## Negocios — Publicar negocio

Funcionalidad: desde la pestaña "Negocios" (`/negocios/nuevo`, antes placeholder) un `BUSINESS_OWNER` publica un negocio y sube hasta 10 imágenes.

### Gating por rol (frontend y backend)
- Frontend (`pages/NewBusinessPage.tsx`): `status === "loading"` → spinner; sin sesión → aviso con "Iniciar sesión"/"Crear cuenta"; `role !== "BUSINESS_OWNER"` → aviso "Tu cuenta no puede publicar negocios"; `BUSINESS_OWNER` → botón que abre un modal con el formulario.
- La entrada "Publica tu negocio" solo se muestra a dueños: filtrada en `Navbar` (desktop y móvil), columna "Negocios" del `Footer` (grid 4→3 columnas) y `PromoBanner` de la landing (solo `BUSINESS_OWNER`, botón → `/negocios/nuevo`). El botón "Publicar restaurante" de `RestaurantsPage` ya estaba condicionado a `role === "BUSINESS_OWNER"`. La ruta `/negocios/nuevo` sigue accesible directa con el aviso de gating.
- Backend SIEMPRE revalida el rol con middleware (`authRequired` + `requireRole("BUSINESS_OWNER")`); el gating de UI es solo UX.

### Registro con opción de dueño de negocio
- El registro (`pages/RegisterPage.tsx`) ahora tiene un paso "Tipo de cuenta" (`components/auth/AccountTypeStep.tsx`, tarjetas "Explorador" / "Tengo un negocio") y, si elige dueño, un paso OPCIONAL "Tu negocio" (`components/auth/BusinessInfoStep.tsx`: nombre, categoría, descripción) con botón "Omitir por ahora".
- El rol se envía en `POST /auth/register` (`role: "USER" | "BUSINESS_OWNER"`). El negocio NO se crea en el registro: los datos del paso opcional se guardan como draft en `sessionStorage` (`la-frontera:business-draft`, helpers en `lib/businessDraft.ts`) y prellenan `NewBusinessForm`.
- Al terminar el registro como dueño, `RegisterPage` redirige directo a `/negocios/nuevo` con `state.fromRegister = true`; `NewBusinessPage` abre el modal automáticamente (título "¡Cuéntanos de tu negocio!") y limpia el `location.state` para que un refresh no lo reabra.
- `NewBusinessForm` lee el draft una vez al montar (`readDraftDefaults` como inicializador de `useState`) y lo borra (`clearBusinessDraft`) al publicar con éxito. El flujo completo de publicación (4 pasos, imágenes, mapa, horarios, menú) sigue siendo la única vía para crear el negocio.

### Seguridad (defensa en profundidad, OWASP)
- Validación de entrada con `zod` en backend (`routes/businesses.routes.js`): longitudes máx, enums, regex de teléfono, `email`, `url` con esquema `http(s)://`, rechazo de HTML (`<`/`>`) y caracteres de control, normalización de espacios. Whitelist estricta → protege contra mass assignment (solo se pasa a Prisma lo validado).
- SQL injection: todo vía Prisma (queries parametrizadas). Prohibido concatenar SQL.
- XSS: React escapa por defecto; backend rechaza `<`/`>` en campos de texto; `website` valido que empiece con `http(s)://` (evita `javascript:`).
- Subida de imágenes (`lib/upload.js`): Multer memoryStorage con límite de nº de archivos (máx 10), `fileFilter` por MIME + verificación de **magic bytes** reales, `sharp` valida decodificación (sin restricciones de peso, dimensiones ni relación de aspecto). Se re-codifica con `sharp` (strip de EXIF/metadata) y se guarda con nombre **UUID** (nunca el nombre del usuario → evita path traversal). Almacenamiento en `backend/uploads/` (fuera del webroot de la app).
- `helmet()` global; rate limiting específico en `POST /businesses` (10/15min) y `POST /businesses/:id/gallery` (30/15min). Errores genéricos sin filtrar stack traces.
- Autorización de galería: se verifica `business.ownerId === req.userId`.

### Flujo de subida (frontend)
- `useCreateBusiness` + `useUploadGallery` (`hooks/useBusinesses.ts`) como `useMutation` (invalidan `["businesses"]`).
- Primero `POST /businesses` (devuelve `business.id`), luego `POST /businesses/:id/gallery` con las imágenes en un `FormData` (campo `"gallery"`). Si la galería falla tras crear el negocio, el formulario permite **reintentar la subida sin duplicar** el negocio (mantiene el `created.id`).
- `components/business/ImageUploader.tsx`: drag & drop + input, preview en grilla `aspect-video`, validación en vivo solo de tipo de archivo (sin límites de peso, dimensiones ni relación de aspecto), contador N/10 y botón por imagen para quitarla.
- `components/business/NewBusinessForm.tsx`: `react-hook-form` + `zodResolver`, usa `Field`/`inputClassName`, `Button` y `StepIndicator`; el schema de zod espeja los límites del backend (la autoridad final es el servidor).

### Formulario por pasos
- El formulario se divide en 4 pasos (`STEPS = ["Negocio", "Ubicación", "Contacto y horarios", "Fotos y menú"]`) para mantener ventanas pequeñas: (1) nombre, descripción, categoría y rango de precios; (2) ciudad + `MapPicker`; (3) teléfono, WhatsApp, correo, sitio web + horarios; (4) imágenes + menú + envío.
- `STEP_FIELDS` agrupa los campos de cada paso y `trigger()` valida solo el paso actual antes de avanzar ("Siguiente"); en el paso 3 también valida horarios (`validateHours`). Los valores persisten entre pasos porque `react-hook-form` mantiene su estado en el mismo `<form>`.
- Rango de precios: obligatorio en el formulario. Usa `requiredEnum(PRICE_RANGES, "Por favor selecciona tu rango de precio")` (no `z.enum().optional()`), porque un `<option value="">` en blanco pasaba `""` y el enum fallaba con el error técnico "Invalid enum value". El backend igualmente acepta `priceRange` ausente (default `MODERADO`).

### Horarios de atención y menú
- Horarios: modelo relacional `BusinessHour` (`businessId`, `dayOfWeek` 0=domingo–6=sábado, `opensAt`/`closesAt` "HH:MM"). Un día sin fila = cerrado. El formulario (`NewBusinessForm.tsx`) tiene un toggle "Agregar horarios" + editor de 7 días (checkbox "Abierto" + inputs `type="time"`); solo envía los días abiertos. Backend valida formato HH:MM y `closesAt > opensAt`, y crea las filas con `businessHour.createMany`.
- Menú: `Business.menuUrl String?`. Subida en `POST /businesses/:id/menu` (campo `"menu"`, Multer 1 archivo, sin límite de peso) con magic bytes para JPG/PNG/WebP/**PDF** (`%PDF`); PDF se guarda tal cual, imágenes se re-codifican con sharp. Frontend: input de archivo opcional en el formulario + `uploadBusinessMenu`/`useUploadMenu`.

### Ubicación (mapa + mejoras)
- `components/business/MapPicker.tsx`: Leaflet + OpenStreetMap; pin arrastrable + reverse-geocode que rellena la dirección; autocompletado (debounce) y búsqueda vía el proxy del backend; botón "Usar mi ubicación" (geolocalización) que avisa si el pin cae a >200 km de una ciudad cubierta.
- El proxy geo (`routes/geo.routes.js`) restringe la búsqueda a un `viewbox` de ~50 km alrededor de la ciudad elegida (`countrycodes=mx&bounded=1`); sin ciudad, busca en todo México.

### Archivos nuevos / modificados
- Backend nuevos: `backend/lib/slug.js`, `backend/lib/upload.js`, `backend/lib/hours.js`, `backend/routes/businesses.routes.js`, `backend/routes/geo.routes.js`, `backend/prisma/seed.js`.
- Backend modificados: `backend/lib/auth.js` (`requireRole`), `backend/lib/serialize.js` (`serializeBusiness`/`serializeReview`), `backend/server.js` (helmet, multer, estático `/uploads`, montaje `/api/v1/businesses` y `/api/v1/geo`), `backend/.env.example` (`PUBLIC_BASE_URL`), `backend/package.json` (deps: `multer`, `helmet`, `express-rate-limit`, `sharp`; script `prisma:seed`).
- Frontend nuevos: `frontend/src/pages/NewBusinessPage.tsx`, `frontend/src/pages/RestaurantsPage.tsx`, `frontend/src/pages/RestaurantDetailPage.tsx`, `frontend/src/components/business/NewBusinessForm.tsx`, `frontend/src/components/business/ImageUploader.tsx`, `frontend/src/components/business/MapPicker.tsx`, `frontend/src/services/api/geo.ts`, `frontend/src/services/api/restaurants.ts`, `frontend/src/services/api/reviews.ts`.
- Frontend modificados: `frontend/src/App.tsx` (rutas `/negocios/nuevo`, `/restaurantes`, `/negocios/:slug`), `frontend/src/services/api/client.ts` (`apiClient.upload`), `frontend/src/services/api/businesses.ts` (`createBusiness`, `uploadBusinessGallery`, `uploadBusinessMenu`), `frontend/src/hooks/useBusinesses.ts` (`useCreateBusiness`, `useUploadGallery`, `useUploadMenu`), `frontend/src/types/business.ts`.
- Registro con dueño de negocio — nuevos: `frontend/src/components/auth/AccountTypeStep.tsx`, `frontend/src/components/auth/BusinessInfoStep.tsx`, `frontend/src/lib/businessDraft.ts`. Modificados: `frontend/src/pages/RegisterPage.tsx` (steps dinámicos + redirect), `frontend/src/pages/NewBusinessPage.tsx` (auto-apertura desde registro), `frontend/src/components/business/NewBusinessForm.tsx` (prefill del draft), `frontend/src/types/user.ts` (`RegisterInput.role`), `backend/routes/auth.routes.js` (`role` con whitelist en `POST /auth/register`).
- Limpieza de imports no usados: `components/business/Hero.tsx` y `components/widgets/BorderWidgetsStrip.tsx` (ya no importan `Eyebrow`) — necesario para que `npm run build` (TS estricto, `noUnusedLocals`) pase.

### Notas
- Las imágenes y el menú se sirven en `http://localhost:4000/uploads/<uuid>.<ext>` (`express.static`); en producción conviene un bucket/CDN. `PUBLIC_BASE_URL` (en `backend/.env`) controla la base de las URLs; `helmet` se configura con `crossOriginResourcePolicy: cross-origin` para permitir cargarlas desde el frontend (5173).
- El `slug` lo genera el backend (`lib/slug.js`, sin acentos + sufijo aleatorio si colisiona); `status` por defecto `ACTIVE`; `featured`, `avgRating`, `reviewCount` y `ownerId` nunca los manda el cliente (`ownerId` sale de `req.userId`).

## Marketplace — Subida de imagen de publicación

El formulario de marketplace (`CreateListingModal`) permite subir una foto del artículo desde el dispositivo (drag & drop o selector de archivos) en lugar de pegar una URL.

### Flujo
- `POST /marketplace/images` (auth + rate limit 30/15min, Multer `single("image")`) valida magic bytes + sharp, guarda con UUID en `uploads/`, devuelve `{ url }`. No escribe en BD.
- El cliente sube la imagen primero (`uploadMarketplaceImage` → `useUploadMarketplaceImage`), luego crea/edita la publicación con la URL devuelta en `imageUrl`. Si la subida falla, el modal permanece abierto con banner de error y el usuario puede reintentar sin duplicar la publicación.
- En modo edición, el modal muestra la imagen actual como preview; si el usuario sube una nueva, reemplaza `imageUrl` en el PATCH.
- `ListingImageField` (`components/marketplace/ListingImageField.tsx`) es el componente de subida (1 imagen, validación de tipo en cliente, preview, botón quitar).

### Archivos
- Backend modificados: `backend/routes/marketplace.routes.js` (endpoint `POST /images`, rate limiter, imports de `lib/upload.js`).
- Frontend nuevos: `frontend/src/components/marketplace/ListingImageField.tsx`.
- Frontend modificados: `frontend/src/components/marketplace/CreateListingModal.tsx` (uploader + banner de error + nueva firma `onSubmit(input, imageFile)`), `frontend/src/pages/MarketplacePage.tsx` (orquestación upload → create), `frontend/src/pages/MyMarketplaceListingsPage.tsx` (orquestación upload → patch), `frontend/src/services/api/marketplace.ts` (`uploadMarketplaceImage`), `frontend/src/hooks/useMarketplace.ts` (`useUploadMarketplaceImage`).

## Perfil de usuario (`/perfil`)

Página de perfil donde el usuario edita su información personal y puede convertir su cuenta en dueño de negocio.

### Edición de información personal
- Formulario con `name`, `phone` y `city` (select de `CITY_OPTIONS`) → `PATCH /users/me` (endpoint ya existente). `phone` acepta `null` para limpiarse (`UpdateMeInput` refleja eso). `email`, `role`, `interests`, `isActive` y `createdAt` son solo lectura en la UI.
- Foto de perfil: subida de archivo (JPG/PNG/WebP) en lugar de URL. `POST /users/me/avatar` (en `backend/routes/users.routes.js`, auth + rate limit 30/15min, Multer `single("avatar")`, magic bytes + sharp, UUID en `uploads/`) devuelve `{ url }` sin escribir en BD; la página persiste la URL con `updateMe({ avatarUrl: url })`, lo que actualiza el `user` en contexto (y el avatar del Navbar al instante). El círculo del avatar pulsa mientras sube; errores con `role="alert"`.
- Guardado con `updateMe` del `AuthContext` (actualiza el `user` en contexto). Banners: éxito verde-tint, error `alto` con `role="alert"`.

### Conversión a BUSINESS_OWNER
- `POST /users/me/upgrade-to-owner` (en `backend/routes/users.routes.js`): endpoint de un solo propósito, SIN body (no hay mass assignment) y nunca permite `ADMIN`. `USER` → `BUSINESS_OWNER`; si ya es dueño responde el usuario sin cambios (idempotente); `ADMIN` recibe 403.
- Frontend: `upgradeToOwner` en `services/api/auth.ts` + método homónimo en `AuthContext` (actualiza `user.role`). Al actualizarse el rol, el `Navbar` muestra "Publica tu negocio" automáticamente (ya está condicionado a `role === "BUSINESS_OWNER"`).
- UX: botón "Convertirme en dueño de negocio" en la card lateral abre un modal (`role="dialog"`) con 3 estados — `pending` (espera con pulso), `success` (check + botón "Publicar mi negocio" → `/negocios/nuevo`) y `error` (reintentar/cerrar). El modal no se cierra con clic fuera mientras está en `pending`.

### Archivos
- Backend modificados: `backend/routes/users.routes.js` (endpoints `POST /me/upgrade-to-owner` y `POST /me/avatar`).
- Frontend nuevos: `frontend/src/pages/ProfilePage.tsx`.
- Frontend modificados: `frontend/src/App.tsx` (ruta `/perfil`), `frontend/src/services/api/auth.ts` (`upgradeToOwner`, `uploadAvatarImage`), `frontend/src/context/AuthContext.tsx` (`upgradeToOwner` en el contexto), `frontend/src/components/layout/Navbar.tsx` (avatar → `/perfil` con `cursor-pointer` en desktop, botón "Mi perfil" en menú móvil), `frontend/src/types/user.ts` (`UpdateMeInput.phone/avatarUrl` aceptan `null`).

## Favoritos de negocios

Favoritos persistentes por usuario, guardados en la tabla `favorites` (userId + businessId, par único). Antes vivían en `useState` local y se perdían al refrescar; ahora se sincronizan con el perfil.

### Backend (`backend/routes/users.routes.js`, todos bajo `authRequired`)
- `GET /users/me/favorites` — lista los negocios favoritos del usuario (galería + horarios incluidos, serializados con `serializeBusiness`), ordenados por fecha desc.
- `PUT /users/me/favorites/:businessId` — agrega favorito con `upsert` (idempotente); 404 si el negocio no existe.
- `DELETE /users/me/favorites/:businessId` — quita favorito con `deleteMany` (idempotente). Sin rate limit (consistente con reseñas). No requiere migraciones (la tabla ya existe).

### Frontend
- `services/api/favorites.ts`: `getMyFavorites()` (normaliza con `toBusiness`), `addFavorite(businessId)`, `removeFavorite(businessId)`.
- `hooks/useFavorites.ts`: `useFavorites()` (query `["favorites","mine"]`, solo habilitada autenticado) y `useToggleFavorite()` (mutation con optimistic update + rollback en error + invalidación al terminar).
- `RestaurantsPage` y `RestaurantDetailPage` leen el estado real de favoritos (Set de slugs derivado con `useMemo`); sin sesión el toggle redirige a `/login`. El filtro "Solo favoritos" sigue siendo client-side sobre la lista cargada.
- `ProfilePage` muestra la sección "Tus favoritos" (eyebrow "Guardados"): skeletons, `EmptyState` con CTA a `/explorar` y grid de `BusinessCard` (2/3/4 cols).
- El estado "es favorito" NO viaja en los endpoints públicos de negocios: se fusiona en el cliente con la query de favoritos.

## Panel de administración (`/admin`)

Sección separada solo para rol `ADMIN`. Sin Navbar/Footer públicos: `layouts/AdminLayout.tsx` con sidebar propio (Dashboard / Negocios / Reseñas / Usuarios). Ruta protegida por `components/admin/AdminRoute.tsx` (sin sesión → `/login`; rol ≠ `ADMIN` → aviso sin permisos; carga → spinner).

### Backend (`backend/routes/admin.routes.js`, montado en `/api/v1/admin`)
- Todas bajo `authRequired` + `requireRole("ADMIN")`.
- `GET /admin/stats` — KPIs (usuarios, negocios por estado, reseñas, marketplace) + últimos 5 negocios, reseñas y usuarios.
- `GET /admin/businesses` — todos los negocios (incluye archivados) con filtros `city`, `category`, `status`, `q` y dueño embebido.
- `PATCH /admin/businesses/:id` — solo `status` (`ACTIVE`/`ARCHIVED`) y/o `featured` (whitelist, sin edición libre).
- `DELETE /admin/businesses/:id` — elimina el negocio (cascade a reseñas/galería/horarios/favoritos).
- `GET /admin/reviews` — reseñas con filtros `q` (autor/negocio/comentario) y `rating`, tope 100.
- `DELETE /admin/reviews/:id` — elimina la reseña y recalcula `avgRating`/`reviewCount` del negocio.
- `GET /admin/users` — usuarios con filtros `q`, `role`, `city`, tope 100, con nº de negocios.
- `PATCH /admin/users/:id` — cambiar `role` (`USER`/`BUSINESS_OWNER`, whitelist estricta, **nunca ADMIN**; rechaza si el objetivo es `ADMIN`) y/o `isActive`.
- Ajuste: `GET /businesses/:slug` ahora solo devuelve negocios `status: "ACTIVE"` (un archivado desaparece de la vista pública).

### Frontend
- `services/api/admin.ts` (tipos + métodos), `hooks/useAdmin.ts` (queries con `placeholderData` + mutations que invalidan por sección).
- Páginas en `pages/admin/`: `AdminDashboardPage` (StatCards + actividad reciente), `AdminBusinessesPage` (filtros + destacar/archivar/eliminar), `AdminReviewsPage` (filtros + eliminar), `AdminUsersPage` (cambiar rol/activar-desactivar; protege cuenta propia y admins).
- Componentes en `components/admin/`: `StatCard` (valores en Plex Mono tabular, `alert` para ámbar), `ConfirmDialog`, `AdminRoute`, `AdminPageHeader` (eyebrow + título + descripción + `RouteLine`, usado por las 4 páginas).
- `AdminLayout`: sidebar blanco con wordmark (`Wordmark`), iconos de navegación, tarjeta del usuario (avatar + badge "Admin") y acciones "Ver sitio"/"Cerrar sesión"; activo = `bg-verde-tint`. El dashboard muestra 3 listados de actividad reciente (negocios, reseñas, usuarios recientes).
- `Navbar`: link "Admin" solo visible con `role === "ADMIN"` (desktop y móvil).
- Roles `ADMIN` no se asignan desde el cliente: se configuran directamente en BD.
