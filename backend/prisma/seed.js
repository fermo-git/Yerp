import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const week = (opensAt, closesAt, closedDays = []) =>
  [0, 1, 2, 3, 4, 5, 6]
    .filter((d) => !closedDays.includes(d))
    .map((dayOfWeek) => ({ dayOfWeek, opensAt, closesAt }));

const A = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop";
const B = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop";
const C = "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop";
const D = "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop";
const E = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop";
const F = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop";
const G = "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200&auto=format&fit=crop";
const H = "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200&auto=format&fit=crop";
const I = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop";

const restaurants = [
  {
    slug: "mariscos-la-bahia-san-luis",
    name: "Mariscos La Bahía",
    description: "Mariscos frescos estilo Sinaloa a pasos de la garita, ceviche y cocteles en terraza.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    city: "SAN_LUIS_RIO_COLORADO",
    address: "Av. Álvaro Obregón 1240",
    latitude: 32.4763,
    longitude: -114.7679,
    featured: true,
    cover: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1200&auto=format&fit=crop",
    gallery: [A, B, C, D, E, F, G, H, I],
    hours: week("11:00", "21:00"),
    phone: "+52 653 123 4567",
    whatsapp: "+52 653 123 4567",
    email: "contacto@mariscoslabahia.mx",
    website: "https://www.mariscoslabahia.mx",
    createdAt: "2026-06-18T10:00:00.000Z",
  },
  {
    slug: "panaderia-cafe-san-luis",
    name: "Panadería y Café San Luis",
    description: "Pan de pueblo recién horneado y café de olla, desayunos desde temprano.",
    category: "RESTAURANTE",
    priceRange: "ECONOMICO",
    city: "SAN_LUIS_RIO_COLORADO",
    address: "Calle 4ta y Revolución 88",
    latitude: 32.4709,
    longitude: -114.7612,
    featured: false,
    cover: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
    gallery: [B, D],
    hours: week("07:00", "13:00"),
    phone: "+52 653 987 1122",
    whatsapp: "+52 653 987 1122",
    email: "hola@panaderiasanluis.mx",
    website: "https://www.panaderiasanluis.mx",
    createdAt: "2026-05-02T10:00:00.000Z",
  },
  {
    slug: "tacos-el-fenix-mexicali",
    name: "Tacos El Fénix",
    description: "Tacos de carne asada al carbón, receta de tres generaciones en el centro de Mexicali.",
    category: "RESTAURANTE",
    priceRange: "ECONOMICO",
    city: "MEXICALI",
    address: "Av. Reforma 512, Centro",
    latitude: 32.6245,
    longitude: -115.4523,
    featured: true,
    cover: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?q=80&w=1200&auto=format&fit=crop",
    gallery: [C, A],
    hours: week("12:00", "02:00"),
    phone: "+52 686 555 0199",
    whatsapp: "+52 686 555 0199",
    email: "contacto@tacoselfenix.mx",
    website: "https://www.tacoselfenix.mx",
    createdAt: "2026-07-30T10:00:00.000Z",
  },
  {
    slug: "mariscos-el-pelicano-tijuana",
    name: "Mariscos El Pelícano",
    description: "Tostadas, tacos gobernador y cerveza bien fría frente al mar de la Revu.",
    category: "RESTAURANTE",
    priceRange: "ALTO",
    city: "TIJUANA",
    address: "Av. Revolución 2310, Zona Centro",
    latitude: 32.5214,
    longitude: -117.0243,
    featured: true,
    cover: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop",
    gallery: [D, B],
    hours: week("11:00", "22:00"),
    phone: "+52 664 810 3321",
    whatsapp: "+52 664 810 3321",
    email: "hola@elpelicano.mx",
    website: "https://www.elpelicano.mx",
    createdAt: "2026-07-05T10:00:00.000Z",
  },
  {
    slug: "pizzeria-la-frontera-juarez",
    name: "Pizzería La Frontera",
    description: "Pizza al horno de leña con queso menonita, favorita de las familias juarenses.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    city: "CIUDAD_JUAREZ",
    address: "Av. Paseo Triunfo 402",
    latitude: 31.7386,
    longitude: -106.4859,
    featured: false,
    cover: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    gallery: [A, D],
    hours: week("13:00", "23:00"),
    phone: "+52 656 221 7788",
    whatsapp: "+52 656 221 7788",
    email: "contacto@pizzalafrontera.mx",
    website: "https://www.pizzalafrontera.mx",
    createdAt: "2026-04-20T10:00:00.000Z",
  },
  {
    slug: "carnitas-el-rincon-nuevo-laredo",
    name: "Carnitas El Rincón",
    description: "Carnitas estilo Michoacán, tortillas hechas a mano y aguas frescas.",
    category: "RESTAURANTE",
    priceRange: "ECONOMICO",
    city: "NUEVO_LAREDO",
    address: "Calle Guerrero 512",
    latitude: 27.4871,
    longitude: -99.5112,
    featured: false,
    cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    gallery: [B, C],
    hours: week("09:00", "18:00"),
    phone: "+52 867 401 2233",
    whatsapp: "+52 867 401 2233",
    email: "hola@carnitaselrincon.mx",
    website: "https://www.carnitaselrincon.mx",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    slug: "mariscos-el-muelle-reynosa",
    name: "Mariscos El Muelle",
    description: "Ceviche fresco y pescado zarandeado a la orilla del río, ambiente familiar.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    city: "REYNOSA",
    address: "Blvd. Hidalgo 1200",
    latitude: 26.0923,
    longitude: -98.2779,
    featured: false,
    cover: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80&w=1200&auto=format&fit=crop",
    gallery: [D, A],
    hours: week("12:00", "21:00"),
    phone: "+52 899 602 4455",
    whatsapp: "+52 899 602 4455",
    email: "contacto@elmuelle.mx",
    website: "https://www.mariscoselmuelle.mx",
    createdAt: "2026-03-15T10:00:00.000Z",
  },
  {
    slug: "barbacoa-don-pedro-matamoros",
    name: "Barbacoa Don Pedro",
    description: "Barbacoa de borrego de fin de semana, consomé y salsas de la casa.",
    category: "RESTAURANTE",
    priceRange: "ECONOMICO",
    city: "MATAMOROS",
    address: "Calle 6ta 320",
    latitude: 25.8756,
    longitude: -97.5083,
    featured: false,
    cover: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    gallery: [C, B],
    hours: week("07:00", "14:00", [1, 2, 3, 4, 5]),
    phone: "+52 868 774 6611",
    whatsapp: "+52 868 774 6611",
    email: "hola@barbacoadonpedro.mx",
    website: "https://www.barbacoadonpedro.mx",
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    slug: "cafe-bruma-nogales",
    name: "Café Bruma",
    description: "Café de especialidad y repostería artesanal, punto de encuentro del centro.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    city: "NOGALES",
    address: "Av. Obregón 210",
    latitude: 31.3017,
    longitude: -110.9377,
    featured: false,
    cover: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
    gallery: [B, D],
    hours: week("08:00", "20:00"),
    phone: "+52 631 320 8899",
    whatsapp: "+52 631 320 8899",
    email: "hola@cafebruma.mx",
    website: "https://www.cafebruma.mx",
    createdAt: "2026-01-25T10:00:00.000Z",
  },
  {
    slug: "asados-la-cabana-piedras-negras",
    name: "Asados La Cabaña",
    description: "Cortes a la parrilla y cabrito, cenas con música en vivo los fines de semana.",
    category: "RESTAURANTE",
    priceRange: "PREMIUM",
    city: "PIEDRAS_NEGRAS",
    address: "Blvd. Carranza 875",
    latitude: 28.7014,
    longitude: -100.5263,
    featured: true,
    cover: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1200&auto=format&fit=crop",
    gallery: [A, B, C, D, E, F, G, H, I],
    hours: week("13:00", "23:30"),
    phone: "+52 878 610 1122",
    whatsapp: "+52 878 610 1122",
    email: "reservas@asadoslacabana.mx",
    website: "https://www.asadoslacabana.mx",
    createdAt: "2026-07-12T10:00:00.000Z",
  },
  {
    slug: "antojitos-la-esquina-agua-prieta",
    name: "Antojitos La Esquina",
    description: "Gorditas, tacos dorados y elotes, el antojo de barrio de toda la vida.",
    category: "RESTAURANTE",
    priceRange: "ECONOMICO",
    city: "AGUA_PRIETA",
    address: "Calle 5ta 60",
    latitude: 31.3291,
    longitude: -109.5498,
    featured: false,
    cover: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1200&auto=format&fit=crop",
    gallery: [D, B],
    hours: week("10:00", "19:00"),
    phone: "+52 633 205 4433",
    whatsapp: "+52 633 205 4433",
    email: "hola@antojitoslaesquina.mx",
    website: "https://www.antojitoslaesquina.mx",
    createdAt: "2026-05-28T10:00:00.000Z",
  },
  {
    slug: "mariscos-las-brisas-mexicali",
    name: "Mariscos Las Brisas",
    description: "Campechana, ceviche de callo y micheladas, terraza fresca al atardecer.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    city: "MEXICALI",
    address: "Blvd. López Mateos 1450",
    latitude: 32.6471,
    longitude: -115.4621,
    featured: false,
    cover: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=1200&auto=format&fit=crop",
    gallery: [C, A],
    hours: week("12:00", "00:00"),
    phone: "+52 686 302 7788",
    whatsapp: "+52 686 302 7788",
    email: "contacto@lasbrisas.mx",
    website: "https://www.mariscoslasbrisas.mx",
    createdAt: "2026-06-30T10:00:00.000Z",
  },
  {
    slug: "restaurante-el-patio-tijuana",
    name: "Restaurante El Patio",
    description: "Cocina del desierto con ingredientes locales, patio arbolado y barra completa.",
    category: "RESTAURANTE",
    priceRange: "ALTO",
    city: "TIJUANA",
    address: "Av. Sonora 1700, Col. Hipódromo",
    latitude: 32.5211,
    longitude: -117.0156,
    featured: true,
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    gallery: [A, B, C, D, E, F, G, H, I],
    hours: week("13:00", "23:00"),
    phone: "+52 664 201 5544",
    whatsapp: "+52 664 201 5544",
    email: "reservas@elpatiotijuana.mx",
    website: "https://www.restauranteelpatio.mx",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
];

// ------------------------------------------------------------------
// Negocios adicionales: completa 10 registros por ciudad fronteriza.
// No se modifican ni eliminan los registros de `restaurants` de arriba;
// este bloque solo AÑADE negocios para que cada ciudad tenga 10.
// ------------------------------------------------------------------
const slugifySeed = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const EXTRA_DESCRIPTIONS = {
  RESTAURANTE: (name) => `${name} — cocina local con sabor de la frontera y atención familiar.`,
  CAFETERIA: (name) => `${name} — café de especialidad, pan recién horneado y ambiente tranquilo.`,
  BAR: (name) => `${name} — bar de ambiente con coctelería y música en vivo.`,
  TIENDA: (name) => `${name} — tienda local con productos de la región.`,
  SALUD: (name) => `${name} — atención médica general y de especialidades.`,
  BELLEZA: (name) => `${name} — salón de belleza y cuidado personal.`,
  SERVICIOS_PROFESIONALES: (name) => `${name} — servicios profesionales de confianza en la ciudad.`,
  ENTRETENIMIENTO: (name) => `${name} — entretenimiento y diversión para toda la familia.`,
  HOTEL: (name) => `${name} — hospedaje cómodo y céntrico para viajeros.`,
  AUTOMOTRIZ: (name) => `${name} — taller automotriz y refacciones.`,
  EDUCACION: (name) => `${name} — centro educativo y de capacitación.`,
  OTRO: (name) => `${name} — negocio local de la frontera.`,
};

const EXTRA_HOURS = {
  RESTAURANTE: ["12:00", "22:00"],
  CAFETERIA: ["07:00", "19:00"],
  BAR: ["17:00", "02:00"],
  TIENDA: ["09:00", "20:00"],
  SALUD: ["09:00", "18:00"],
  BELLEZA: ["10:00", "19:00"],
  SERVICIOS_PROFESIONALES: ["09:00", "18:00"],
  ENTRETENIMIENTO: ["12:00", "23:00"],
  HOTEL: ["00:00", "23:59"],
  AUTOMOTRIZ: ["08:00", "18:00"],
  EDUCACION: ["08:00", "17:00"],
  OTRO: ["10:00", "18:00"],
};

const EXTRA_COORDS = {
  TIJUANA: [32.5283, -117.0187],
  MEXICALI: [32.6245, -115.4523],
  CIUDAD_JUAREZ: [31.7386, -106.4859],
  NUEVO_LAREDO: [27.4871, -99.5112],
  REYNOSA: [26.0923, -98.2779],
  MATAMOROS: [25.8756, -97.5083],
  NOGALES: [31.3017, -110.9377],
  PIEDRAS_NEGRAS: [28.7014, -100.5263],
  SAN_LUIS_RIO_COLORADO: [32.4763, -114.7679],
  AGUA_PRIETA: [31.3291, -109.5498],
};

const EXTRA_AREA_CODES = {
  TIJUANA: 664,
  MEXICALI: 686,
  CIUDAD_JUAREZ: 656,
  NUEVO_LAREDO: 867,
  REYNOSA: 899,
  MATAMOROS: 868,
  NOGALES: 631,
  PIEDRAS_NEGRAS: 878,
  SAN_LUIS_RIO_COLORADO: 653,
  AGUA_PRIETA: 633,
};

// [nombre, categoría, rango de precio]
const EXTRA_BY_CITY = {
  TIJUANA: [
    ["Taquería La Postal", "RESTAURANTE", "ECONOMICO"],
    ["Café Revolución", "CAFETERIA", "MODERADO"],
    ["Cervecería Insurgentes", "BAR", "MODERADO"],
    ["Mercado Hidalgo", "TIENDA", "MODERADO"],
    ["Farmacia del Centro", "SALUD", "ECONOMICO"],
    ["Salón Baja Studio", "BELLEZA", "MODERADO"],
    ["Hotel Colonial Revolución", "HOTEL", "ALTO"],
    ["Auto Servicio Zona Norte", "AUTOMOTRIZ", "ECONOMICO"],
  ],
  MEXICALI: [
    ["Restaurante La Chinesca", "RESTAURANTE", "MODERADO"],
    ["Café Cachanilla", "CAFETERIA", "ECONOMICO"],
    ["Cantina El As de Oro", "BAR", "MODERADO"],
    ["Boutique Calzada", "TIENDA", "ALTO"],
    ["Clínica Frontera Salud", "SALUD", "MODERADO"],
    ["Estética 43", "BELLEZA", "ECONOMICO"],
    ["Despacho Contable del Valle", "SERVICIOS_PROFESIONALES", "MODERADO"],
    ["Taller El Camino", "AUTOMOTRIZ", "ECONOMICO"],
  ],
  SAN_LUIS_RIO_COLORADO: [
    ["Mariscos El Delfín", "RESTAURANTE", "MODERADO"],
    ["Café Sonorense", "CAFETERIA", "ECONOMICO"],
    ["Bar La Playita", "BAR", "ECONOMICO"],
    ["Tienda El Valle", "TIENDA", "ECONOMICO"],
    ["Consultorio Médico del Desierto", "SALUD", "MODERADO"],
    ["Spa Jardín del Río", "BELLEZA", "ALTO"],
    ["Hotel Frontera Norte", "HOTEL", "MODERADO"],
    ["Mecánica Rápida SL", "AUTOMOTRIZ", "ECONOMICO"],
  ],
  CIUDAD_JUAREZ: [
    ["Burritos Don Chuy", "RESTAURANTE", "ECONOMICO"],
    ["Café Paso del Norte", "CAFETERIA", "MODERADO"],
    ["Cantina La Juárez", "BAR", "MODERADO"],
    ["Mercado Pronaf", "TIENDA", "MODERADO"],
    ["Clínica Médica Chamizal", "SALUD", "MODERADO"],
    ["Salón Glow", "BELLEZA", "MODERADO"],
    ["Hotel Villa del Paso", "HOTEL", "MODERADO"],
    ["Auto Refacciones Puente", "AUTOMOTRIZ", "ECONOMICO"],
    ["Academia Bilingüe Frontera", "EDUCACION", "MODERADO"],
  ],
  NUEVO_LAREDO: [
    ["Parrillada Los Dos Laredos", "RESTAURANTE", "MODERADO"],
    ["Café Maclovio", "CAFETERIA", "ECONOMICO"],
    ["Bar La Calle 15", "BAR", "ECONOMICO"],
    ["Tienda El Puente", "TIENDA", "ECONOMICO"],
    ["Farmacia Aduana", "SALUD", "ECONOMICO"],
    ["Estética La Internacional", "BELLEZA", "MODERADO"],
    ["Hotel Reforma Plaza", "HOTEL", "ALTO"],
    ["Llantera La Ribera", "AUTOMOTRIZ", "ECONOMICO"],
    ["Escuela de Música del Norte", "EDUCACION", "MODERADO"],
  ],
  REYNOSA: [
    ["Taquería El Regio", "RESTAURANTE", "ECONOMICO"],
    ["Café Del Río Bravo", "CAFETERIA", "MODERADO"],
    ["Bar La Hidalgo", "BAR", "MODERADO"],
    ["Plaza Comercial Reynosa", "TIENDA", "MODERADO"],
    ["Clínica Vital", "SALUD", "MODERADO"],
    ["Beauty Center Florencia", "BELLEZA", "MODERADO"],
    ["Hotel Colonial Reynosa", "HOTEL", "MODERADO"],
    ["Taller Mecánico 2000", "AUTOMOTRIZ", "ECONOMICO"],
    ["Instituto de Idiomas Frontera", "EDUCACION", "MODERADO"],
  ],
  MATAMOROS: [
    ["Mariscos Playa Bagdad", "RESTAURANTE", "MODERADO"],
    ["Café El Remolino", "CAFETERIA", "ECONOMICO"],
    ["Cantina La Bodega", "BAR", "ECONOMICO"],
    ["Mercado Juárez Matamoros", "TIENDA", "ECONOMICO"],
    ["Clínica del Valle", "SALUD", "MODERADO"],
    ["Salón Áurea", "BELLEZA", "MODERADO"],
    ["Hotel Hacienda del Norte", "HOTEL", "ALTO"],
    ["Autolavado El Cruce", "AUTOMOTRIZ", "ECONOMICO"],
    ["Centro de Capacitación Tamaulipas", "EDUCACION", "MODERADO"],
  ],
  NOGALES: [
    ["Sonora Grill Nogales", "RESTAURANTE", "MODERADO"],
    ["Café del Puerto", "CAFETERIA", "ECONOMICO"],
    ["Bar La Morley", "BAR", "ECONOMICO"],
    ["Tienda La Garita", "TIENDA", "ECONOMICO"],
    ["Clínica Nogales Salud", "SALUD", "MODERADO"],
    ["Estética Kino", "BELLEZA", "MODERADO"],
    ["Hotel Frontera Nogales", "HOTEL", "MODERADO"],
    ["Refaccionaria El Cerro", "AUTOMOTRIZ", "ECONOMICO"],
    ["Academia de Computación del Norte", "EDUCACION", "MODERADO"],
  ],
  PIEDRAS_NEGRAS: [
    ["Restaurante El Río", "RESTAURANTE", "MODERADO"],
    ["Café Internacional", "CAFETERIA", "MODERADO"],
    ["Bar La Ribera", "BAR", "MODERADO"],
    ["Tienda El Águila", "TIENDA", "ECONOMICO"],
    ["Clínica del Carbón", "SALUD", "MODERADO"],
    ["Salón Elite", "BELLEZA", "MODERADO"],
    ["Hotel Plaza Piedras Negras", "HOTEL", "MODERADO"],
    ["Taller El Norte", "AUTOMOTRIZ", "ECONOMICO"],
    ["Escuela de Inglés Eagle Pass", "EDUCACION", "MODERADO"],
  ],
  AGUA_PRIETA: [
    ["Taquería El Cruce", "RESTAURANTE", "ECONOMICO"],
    ["Café Douglas", "CAFETERIA", "ECONOMICO"],
    ["Bar La Frontera", "BAR", "ECONOMICO"],
    ["Tienda Sonora", "TIENDA", "ECONOMICO"],
    ["Clínica Agua Prieta", "SALUD", "MODERADO"],
    ["Salón Belleza del Desierto", "BELLEZA", "MODERADO"],
    ["Hotel Portal del Norte", "HOTEL", "MODERADO"],
    ["Mecánica El Bordo", "AUTOMOTRIZ", "ECONOMICO"],
    ["Instituto Técnico Fronterizo", "EDUCACION", "MODERADO"],
  ],
};

const EXTRA_COVERS = [A, B, C, D, E, F, G, H, I];

function buildExtraBusinesses() {
  const usedSlugs = new Set(restaurants.map((r) => r.slug));
  const extras = [];
  let idx = 0;

  for (const [city, entries] of Object.entries(EXTRA_BY_CITY)) {
    entries.forEach(([name, category, priceRange], i) => {
      let slug = `${slugifySeed(name)}-${slugifySeed(city)}`;
      let suffix = 1;
      while (usedSlugs.has(slug)) {
        suffix += 1;
        slug = `${slugifySeed(name)}-${slugifySeed(city)}-${suffix}`;
      }
      usedSlugs.add(slug);

      const cover = EXTRA_COVERS[idx % EXTRA_COVERS.length];
      const [baseLat, baseLng] = EXTRA_COORDS[city];
      const area = EXTRA_AREA_CODES[city];
      const phone = `+52 ${area} ${String(200 + idx).padStart(3, "0")} ${String(4000 + idx).padStart(4, "0")}`;

      extras.push({
        slug,
        name,
        description: EXTRA_DESCRIPTIONS[category](name),
        category,
        priceRange,
        city,
        address: `Calle ${110 + i} ${i % 2 ? "Norte" : "Sur"}, Centro`,
        latitude: baseLat + (i % 5) * 0.004,
        longitude: baseLng + (i % 3) * 0.003,
        featured: false,
        cover,
        gallery: [
          cover,
          EXTRA_COVERS[(idx + 1) % EXTRA_COVERS.length],
          EXTRA_COVERS[(idx + 2) % EXTRA_COVERS.length],
        ],
        hours: week(...EXTRA_HOURS[category]),
        phone,
        whatsapp: phone,
        email: `${slug}@lafrontera.mx`,
        website: null,
        createdAt: new Date(Date.UTC(2026, 5, 10) - idx * 3 * 86400000).toISOString(),
      });
      idx += 1;
    });
  }

  return extras;
}

const authors = [
  { name: "Vicki L.", avatarUrl: "https://i.pravatar.cc/80?img=47", email: "vicki@example.com" },
  { name: "Caili C.", avatarUrl: "https://i.pravatar.cc/80?img=32", email: "caili@example.com" },
  { name: "Rebecca G.", avatarUrl: "https://i.pravatar.cc/80?img=15", email: "rebecca@example.com" },
  { name: "Marco T.", avatarUrl: "https://i.pravatar.cc/80?img=12", email: "marco@example.com" },
  { name: "Lucía R.", avatarUrl: "https://i.pravatar.cc/80?img=44", email: "lucia@example.com" },
  { name: "Andrés M.", avatarUrl: "https://i.pravatar.cc/80?img=59", email: "andres@example.com" },
  { name: "Diana P.", avatarUrl: "https://i.pravatar.cc/80?img=25", email: "diana@example.com" },
  { name: "Gerardo F.", avatarUrl: "https://i.pravatar.cc/80?img=68", email: "gerardo@example.com" },
  { name: "Sofía V.", avatarUrl: "https://i.pravatar.cc/80?img=20", email: "sofia@example.com" },
  { name: "Fernanda O.", avatarUrl: "https://i.pravatar.cc/80?img=45", email: "fernanda@example.com" },
  { name: "Elena S.", avatarUrl: "https://i.pravatar.cc/80?img=49", email: "elena@example.com" },
  { name: "Hugo M.", avatarUrl: "https://i.pravatar.cc/80?img=13", email: "hugo@example.com" },
  { name: "Paola N.", avatarUrl: "https://i.pravatar.cc/80?img=26", email: "paola@example.com" },
  { name: "Roberto C.", avatarUrl: "https://i.pravatar.cc/80?img=52", email: "roberto@example.com" },
  { name: "Mónica A.", avatarUrl: "https://i.pravatar.cc/80?img=16", email: "monica@example.com" },
  { name: "Jorge H.", avatarUrl: "https://i.pravatar.cc/80?img=11", email: "jorge@example.com" },
  { name: "Claudia R.", avatarUrl: "https://i.pravatar.cc/80?img=41", email: "claudia@example.com" },
  { name: "Tomás G.", avatarUrl: "https://i.pravatar.cc/80?img=60", email: "tomas@example.com" },
  { name: "Beatriz L.", avatarUrl: "https://i.pravatar.cc/80?img=22", email: "beatriz@example.com" },
  { name: "Raúl D.", avatarUrl: "https://i.pravatar.cc/80?img=33", email: "raul@example.com" },
];

const reviews = [
  { business: "mariscos-la-bahia-san-luis", rating: 5, comment: "El ceviche mixto está increíble y la atención es rapidísima. La terraza es perfecta para la tarde.", author: "Vicki L.", createdAt: "2026-08-10T18:30:00.000Z" },
  { business: "mariscos-la-bahia-san-luis", rating: 4, comment: "Muy ricos los tacos gobernador, aunque a veces se llena y hay que esperar mesa.", author: "Caili C.", createdAt: "2026-08-02T20:00:00.000Z" },
  { business: "mariscos-la-bahia-san-luis", rating: 5, comment: "La campechana es de lo mejor que he probado en la frontera. Totalmente recomendado.", author: "Rebecca G.", createdAt: "2026-07-18T15:10:00.000Z" },
  { business: "tacos-el-fenix-mexicali", rating: 5, comment: "El adobado es legendario. Ambiente familiar y las tortillas recién hechas.", author: "Marco T.", createdAt: "2026-08-11T22:15:00.000Z" },
  { business: "tacos-el-fenix-mexicali", rating: 4, comment: "Buenísimos tacos, solo que el estacionamiento es complicado los fines de semana.", author: "Lucía R.", createdAt: "2026-07-25T19:45:00.000Z" },
  { business: "mariscos-el-pelicano-tijuana", rating: 5, comment: "Las tostadas de atún y la vista son espectaculares. Ideal para llevar visitas.", author: "Andrés M.", createdAt: "2026-08-08T16:20:00.000Z" },
  { business: "mariscos-el-pelicano-tijuana", rating: 3, comment: "La comida está rica pero el servicio fue lento, tardaron mucho en traer la cuenta.", author: "Diana P.", createdAt: "2026-07-30T14:05:00.000Z" },
  { business: "asados-la-cabana-piedras-negras", rating: 5, comment: "El cabrito está de primera y la música en vivo le da un ambiente único.", author: "Gerardo F.", createdAt: "2026-08-09T23:30:00.000Z" },
  { business: "asados-la-cabana-piedras-negras", rating: 4, comment: "Cortes excelentes, precios un poco altos pero valen la pena para una ocasión especial.", author: "Sofía V.", createdAt: "2026-07-22T21:00:00.000Z" },
  { business: "restaurante-el-patio-tijuana", rating: 5, comment: "Cocina del desierto con ingredientes locales, el patio es hermoso. Volveré seguro.", author: "Fernanda O.", createdAt: "2026-08-12T19:00:00.000Z" },
  { business: "panaderia-cafe-san-luis", rating: 5, comment: "El pan de maíz recién horneado y el café de olla son de lo mejor. Abren tempranísimo.", author: "Elena S.", createdAt: "2026-08-08T13:20:00.000Z" },
  { business: "panaderia-cafe-san-luis", rating: 4, comment: "Muy buenos desayunos, solo que se llena rápido después de las 9.", author: "Hugo M.", createdAt: "2026-07-20T15:00:00.000Z" },
  { business: "pizzeria-la-frontera-juarez", rating: 4, comment: "La pizza de queso menonita es única. Buen precio y horno de leña de verdad.", author: "Paola N.", createdAt: "2026-08-06T20:45:00.000Z" },
  { business: "carnitas-el-rincon-nuevo-laredo", rating: 5, comment: "Carnitas jugosas y tortillas hechas a mano. El agua de jamaica también está buenísima.", author: "Roberto C.", createdAt: "2026-08-04T14:30:00.000Z" },
  { business: "mariscos-el-muelle-reynosa", rating: 4, comment: "El pescado zarandeado muy rico y el ambiente familiar. El servicio a veces tarda en fines de semana.", author: "Mónica A.", createdAt: "2026-07-28T19:10:00.000Z" },
  { business: "barbacoa-don-pedro-matamoros", rating: 5, comment: "La mejor barbacoa de la región. Solo abren en fin de semana, así que llega temprano.", author: "Jorge H.", createdAt: "2026-08-10T12:00:00.000Z" },
  { business: "cafe-bruma-nogales", rating: 4, comment: "Café de especialidad bien preparado y repostería casera. Ideal para trabajar un rato.", author: "Claudia R.", createdAt: "2026-08-05T17:25:00.000Z" },
  { business: "antojitos-la-esquina-agua-prieta", rating: 4, comment: "Gorditas ricas y baratas, el antojo perfecto de barrio. Cierran temprano.", author: "Tomás G.", createdAt: "2026-07-25T18:40:00.000Z" },
  { business: "mariscos-las-brisas-mexicali", rating: 5, comment: "La campechana está espectacular y la terraza al atardecer es otra cosa.", author: "Beatriz L.", createdAt: "2026-08-11T20:15:00.000Z" },
  { business: "mariscos-las-brisas-mexicali", rating: 4, comment: "Buen marisco y buenas micheladas. Un poco ruidoso cuando hay partido.", author: "Raúl D.", createdAt: "2026-07-19T22:00:00.000Z" },
];

// Fuente: https://bwt.cbp.gov/xml/bwt.xml (border === "Mexican Border")
// Filtrado a mano: se excluyen carriles/puertos exclusivamente comerciales
// (carga) y entradas duplicadas o con datos inconsistentes del feed de CBP.
// Coordenadas son aproximadas (ubicación del cruce físico) — verificar las
// más importantes para el MVP antes de usarlas en producción.
const CROSSINGS = [
  // --- Baja California ---
  { portNumber: "250401", name: "San Ysidro", city: "TIJUANA", latitude: 32.5422, longitude: -117.0297, hoursOfOperation: "24 hrs/día" },
  { portNumber: "250601", name: "Otay Mesa - Passenger", city: "TIJUANA", latitude: 32.5498, longitude: -116.9664, hoursOfOperation: "24 hrs/día" },
  { portNumber: "250409", name: "Cross Border Express (CBX)", city: "TIJUANA", latitude: 32.5411, longitude: -116.9700, hoursOfOperation: "24 hrs/día" },
  { portNumber: "250407", name: "San Ysidro - PedWest", city: "TIJUANA", latitude: 32.5427, longitude: -117.0313, hoursOfOperation: "24 hrs/día" },
  { portNumber: "250501", name: "Tecate", city: "TECATE", latitude: 32.5763, longitude: -116.6272, hoursOfOperation: "05:00 - 23:00" },
  { portNumber: "250301", name: "Calexico East", city: "MEXICALI", latitude: 32.6813, longitude: -115.4919, hoursOfOperation: "24 hrs/día" },
  { portNumber: "250302", name: "Calexico West", city: "MEXICALI", latitude: 32.6789, longitude: -115.4989, hoursOfOperation: "24 hrs/día" },
  { portNumber: "250201", name: "Andrade", city: "LOS_ALGODONES", latitude: 32.7188, longitude: -114.7183, hoursOfOperation: null },

  // --- Sonora ---
  { portNumber: "260401", name: "Nogales - Deconcini", city: "NOGALES", latitude: 31.3308, longitude: -110.9442, hoursOfOperation: "24 hrs/día" },
  { portNumber: "260402", name: "Nogales - Mariposa", city: "NOGALES", latitude: 31.3406, longitude: -110.9642, hoursOfOperation: "24 hrs/día" },
  { portNumber: "260403", name: "Nogales - Morley Gate", city: "NOGALES", latitude: 31.3311, longitude: -110.9426, hoursOfOperation: null },
  { portNumber: "260101", name: "Douglas (Raul Hector Castro)", city: "AGUA_PRIETA", latitude: 31.3339, longitude: -109.5459, hoursOfOperation: "24 hrs/día" },
  { portNumber: "260301", name: "Naco", city: "NACO", latitude: 31.3339, longitude: -109.9481, hoursOfOperation: null },
  { portNumber: "260201", name: "Lukeville", city: "SONOYTA", latitude: 31.8814, longitude: -112.8203, hoursOfOperation: null },
  { portNumber: "260801", name: "San Luis I", city: "SAN_LUIS_RIO_COLORADO", latitude: 32.4869, longitude: -114.7797, hoursOfOperation: "24 hrs/día" },
  { portNumber: "260802", name: "San Luis II", city: "SAN_LUIS_RIO_COLORADO", latitude: 32.4839, longitude: -114.7756, hoursOfOperation: null },

  // --- Chihuahua ---
  { portNumber: "240201", name: "Bridge of the Americas (BOTA)", city: "CIUDAD_JUAREZ", latitude: 31.7386, longitude: -106.4291, hoursOfOperation: "24 hrs/día" },
  { portNumber: "240202", name: "Paso del Norte (PDN)", city: "CIUDAD_JUAREZ", latitude: 31.7619, longitude: -106.4850, hoursOfOperation: "24 hrs/día" },
  { portNumber: "240204", name: "Stanton St Bridge", city: "CIUDAD_JUAREZ", latitude: 31.7595, longitude: -106.4869, hoursOfOperation: null },
  { portNumber: "240203", name: "Ysleta", city: "CIUDAD_JUAREZ", latitude: 31.6939, longitude: -106.3336, hoursOfOperation: "24 hrs/día" },
  { portNumber: "240801", name: "Santa Teresa (San Jerónimo)", city: "CIUDAD_JUAREZ", latitude: 31.8386, longitude: -106.6314, hoursOfOperation: null },
  { portNumber: "240401", name: "Tornillo - Guadalupe", city: "GUADALUPE", latitude: 31.4425, longitude: -106.2314, hoursOfOperation: null },
  { portNumber: "240601", name: "Columbus - Palomas", city: "PALOMAS", latitude: 31.7862, longitude: -107.6403, hoursOfOperation: null },
  { portNumber: "240301", name: "Presidio - Ojinaga", city: "OJINAGA", latitude: 29.5613, longitude: -104.3986, hoursOfOperation: null },

  // --- Coahuila ---
  { portNumber: "230201", name: "Del Rio - Ciudad Acuña", city: "CIUDAD_ACUNA", latitude: 29.3183, longitude: -100.9257, hoursOfOperation: null },
  { portNumber: "230301", name: "Eagle Pass - Bridge I", city: "PIEDRAS_NEGRAS", latitude: 28.7089, longitude: -100.4993, hoursOfOperation: "24 hrs/día" },
  { portNumber: "230302", name: "Eagle Pass - Bridge II", city: "PIEDRAS_NEGRAS", latitude: 28.6928, longitude: -100.5106, hoursOfOperation: null },

  // --- Tamaulipas ---
  { portNumber: "230401", name: "Laredo - Bridge I", city: "NUEVO_LAREDO", latitude: 27.5064, longitude: -99.5075, hoursOfOperation: "24 hrs/día" },
  { portNumber: "230402", name: "Laredo - Bridge II", city: "NUEVO_LAREDO", latitude: 27.5197, longitude: -99.4914, hoursOfOperation: null },
  { portNumber: "230403", name: "Laredo - Colombia Solidarity", city: "NUEVO_LAREDO", latitude: 27.6497, longitude: -99.4692, hoursOfOperation: "08:00 - 00:00" },
  { portNumber: "230501", name: "Hidalgo", city: "REYNOSA", latitude: 26.1004, longitude: -98.2597, hoursOfOperation: "24 hrs/día" },
  { portNumber: "230502", name: "Pharr International Bridge", city: "REYNOSA", latitude: 26.1656, longitude: -98.1728, hoursOfOperation: null },
  { portNumber: "230503", name: "Anzalduas International Bridge", city: "REYNOSA", latitude: 26.1011, longitude: -98.3853, hoursOfOperation: null },
  { portNumber: "230901", name: "Progreso International Bridge", city: "NUEVO_PROGRESO", latitude: 26.0589, longitude: -97.9542, hoursOfOperation: null },
  { portNumber: "230902", name: "Donna International Bridge", city: "NUEVO_PROGRESO", latitude: 26.0664, longitude: -97.9642, hoursOfOperation: null },
  { portNumber: "230701", name: "Rio Grande City - Camargo", city: "CAMARGO", latitude: 26.3798, longitude: -98.8203, hoursOfOperation: null },
  { portNumber: "231001", name: "Roma - Ciudad Miguel Alemán", city: "MIGUEL_ALEMAN", latitude: 26.4017, longitude: -99.0181, hoursOfOperation: null },
  { portNumber: "535501", name: "Brownsville - B&M", city: "MATAMOROS", latitude: 25.9017, longitude: -97.4975, hoursOfOperation: null },
  { portNumber: "535502", name: "Brownsville - Veterans International", city: "MATAMOROS", latitude: 25.8677, longitude: -97.5697, hoursOfOperation: "24 hrs/día" },
  { portNumber: "535503", name: "Brownsville - Los Indios", city: "MATAMOROS", latitude: 26.0459, longitude: -97.7275, hoursOfOperation: null },
  { portNumber: "535504", name: "Brownsville - Gateway", city: "MATAMOROS", latitude: 25.9026, longitude: -97.4864, hoursOfOperation: "24 hrs/día" },
];
const MARKETPLACE_LISTINGS = [
  // --- TIJUANA ---
  {
    title: "Honda Civic 2019 — un solo dueño",
    description: "Honda Civic EX 2019, automático, 45,000 km, servicio de agencia, placas BC. Impecable, sin detalles.",
    price: 285000,
    category: "VEHICULOS",
    city: "TIJUANA",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?q=80&w=800&auto=format&fit=crop",
    seller: "Marco T.",
    contactPhone: "+52 664 100 2001",
  },
  {
    title: "iPhone 15 Pro 256GB — nuevo en caja",
    description: "iPhone 15 Pro 256GB color titanio natural, sellado en caja, con factura y garantía Apple México.",
    price: 22500,
    category: "ELECTRONICA",
    city: "TIJUANA",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop",
    seller: "Lucía R.",
    contactPhone: "+52 664 100 2002",
  },
  // --- MEXICALI ---
  {
    title: "Sofá seccional gris — como nuevo",
    description: "Sofá seccional en L color gris Oxford, tela antimanchas, 2 años de uso cuidadoso. Se entrega en Mexicali.",
    price: 8500,
    category: "HOGAR_Y_JARDIN",
    city: "MEXICALI",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    seller: "Diana P.",
    contactPhone: "+52 686 100 3001",
  },
  {
    title: "Ropa de marca — lote de 20 prendas",
    description: "Lote de ropa de marca (Zara, H&M, Forever 21), tallas M-L, excelente estado. Ideal para reventa o tianguis.",
    price: 3500,
    category: "MODA",
    city: "MEXICALI",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    seller: "Sofía V.",
    contactPhone: "+52 686 100 3002",
  },
  // --- SAN_LUIS_RIO_COLORADO ---
  {
    title: "Casa en renta — 3 recámaras, centro",
    description: "Casa en renta en el centro de San Luis, 3 recámaras, 2 baños, estacionamiento para 2 autos. $12,000/mes.",
    price: 12000,
    category: "INMUEBLES",
    city: "SAN_LUIS_RIO_COLORADO",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop",
    seller: "Gerardo F.",
    contactPhone: "+52 653 100 4001",
  },
  {
    title: "Juego de herramientas Craftsman — 150 piezas",
    description: "Set completo Craftsman 150 piezas: llaves, dados, destornilladores, extensiones. Estuche incluido, poco uso.",
    price: 4200,
    category: "OTRO",
    city: "SAN_LUIS_RIO_COLORADO",
    imageUrl: "https://images.unsplash.com/photo-1581147036324-c17ac41f0aeb?q=80&w=800&auto=format&fit=crop",
    seller: "Roberto C.",
    contactPhone: "+52 653 100 4002",
  },
  // --- CIUDAD_JUAREZ ---
  {
    title: "Bicicleta de montaña Trek Marlin 7",
    description: "Trek Marlin 7 rodada 29, cuadro M, frenos hidráulicos Shimano, rodada menos de 500 km. Con candado incluido.",
    price: 14500,
    category: "VEHICULOS",
    city: "CIUDAD_JUAREZ",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e2208e0b6914?q=80&w=800&auto=format&fit=crop",
    seller: "Andrés M.",
    contactPhone: "+52 656 100 5001",
  },
  {
    title: "Servicio de limpieza profesional — casas y oficinas",
    description: "Servicio de limpieza profunda para casas y oficinas en Juárez. Personal capacitado, productos incluidos. Cotización sin compromiso.",
    price: 800,
    category: "SERVICIOS",
    city: "CIUDAD_JUAREZ",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c292016d?q=80&w=800&auto=format&fit=crop",
    seller: "Fernanda O.",
    contactPhone: "+52 656 100 5002",
  },
  // --- NUEVO_LAREDO ---
  {
    title: "Smart TV Samsung 55\" 4K — 2024",
    description: "Samsung Crystal UHD 55\" modelo 2024, Smart TV, 3 meses de uso, con control remoto y caja original.",
    price: 9800,
    category: "ELECTRONICA",
    city: "NUEVO_LAREDO",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop",
    seller: "Hugo M.",
    contactPhone: "+52 867 100 6001",
  },
  {
    title: "Set de jardín — mesa y 4 sillas de aluminio",
    description: "Mesa rectangular de aluminio con cubierta de vidrio templado y 4 sillas acojinadas. Ideal para terraza o patio.",
    price: 6500,
    category: "HOGAR_Y_JARDIN",
    city: "NUEVO_LAREDO",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    seller: "Paola N.",
    contactPhone: "+52 867 100 6002",
  },
  // --- REYNOSA ---
  {
    title: "MacBook Air M2 2023 — 16GB RAM",
    description: "MacBook Air M2 2023, 16GB RAM, 512GB SSD, color midnight. 98% de salud de batería, con cargador original.",
    price: 24000,
    category: "ELECTRONICA",
    city: "REYNOSA",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    seller: "Tomás G.",
    contactPhone: "+52 899 100 7001",
  },
  {
    title: "Se solicita auxiliar administrativo — tiempo completo",
    description: "Empresa de logística busca auxiliar administrativo. Prestaciones de ley, horario L-V 9-18. Enviar CV por correo.",
    price: 15000,
    category: "EMPLEO",
    city: "REYNOSA",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    seller: "Claudia R.",
    contactPhone: "+52 899 100 7002",
    contactEmail: "empleo@logisticareynosa.mx",
  },
  // --- MATAMOROS ---
  {
    title: "Refacciones para Nissan Sentra 2018-2022",
    description: "Lote de refacciones: faros delanteros, defensa, espejos laterales. Originales Nissan, nuevo en caja.",
    price: 7500,
    category: "VEHICULOS",
    city: "MATAMOROS",
    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e4b06a2?q=80&w=800&auto=format&fit=crop",
    seller: "Jorge H.",
    contactPhone: "+52 868 100 8001",
  },
  {
    title: "Departamento amueblado — 2 recámaras, zona centro",
    description: "Departamento amueblado en renta, 2 recámaras, sala, comedor, cocina integral. Incluye agua y gas. Cerca del tec.",
    price: 9500,
    category: "INMUEBLES",
    city: "MATAMOROS",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop",
    seller: "Mónica A.",
    contactPhone: "+52 868 100 8002",
  },
  // --- NOGALES ---
  {
    title: "Tenis Nike Air Max 90 — talla 28 MX",
    description: "Nike Air Max 90 blancos/negros, talla 28 MX (US 10), usados 2 veces, con caja original. Precio negociable.",
    price: 1800,
    category: "MODA",
    city: "NOGALES",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    seller: "Raúl D.",
    contactPhone: "+52 631 100 9001",
  },
  {
    title: "Refrigerador Whirlpool — 2 puertas, funcionando",
    description: "Refrigerador Whirlpool 2 puertas, 14 pies cúbicos, color inoxidable. Funcionando perfectamente, se vende por mudanza.",
    price: 5500,
    category: "HOGAR_Y_JARDIN",
    city: "NOGALES",
    imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop",
    seller: "Beatriz L.",
    contactPhone: "+52 631 100 9002",
  },
  // --- PIEDRAS_NEGRAS ---
  {
    title: "PC gamer — Ryzen 7, RTX 4060, 32GB RAM",
    description: "PC armada: Ryzen 7 5800X, RTX 4060 8GB, 32GB DDR4, SSD 1TB, gabinete con RGB. Lista para jugar y trabajar.",
    price: 18500,
    category: "ELECTRONICA",
    city: "PIEDRAS_NEGRAS",
    imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=800&auto=format&fit=crop",
    seller: "Elena S.",
    contactPhone: "+52 878 101 0001",
  },
  {
    title: "Clases de inglés — todos los niveles",
    description: "Profesora certificada TOEFL ofrece clases de inglés presencial y en línea. Grupos reducidos, material incluido.",
    price: 2500,
    category: "SERVICIOS",
    city: "PIEDRAS_NEGRAS",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    seller: "Vicki L.",
    contactPhone: "+52 878 101 0002",
  },
  // --- AGUA_PRIETA ---
  {
    title: "Motocicleta Italika FT150 — 2023",
    description: "Italika FT150 modelo 2023, 3,000 km, servicio al día, casco y candado incluidos. Papeles en regla.",
    price: 28000,
    category: "VEHICULOS",
    city: "AGUA_PRIETA",
    imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
    seller: "Caili C.",
    contactPhone: "+52 633 101 1001",
  },
  {
    title: "Vestidos de fiesta — lote de 5, tallas S-M",
    description: "5 vestidos de fiesta (cortos y largos), tallas S-M, usados una sola vez. Colores variados, excelente calidad.",
    price: 2800,
    category: "MODA",
    city: "AGUA_PRIETA",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    seller: "Rebecca G.",
    contactPhone: "+52 633 101 1002",
  },
];

async function main() {
  for (const crossing of CROSSINGS) {
    await prisma.borderCrossing.upsert({
      where: { portNumber: crossing.portNumber },
      update: crossing,
      create: crossing,
    });
  }
  console.log("Seed garitas: " + CROSSINGS.length + " cruces.");
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@lafrontera.mx" },
    update: { role: "BUSINESS_OWNER" },
    create: {
      email: "owner@lafrontera.mx",
      passwordHash,
      name: "Dueño Demo",
      role: "BUSINESS_OWNER",
      city: "TIJUANA",
    },
  });

  await prisma.business.deleteMany({});

  const authorIds = {};
  for (const a of authors) {
    const u = await prisma.user.upsert({
      where: { email: a.email },
      update: { name: a.name, avatarUrl: a.avatarUrl },
      create: { email: a.email, name: a.name, avatarUrl: a.avatarUrl, city: "TIJUANA" },
    });
    authorIds[a.name] = u.id;
  }

  const allBusinesses = [...restaurants, ...buildExtraBusinesses()];

  const bySlug = {};
  for (const r of allBusinesses) {
    const b = await prisma.business.create({
      data: {
        ownerId: owner.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        category: r.category,
        priceRange: r.priceRange,
        city: r.city,
        address: r.address,
        latitude: r.latitude,
        longitude: r.longitude,
        featured: r.featured,
        phone: r.phone,
        whatsapp: r.whatsapp,
        email: r.email,
        website: r.website,
        createdAt: new Date(r.createdAt),
        gallery: {
          create: [
            { url: r.cover, order: 0 },
            ...r.gallery.map((url, i) => ({ url, order: i + 1 })),
          ],
        },
        hours: { create: r.hours },
      },
    });
    bySlug[r.slug] = b.id;
  }

  for (const r of reviews) {
    await prisma.review.create({
      data: {
        businessId: bySlug[r.business],
        userId: authorIds[r.author],
        rating: r.rating,
        comment: r.comment,
        createdAt: new Date(r.createdAt),
      },
    });
  }

  for (const r of restaurants) {
    const agg = await prisma.review.aggregate({
      where: { businessId: bySlug[r.slug] },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.business.update({
      where: { id: bySlug[r.slug] },
      data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count.rating ?? 0 },
    });
  }

  // --- Marketplace: 2 publicaciones por ciudad ---
  await prisma.marketplaceListing.deleteMany({});

  let mpCreated = 0;
  for (const ml of MARKETPLACE_LISTINGS) {
    const sellerId = authorIds[ml.seller];
    if (!sellerId) {
      console.warn(`Seller "${ml.seller}" no encontrado, omitiendo "${ml.title}"`);
      continue;
    }
    let slug = slugifySeed(ml.title);
    let suffix = 1;
    while (await prisma.marketplaceListing.findUnique({ where: { slug } })) {
      slug = `${slugifySeed(ml.title)}-${suffix++}`;
    }
    await prisma.marketplaceListing.create({
      data: {
        sellerId,
        title: ml.title,
        slug,
        description: ml.description,
        price: ml.price,
        category: ml.category,
        city: ml.city,
        imageUrl: ml.imageUrl,
        contactName: ml.seller,
        contactPhone: ml.contactPhone,
        contactWhatsapp: ml.contactPhone,
        contactEmail: ml.contactEmail || null,
      },
    });
    mpCreated += 1;
  }

  console.log(
    `Seed completado: ${allBusinesses.length} negocios, ${mpCreated} publicaciones de marketplace, horarios, galería y reseñas.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
