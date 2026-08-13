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

export const CITY_OPTIONS: { value: BorderCity; label: string }[] = (
  Object.entries(CITY_LABELS) as [BorderCity, string][]
).map(([value, label]) => ({ value, label }));

export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  ECONOMICO: "$",
  MODERADO: "$$",
  ALTO: "$$$",
  PREMIUM: "$$$$",
};

export interface BorderWidgetsSnapshot {
  exchangeRate: { usdToMxn: number; updatedAt: string };
  borderWait: { city: BorderCity; crossingName: string; waitMinutes: number; direction: "NORTE" | "SUR" }[];
  weather: { city: BorderCity; tempC: number; condition: string };
  gasPrice: { city: BorderCity; regularPrice: number; premiumPrice: number };
}
