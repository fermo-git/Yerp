import type { BorderCity, Business, BusinessCategory, PriceRange } from "@/types/business";

/**
 * Forma real que devuelve GET /businesses (serializeBusiness del backend).
 * Algunos campos llegan `null`/`""` (sin galería, sin descripción) y `city`
 * viene como string plano; este adaptador los normaliza al tipo `Business`.
 */
export interface ApiBusiness {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: BusinessCategory;
  priceRange: PriceRange | null;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  coverImageUrl: string | null;
  gallery: string[];
  featured: boolean;
  avgRating: number;
  reviewCount: number;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  menuUrl: string | null;
  hours?: Business["hours"];
  openStatus?: Business["openStatus"];
  createdAt?: string;
}

export const BUSINESS_PLACEHOLDER = "/placeholder-business.svg";

export function toBusiness(raw: ApiBusiness): Business {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? "",
    category: raw.category,
    priceRange: raw.priceRange ?? undefined,
    city: raw.city as BorderCity,
    address: raw.address ?? "",
    latitude: raw.latitude ?? 0,
    longitude: raw.longitude ?? 0,
    coverImageUrl: raw.coverImageUrl || BUSINESS_PLACEHOLDER,
    gallery: raw.gallery ?? [],
    featured: raw.featured,
    avgRating: raw.avgRating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    hours: raw.hours,
    createdAt: raw.createdAt,
    phone: raw.phone ?? undefined,
    whatsapp: raw.whatsapp ?? undefined,
    email: raw.email ?? undefined,
    website: raw.website ?? undefined,
    openStatus: raw.openStatus,
  };
}
