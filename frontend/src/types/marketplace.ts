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
  sellerId: string;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  category: MarketplaceCategory;
  status: MarketplaceStatus;
  city: string;
  imageUrl: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  contactEmail: string | null;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    avatarUrl: string | null;
    city: string;
  };
}

export interface CreateListingInput {
  title: string;
  description?: string | null;
  price?: number | null;
  category: MarketplaceCategory;
  city: string;
  imageUrl?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  contactEmail?: string | null;
}

export interface MarketplaceListingsResponse {
  listings: MarketplaceListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MarketplaceFilters {
  city?: string;
  category?: MarketplaceCategory;
  q?: string;
  page?: number;
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

export const MARKETPLACE_CATEGORY_OPTIONS: { value: MarketplaceCategory; label: string }[] = (
  Object.entries(MARKETPLACE_CATEGORY_LABELS) as [MarketplaceCategory, string][]
).map(([value, label]) => ({ value, label }));
