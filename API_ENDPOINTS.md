# La Frontera — Contrato REST (v1)

Base URL: `/api/v1`. Todas las respuestas: `{ data, meta? }` en éxito,
`{ error: { code, message } }` en fallo. Paginación por `?page=&limit=`.

## Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registro con email/password |
| POST | `/auth/login` | Login con email/password → JWT |
| POST | `/auth/google` | Login/registro con Google OAuth (id_token) |
| POST | `/auth/refresh` | Refresh de access token |
| POST | `/auth/logout` | Invalida refresh token |
| GET  | `/auth/me` | Usuario autenticado actual |

## Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| GET  | `/users/:id` | Perfil público |
| PATCH | `/users/me` | Editar perfil propio |
| GET  | `/users/me/favorites` | Favoritos del usuario |
| POST | `/users/me/favorites/:businessId` | Marcar favorito |
| DELETE | `/users/me/favorites/:businessId` | Quitar favorito |

## Negocios
| Método | Ruta | Descripción |
|---|---|---|
| GET  | `/businesses` | Listado con filtros (`city`, `category`, `q`, `priceRange`, `featured`) |
| GET  | `/businesses/featured` | Destacados para la landing |
| GET  | `/businesses/:slug` | Detalle por slug |
| POST | `/businesses` | Crear negocio (rol BUSINESS_OWNER) |
| PATCH | `/businesses/:id` | Editar negocio propio |
| DELETE | `/businesses/:id` | Archivar negocio propio |
| POST | `/businesses/:id/gallery` | Subir imágenes (Multer) |
| GET  | `/businesses/:id/reviews` | Reseñas del negocio |
| POST | `/businesses/:id/reviews` | Crear reseña |
| GET  | `/businesses/:id/products` | Productos/menú |
| POST | `/businesses/:id/products` | Crear producto |
| POST | `/businesses/:id/promotions` | Crear promoción |

## Marketplace
| Método | Ruta | Descripción |
|---|---|---|
| GET  | `/marketplace` | Listado con filtros (`city`, `category`, `q`) |
| GET  | `/marketplace/:id` | Detalle de anuncio |
| POST | `/marketplace` | Crear anuncio (solo datos de contacto) |
| PATCH | `/marketplace/:id` | Editar anuncio propio |
| DELETE | `/marketplace/:id` | Eliminar anuncio propio |

## Eventos
| Método | Ruta | Descripción |
|---|---|---|
| GET  | `/events` | Próximos eventos (filtros `city`, `from`, `to`) |
| GET  | `/events/:id` | Detalle |
| POST | `/events` | Crear evento (negocio dueño) |

## Widgets de Frontera
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/widgets/exchange-rate` | Último USD→MXN |
| GET | `/widgets/border-wait?city=` | Tiempos de espera en garitas por ciudad |
| GET | `/widgets/weather?city=` | Clima actual (proxy a proveedor externo) |
| GET | `/widgets/gas-price?city=` | Precios de gasolina por ciudad |

## Búsqueda global
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/search?q=&city=` | Búsqueda combinada negocios + eventos + marketplace |

---

Estos endpoints son el contrato que consumen los archivos en
`frontend/src/services/api/*.ts`. Hoy esos archivos devuelven mock data con
la misma forma (`data.d.ts` / `types/*.ts`); al conectar el backend real,
solo se reemplaza la implementación interna de cada función, sin tocar
hooks ni componentes.
