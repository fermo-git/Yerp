# Agent Guide

## Scope

- `frontend/` — React 19 + Vite SPA. `backend/` — Express + Prisma API (auth + negocios/restaurantes).
- Auth y restaurantes usan la API real (`backend`); widgets y la landing "destacados" siguen leyendo mocks tipados.

## Database & backend

- PostgreSQL vía Docker: `docker compose up -d` (puerto `5433`, base `lafrontera`). Credenciales en `backend/.env`.
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

- `services/api/auth.ts`, `restaurants.ts` y `reviews.ts` usan `apiClient` (real); los demás services (widgets, actividad) usan mocks con latencia (`mockDelay`).
- `apiClient` lee `VITE_API_URL`, adjunta `Authorization: Bearer` desde `localStorage` (`la-frontera:token`) y desenvuelve el campo `data` del envelope REST `{ data }` / `{ error: { code, message } }`.
- Endpoints auth implementados: `POST /auth/register|login`, `GET /auth/me`, `PATCH /users/me`, `GET|PUT /users/me/interests`. Google OAuth es un stub (`501`).
- Endpoints negocios implementados: `GET /businesses` (filtros `city`, `category`, `q`, `minRating`, `priceRange`, `sort`), `GET /businesses/:slug`, `GET|POST /businesses/:id/reviews` (POST requiere auth, 1 reseña por usuario, recalcula `avgRating`/`reviewCount`). `isOpen` se calcula server-side con mapa ciudad→timezone en `backend/lib/hours.js`.
