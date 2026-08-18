// Tipos espejo del schema.prisma — usados por services/api y mocks.

export type BorderCity =
  | "TIJUANA"
  | "MEXICALI"
  | "CIUDAD_JUAREZ"
  | "NUEVO_LAREDO"
  | "REYNOSA"
  | "MATAMOROS"
  | "NOGALES"
  | "PIEDRAS_NEGRAS"
  | "SAN_LUIS_RIO_COLORADO"
  | "AGUA_PRIETA";

export type BusinessCategory =
  | "RESTAURANTE"
  | "CAFETERIA"
  | "BAR"
  | "TIENDA"
  | "SALUD"
  | "BELLEZA"
  | "SERVICIOS_PROFESIONALES"
  | "ENTRETENIMIENTO"
  | "HOTEL"
  | "AUTOMOTRIZ"
  | "EDUCACION"
  | "OTRO";

export type PriceRange = "ECONOMICO" | "MODERADO" | "ALTO" | "PREMIUM";

export type RestaurantSort = "NOVEDADES" | "POPULARIDAD" | "MEJOR_VALORADOS";

export interface BusinessHours {
  dayOfWeek: number; // 0 (domingo) - 6 (sábado)
  opensAt: string; // "HH:MM" en 24h
  closesAt: string; // "HH:MM" en 24h
}

export interface RestaurantFilters {
  city?: BorderCity;
  q: string;
  rating: number | null;
  price: PriceRange[];
  favorites: boolean;
  sort: RestaurantSort;
}

export type BusinessSort = RestaurantSort;

export interface BusinessQueryParams {
  city?: BorderCity;
  category?: BusinessCategory;
  q?: string;
  minRating?: number;
  priceRange?: PriceRange[];
  sort?: BusinessSort;
  featured?: boolean;
  limit?: number;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: BusinessCategory;
  priceRange?: PriceRange;
  city: BorderCity;
  address: string;
  latitude: number;
  longitude: number;
  coverImageUrl: string;
  gallery: string[];
  featured: boolean;
  avgRating: number;
  reviewCount: number;
  hours?: BusinessHours[];
  createdAt?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  menuUrl?: string;
  openStatus?: {
    state: "OPEN" | "CLOSING_SOON" | "CLOSED";
    label: string;
  };
}

export interface RecentActivityItem {
  id: string;
  userName: string;
  userAvatarUrl: string;
  action: "REVIEW" | "PHOTO";
  timeAgo: string;
  business: Pick<Business, "id" | "slug" | "name" | "coverImageUrl" | "avgRating" | "reviewCount" | "category">;
  reviewComment?: string;
  reviewRating?: number;
}

export interface Review {
  id: string;
  businessId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}

export const CITY_LABELS: Record<BorderCity, string> = {
  TIJUANA: "Tijuana",
  MEXICALI: "Mexicali",
  CIUDAD_JUAREZ: "Ciudad Juárez",
  NUEVO_LAREDO: "Nuevo Laredo",
  REYNOSA: "Reynosa",
  MATAMOROS: "Matamoros",
  NOGALES: "Nogales",
  PIEDRAS_NEGRAS: "Piedras Negras",
  SAN_LUIS_RIO_COLORADO: "San Luis Río Colorado",
  AGUA_PRIETA: "Agua Prieta",
};

export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  RESTAURANTE: "Restaurantes",
  CAFETERIA: "Cafeterías",
  BAR: "Bares",
  TIENDA: "Tiendas",
  SALUD: "Salud",
  BELLEZA: "Belleza",
  SERVICIOS_PROFESIONALES: "Servicios profesionales",
  ENTRETENIMIENTO: "Entretenimiento",
  HOTEL: "Hoteles",
  AUTOMOTRIZ: "Automotriz",
  EDUCACION: "Educación",
  OTRO: "Otros",
};

export const BUSINESS_CATEGORIES = [
  "RESTAURANTE",
  "CAFETERIA",
  "BAR",
  "TIENDA",
  "SALUD",
  "BELLEZA",
  "SERVICIOS_PROFESIONALES",
  "ENTRETENIMIENTO",
  "HOTEL",
  "AUTOMOTRIZ",
  "EDUCACION",
  "OTRO",
] as const satisfies readonly BusinessCategory[];

export const PRICE_RANGES = ["ECONOMICO", "MODERADO", "ALTO", "PREMIUM"] as const satisfies readonly PriceRange[];

export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  ECONOMICO: "$",
  MODERADO: "$$",
  ALTO: "$$$",
  PREMIUM: "$$$$",
};

export const PRICE_RANGE_FULL_LABELS: Record<PriceRange, string> = {
  ECONOMICO: "Económico",
  MODERADO: "Moderado",
  ALTO: "Alto",
  PREMIUM: "Premium",
};

export const PRICE_RANGE_OPTIONS = PRICE_RANGES.map((value) => ({
  value,
  label: PRICE_RANGE_FULL_LABELS[value],
}));

export const CITY_OPTIONS: { value: BorderCity; label: string }[] = (
  Object.entries(CITY_LABELS) as [BorderCity, string][]
).map(([value, label]) => ({ value, label }));

export const BORDER_CITIES = [
  "TIJUANA",
  "MEXICALI",
  "CIUDAD_JUAREZ",
  "NUEVO_LAREDO",
  "REYNOSA",
  "MATAMOROS",
  "NOGALES",
  "PIEDRAS_NEGRAS",
  "SAN_LUIS_RIO_COLORADO",
  "AGUA_PRIETA",
] as const satisfies readonly BorderCity[];

export interface BorderWidgetsSnapshot {
  exchangeRate: { usdToMxn: number; changePct?: number; updatedAt: string };
  borderWait: { city: BorderCity; crossingName: string; waitMinutes: number; direction: "NORTE" | "SUR" }[];
  weather: { city: BorderCity; tempC: number; condition: string };
  gasPrice: { city: BorderCity; regularPrice: number; premiumPrice: number };
}

// -----------------------------------------------------------------
// Contrato real de la API (POST /businesses, POST /businesses/:id/gallery)
// `BusinessDTO` refleja el objeto negocio que devuelve el backend; los
// campos que en el modelo son opcionales/nullable se marcan como `| null`.
// El frontend de mocks usa `Business` (más rico); este tipo es para la
// interacción con endpoints reales de creación.
// -----------------------------------------------------------------

export interface BusinessHourDTO {
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
}

export interface BusinessDTO {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: BusinessCategory;
  priceRange: PriceRange;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  menuUrl: string | null;
  hours: BusinessHourDTO[];
  featured: boolean;
  avgRating: number;
  reviewCount: number;
  gallery: string[];
  coverImageUrl: string | null;
}

export interface CreateBusinessInput {
  name: string;
  description: string;
  category: BusinessCategory;
  priceRange?: PriceRange;
  city: BorderCity;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  hours?: BusinessHourDTO[];
}

export interface CreateBusinessResponse {
  business: BusinessDTO;
}

export interface GalleryImageDTO {
  id: string;
  url: string;
  order: number;
}

export interface UploadGalleryResponse {
  gallery: GalleryImageDTO[];
}
