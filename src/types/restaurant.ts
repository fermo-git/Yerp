// Tipos para la sección de rating de restaurantes.
// Reutiliza Business (types/business.ts) como base: un Restaurant es un
// Business de categoría RESTAURANTE con un campo extra `createdAt` para
// poder ordenar por "novedades". Reviews/rating son provisionales por
// ahora (avgRating/reviewCount ya viven en Business); cuando exista el
// endpoint real (`GET/POST /businesses/:id/reviews`, ver API_ENDPOINTS.md)
// solo cambia services/api/restaurants.ts.

import type { Business, BorderCity } from "@/types/business";

export interface Restaurant extends Business {
  createdAt: string;
}

export type RestaurantSort = "RECIENTES" | "RATING_DESC" | "REVIEWS_DESC";

export interface RestaurantQueryParams {
  q?: string;
  city?: BorderCity | "";
  minRating?: number;
  sort?: RestaurantSort;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

/** Umbrales para el filtro rápido de estrellas (tipo Google Maps: "4.0+"). */
export const MIN_RATING_OPTIONS = [
  { value: 0, label: "Cualquier rating" },
  { value: 3, label: "3.0+" },
  { value: 3.5, label: "3.5+" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
] as const;

export const RESTAURANT_SORT_LABELS: Record<RestaurantSort, string> = {
  RECIENTES: "Novedades",
  RATING_DESC: "Mejor calificados",
  REVIEWS_DESC: "Más reseñados",
};
