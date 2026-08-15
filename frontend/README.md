# La Frontera — Arquitectura General

Ecosistema digital regional para ciudades fronterizas de México: negocios, turismo,
eventos y marketplace local. Este documento cubre la arquitectura completa
(frontend + backend) como contrato de referencia. El código de esta iteración
implementa **solo el frontend**; el backend se deja especificado para
implementarse después contra el mismo contrato (schema + endpoints).

## 1. Estructura de carpetas (monorepo lógico)

```
la-frontera/
├── frontend/                      # React 19 + Vite (esta entrega)
│   ├── public/
│   │   └── fonts/                 # General Sans / Inter (self-hosted, ver index.html)
│   ├── src/
│   │   ├── assets/                # imágenes estáticas, ilustraciones de estados vacíos
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Footer, MainLayout
│   │   │   ├── ui/                 # Button, Card, Badge, Skeleton, Input, Rating (design system)
│   │   │   ├── business/          # BusinessCard, BusinessGrid, CategoryPill
│   │   │   └── widgets/           # ExchangeRateWidget, BorderWaitWidget, WeatherWidget, GasPriceWidget
│   │   ├── pages/                 # LandingPage, ExplorePage, BusinessDetailPage, etc.
│   │   ├── layouts/               # MainLayout (Navbar + Outlet + Footer)
│   │   ├── hooks/                 # useBusinesses, useFeaturedBusinesses, useBorderWidgets...
│   │   ├── services/
│   │   │   ├── api/               # client.ts (axios/fetch base) + businesses.ts, users.ts...
│   │   │   └── mocks/             # mock data tipada según Prisma schema (temporal)
│   │   ├── lib/                   # queryClient.ts, router.tsx
│   │   ├── types/                 # tipos compartidos (Business, Review, User, Category...)
│   │   ├── utils/                 # cn.ts, formatCurrency.ts, formatDistance.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css              # Tailwind v4 + design tokens (@theme)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                       # Node.js + Express (a implementar después)
│   ├── src/
│   │   ├── modules/               # Arquitectura modular por dominio (screaming architecture)
│   │   │   ├── auth/              # controller, service, routes, validators (JWT + Google OAuth)
│   │   │   ├── users/
│   │   │   ├── businesses/
│   │   │   ├── reviews/
│   │   │   ├── marketplace/
│   │   │   ├── events/
│   │   │   └── widgets/           # tipo de cambio, garitas, clima, gasolina (jobs + cache)
│   │   ├── middlewares/           # auth.middleware, error.middleware, upload.middleware (Multer)
│   │   ├── config/                # env.ts, cors.ts, googleMaps.ts
│   │   ├── lib/                   # prisma client singleton
│   │   ├── jobs/                  # cron: refrescar widgets de frontera cada N minutos
│   │   ├── utils/
│   │   └── app.ts / server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── package.json
│
├── prisma/schema.prisma           # copia de referencia usada como contrato (ver /prisma)
└── API_ENDPOINTS.md               # contrato REST usado para tipar los services del frontend
```

**Por qué esta separación:** cada módulo del backend es autocontenible
(controller/service/routes/validators), lo que permite mapear 1:1 cada
carpeta de `services/api` del frontend con un módulo del backend. El
frontend nunca importa nada del backend directamente; solo consume el
contrato REST documentado en `API_ENDPOINTS.md`.

## 2. Decisiones clave de arquitectura frontend

- **Ruteo por página, no por feature**: `pages/` contiene componentes de página;
  `components/` contiene piezas reutilizables agrupadas por dominio visual.
- **TanStack Query como única fuente de estado remoto**: no se usa Redux/Zustand
  para datos de servidor. Estado de UI local (modales, filtros) vive en el
  componente o en Context puntual si se comparte entre pocos componentes.
- **Capa de servicios desacoplada**: `services/api/*.ts` expone funciones async
  tipadas (`getFeaturedBusinesses()`, `getBusinessById(id)`...). Hoy leen de
  `services/mocks`; mañana solo cambia el `fetch`/`axios` interno — los hooks
  y componentes no se tocan.
- **Tipos compartidos derivados del schema Prisma**: `types/` refleja los
  modelos de `schema.prisma` para que, cuando el backend exista, los tipos de
  respuesta de la API coincidan 1:1 con lo que el frontend ya espera.

## 3. Stack confirmado

| Capa | Tecnología |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion, React Router, TanStack Query, React Hook Form + Zod |
| Backend | Node.js, Express, PostgreSQL, Prisma ORM |
| Auth | JWT (sesión propia) + Google OAuth (login social) |
| Archivos | Multer (uploads locales/S3-compatible) |
| Mapas | Google Maps API (geocoding + mapas de negocio) |
