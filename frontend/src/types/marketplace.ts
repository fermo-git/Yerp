// Tipos espejo del schema.prisma (modelo MarketplaceListing) — ver
// "La Frontera — Diccionario de Datos", sección 7.
// Reutiliza BorderCity de types/business.ts: el campo `city` es String en el
// schema real (sin migración al agregar ciudades), pero el frontend ya
// trabaja con el set cerrado de ciudades fronterizas del proyecto.

import type { BorderCity } from "@/types/business";

export type MarketplaceCategory =
  | "VEHICULOS"
  | "INMUEBLES"
  | "ELECTRONICA"
  | "HOGAR_Y_JARDIN"
  | "EMPLEO"
  | "SERVICIOS"
  | "MODA"
  | "OTRO";

export type MarketplaceStatus = "ACTIVE" | "SOLD" | "EXPIRED" | "ARCHIVED";

export interface MarketplaceListing {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | null; // null = "a tratar"
  category: MarketplaceCategory;
  status: MarketplaceStatus;
  city: BorderCity;
  imageUrl: string;
  contactName: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  contactEmail?: string;
  createdAt: string;
}

export const MARKETPLACE_CATEGORY_LABELS: Record<MarketplaceCategory, string> = {
  VEHICULOS: "Vehículos",
  INMUEBLES: "Inmuebles",
  ELECTRONICA: "Electrónica",
  HOGAR_Y_JARDIN: "Hogar y jardín",
  EMPLEO: "Empleo",
  SERVICIOS: "Servicios",
  MODA: "Moda",
  OTRO: "Otro",
};

export const MARKETPLACE_STATUS_LABELS: Record<MarketplaceStatus, string> = {
  ACTIVE: "Disponible",
  SOLD: "Vendido",
  EXPIRED: "Expirado",
  ARCHIVED: "Archivado",
};

/** Orden usado por el filtro de la página de listado. */
export type MarketplaceSort = "RECIENTES" | "PRECIO_ASC" | "PRECIO_DESC";

export interface MarketplaceQueryParams {
  city?: BorderCity;
  category?: MarketplaceCategory;
  q?: string;
  sort?: MarketplaceSort;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
