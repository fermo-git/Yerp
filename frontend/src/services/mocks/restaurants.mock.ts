import type { Restaurant } from "@/types/restaurant";
import type { BorderCity, PriceRange } from "@/types/business";

// -----------------------------------------------------------------
// Mock de Restaurant — igual patrón que MOCK_BUSINESSES /
// MOCK_MARKETPLACE_LISTINGS (plantillas + generación plana). Todo
// provisional: cuando exista el endpoint real esto se reemplaza por
// la respuesta de GET /businesses?category=RESTAURANTE.
// -----------------------------------------------------------------

interface RestaurantTemplate {
  name: string;
  description: string;
  city: BorderCity;
  address: string;
  priceRange: PriceRange;
  avgRating: number;
  reviewCount: number;
  daysAgo: number; // para simular createdAt / "novedades"
  imageUrl: string;
  featured?: boolean;
}

const TEMPLATES: RestaurantTemplate[] = [
  {
    name: "Tacos El Fénix",
    description: "Tacos de carne asada al carbón, receta de tres generaciones en el centro de Mexicali.",
    city: "MEXICALI",
    address: "Av. Reforma 512, Centro",
    priceRange: "ECONOMICO",
    avgRating: 4.8,
    reviewCount: 612,
    daysAgo: 800,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    name: "Cervecería Frontera Norte",
    description: "Cervecería artesanal con 12 estilos propios y música en vivo los jueves.",
    city: "NOGALES",
    address: "Calle Obregón 88",
    priceRange: "MODERADO",
    avgRating: 4.7,
    reviewCount: 255,
    daysAgo: 400,
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    name: "Mariscos La Bahía",
    description: "Mariscos frescos de la costa de Sonora, famoso por su aguachile y camarones a la diabla.",
    city: "SAN_LUIS_RIO_COLORADO",
    address: "Blvd. Progreso 245",
    priceRange: "MODERADO",
    avgRating: 4.6,
    reviewCount: 389,
    daysAgo: 2,
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Asadero Los Compadres",
    description: "Carnes al carbón, cortes de res y arrachera con las clásicas tortillas de harina recién hechas.",
    city: "CIUDAD_JUAREZ",
    address: "Av. Tecnológico 3200",
    priceRange: "MODERADO",
    avgRating: 4.5,
    reviewCount: 521,
    daysAgo: 900,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "La Terraza del Río",
    description: "Cocina de autor con vista al río, ideal para cenas especiales y celebraciones.",
    city: "NUEVO_LAREDO",
    address: "Calle Guerrero 210",
    priceRange: "ALTO",
    avgRating: 4.9,
    reviewCount: 87,
    daysAgo: 1,
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    name: "Birriería Doña Chuy",
    description: "Birria de res estilo Jalisco cocida toda la noche, consomé aparte y tortillas de maíz.",
    city: "TIJUANA",
    address: "Calle Ocho 1450",
    priceRange: "ECONOMICO",
    avgRating: 4.7,
    reviewCount: 743,
    daysAgo: 1200,
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Cocina de Humo",
    description: "Ahumados de autor: costillas, brisket y pollo, todo cocinado a leña por más de 12 horas.",
    city: "REYNOSA",
    address: "Blvd. Hidalgo 900",
    priceRange: "ALTO",
    avgRating: 4.3,
    reviewCount: 156,
    daysAgo: 5,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Café La Caborca",
    description: "Café de especialidad tostado localmente, terraza con vista a la Revolución.",
    city: "TIJUANA",
    address: "Av. Revolución 1284",
    priceRange: "MODERADO",
    avgRating: 4.6,
    reviewCount: 340,
    daysAgo: 600,
    imageUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Mariscos El Pariente",
    description: "Ceviches, tostadas y cocteles de mariscos frente al malecón, porciones generosas.",
    city: "MATAMOROS",
    address: "Av. Álvaro Obregón 320",
    priceRange: "ECONOMICO",
    avgRating: 4.2,
    reviewCount: 210,
    daysAgo: 3,
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Trattoria Piedras Negras",
    description: "Pastas frescas y pizzas al horno de leña en un ambiente familiar del centro.",
    city: "PIEDRAS_NEGRAS",
    address: "Calle Zaragoza 55",
    priceRange: "MODERADO",
    avgRating: 4.4,
    reviewCount: 132,
    daysAgo: 950,
    imageUrl: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "El Rincón de Agua Prieta",
    description: "Comida casera sonorense: machaca, caldo de queso y tortillas de harina hechas a mano.",
    city: "AGUA_PRIETA",
    address: "Calle 6ta 112",
    priceRange: "ECONOMICO",
    avgRating: 4.1,
    reviewCount: 98,
    daysAgo: 1400,
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Sushi Fronterizo",
    description: "Rolls de autor con toques mexicanos, barra de sushi fresco y sake importado.",
    city: "MEXICALI",
    address: "Calzada Cetys 1500",
    priceRange: "ALTO",
    avgRating: 4.5,
    reviewCount: 275,
    daysAgo: 4,
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Steakhouse La Frontera",
    description: "Cortes premium, vinos importados y un ambiente elegante para ocasiones especiales.",
    city: "CIUDAD_JUAREZ",
    address: "Av. de las Américas 2100",
    priceRange: "PREMIUM",
    avgRating: 4.8,
    reviewCount: 64,
    daysAgo: 700,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    name: "Pupusería La Salvadoreña",
    description: "Pupusas revueltas y de queso, curtido casero y horchata natural.",
    city: "NOGALES",
    address: "Av. Álvaro Obregón 45",
    priceRange: "ECONOMICO",
    avgRating: 4.3,
    reviewCount: 187,
    daysAgo: 6,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Panadería y Café San Luis",
    description: "Pan dulce recién horneado y café de olla, punto de encuentro desde hace 20 años.",
    city: "SAN_LUIS_RIO_COLORADO",
    address: "Calle Constitución 300",
    priceRange: "ECONOMICO",
    avgRating: 4.0,
    reviewCount: 145,
    daysAgo: 1600,
    imageUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Cantina La Reyna",
    description: "Botanas tradicionales, mezcal artesanal y trío en vivo los fines de semana.",
    city: "REYNOSA",
    address: "Calle Hidalgo 76",
    priceRange: "MODERADO",
    avgRating: 3.9,
    reviewCount: 220,
    daysAgo: 1100,
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Fonda Doña Lupe",
    description: "Guisados caseros del día, menú del día accesible y sabor de casa.",
    city: "NUEVO_LAREDO",
    address: "Calle Victoria 88",
    priceRange: "ECONOMICO",
    avgRating: 4.4,
    reviewCount: 302,
    daysAgo: 1300,
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Bistró Piedras Verdes",
    description: "Cocina de mercado con ingredientes locales, menú que cambia cada temporada.",
    city: "PIEDRAS_NEGRAS",
    address: "Blvd. Ejército Nacional 410",
    priceRange: "ALTO",
    avgRating: 4.6,
    reviewCount: 91,
    daysAgo: 7,
    imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Taquería Agua Prieta Norte",
    description: "Tacos de tripa, cabeza y suadero, abierto toda la noche.",
    city: "AGUA_PRIETA",
    address: "Av. 16 de Septiembre 210",
    priceRange: "ECONOMICO",
    avgRating: 3.8,
    reviewCount: 176,
    daysAgo: 1800,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Marisquería Matamoros Sunset",
    description: "Filetes empanizados, cócteles de camarón y vista al atardecer sobre el río.",
    city: "MATAMOROS",
    address: "Av. Lauro Villar 780",
    priceRange: "MODERADO",
    avgRating: 4.5,
    reviewCount: 233,
    daysAgo: 8,
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Antojitos Tijuana Centro",
    description: "Quesadillas fritas, sopes y tostadas de tinga en pleno corazón de Tijuana.",
    city: "TIJUANA",
    address: "Calle 3ra 1120",
    priceRange: "ECONOMICO",
    avgRating: 4.1,
    reviewCount: 410,
    daysAgo: 2000,
    imageUrl: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Restaurante Vista Mexicali",
    description: "Cocina internacional con terraza panorámica, ideal para comidas de negocios.",
    city: "MEXICALI",
    address: "Blvd. Benito Juárez 1900",
    priceRange: "PREMIUM",
    avgRating: 4.7,
    reviewCount: 58,
    daysAgo: 9,
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Hamburguesas Juárez Grill",
    description: "Hamburguesas artesanales y papas gajo, punto de reunión de estudiantes.",
    city: "CIUDAD_JUAREZ",
    address: "Av. Universidad 4500",
    priceRange: "ECONOMICO",
    avgRating: 4.0,
    reviewCount: 289,
    daysAgo: 10,
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop",
  },
];

function slugify(name: string, city: string): string {
  const base = `${name}-${city}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base;
}

export const MOCK_RESTAURANTS: Restaurant[] = TEMPLATES.map((t, i) => {
  const createdAt = new Date(Date.now() - t.daysAgo * 24 * 60 * 60 * 1000).toISOString();
  return {
    id: `rest_${i + 1}`,
    slug: slugify(t.name, t.city),
    name: t.name,
    description: t.description,
    category: "RESTAURANTE",
    priceRange: t.priceRange,
    city: t.city,
    address: t.address,
    latitude: 0,
    longitude: 0,
    coverImageUrl: t.imageUrl,
    gallery: [],
    featured: Boolean(t.featured),
    avgRating: t.avgRating,
    reviewCount: t.reviewCount,
    createdAt,
  };
});
