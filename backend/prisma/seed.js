import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CITY = "SAN_LUIS_RIO_COLORADO";

// ---------------------------------------------------------------------------
// Datos de ejemplo basados en negocios reales de San Luis Río Colorado, Sonora.
// Fuentes de referencia: DENUE-INEGI, Sección Amarilla, Restaurant Guru.
// ---------------------------------------------------------------------------

const users = [
  { email: "owner@lafrontera.mx", name: "Dueño Demo", role: "BUSINESS_OWNER" },
  { email: "javier.mariscos@gmail.com", name: "Javier Medina", role: "BUSINESS_OWNER" },
  { email: "laura.benavides@gmail.com", name: "Laura Benavides", role: "BUSINESS_OWNER" },
  { email: "mario.hernandez@gmail.com", name: "Mario Hernández", role: "BUSINESS_OWNER" },
  { email: "ana.garcia@gmail.com", name: "Ana García", role: "USER" },
  { email: "carlos.lopez@gmail.com", name: "Carlos López", role: "USER" },
  { email: "maria.flores@gmail.com", name: "María Flores", role: "USER" },
  { email: "pedro.ramirez@gmail.com", name: "Pedro Ramírez", role: "USER" },
  { email: "lucia.martinez@gmail.com", name: "Lucía Martínez", role: "USER" },
  { email: "jorge.diaz@gmail.com", name: "Jorge Díaz", role: "USER" },
  { email: "sofia.torres@gmail.com", name: "Sofía Torres", role: "USER" },
  { email: "daniel.agundez@gmail.com", name: "Daniel Agúndez", role: "USER" },
  { email: "karla.villalobos@gmail.com", name: "Karla Villalobos", role: "USER" },
  { email: "omar.castillo@gmail.com", name: "Omar Castillo", role: "USER" },
];

const businesses = [
  {
    slug: "restaurant-el-herradero",
    name: "Restaurant El Herradero",
    description: "Restaurante de comida mexicana muy valorado en la ciudad, parrilladas y cortes al carbón.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    address: "Av. Miguel Hidalgo y Costilla 500, Centro",
    phone: "+52 653 534 1538",
    whatsapp: "+52 653 534 1538",
    email: "contacto@elherradero.mx",
    website: "https://www.elherradero.mx",
    latitude: 32.4711,
    longitude: -114.7705,
  },
  {
    slug: "brisa-norte-restaurante",
    name: "Brisa Norte",
    description: "Cocina del norte, mariscos frescos y especialidades de la región del Río Colorado.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    address: "Av. Sonora 1200, Col. Jalisco",
    phone: "+52 653 518 3311",
    whatsapp: "+52 653 518 3311",
    email: "hola@brisanorte.mx",
    website: "https://www.brisanorte.mx",
    latitude: 32.4689,
    longitude: -114.7733,
  },
  {
    slug: "changs-restaurante",
    name: "Chang's Restaurante",
    description: "Comida china y cantonesa, uno de los restaurantes mejor calificados de la ciudad.",
    category: "RESTAURANTE",
    priceRange: "ECONOMICO",
    address: "Calle 7 S/N, Col. Sonora",
    phone: "+52 653 121 9282",
    whatsapp: "+52 653 121 9282",
    email: "changs.slrc@gmail.com",
    website: null,
    latitude: 32.4745,
    longitude: -114.7751,
  },
  {
    slug: "mariscos-el-rodo",
    name: "Mariscos El Rodo",
    description: "Mariscos frescos: campechanas, ceviche y cocteles a pasos del centro.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    address: "Av. Sonora S/N, Col. Sonora",
    phone: "+52 653 114 3319",
    whatsapp: "+52 653 114 3319",
    email: "elrodo.mariscos@gmail.com",
    website: null,
    latitude: 32.4733,
    longitude: -114.7739,
  },
  {
    slug: "el-palmar-tacos-y-caldos",
    name: "El Palmar Tacos y Caldos de Mariscos",
    description: "Tacos de mariscos y caldos reconfortantes, especialidad local.",
    category: "RESTAURANTE",
    priceRange: "ECONOMICO",
    address: "Calle 7 S/N, Col. Sonora",
    phone: "+52 653 114 6973",
    whatsapp: "+52 653 114 6973",
    email: "elpalmar.slrc@gmail.com",
    website: null,
    latitude: 32.4742,
    longitude: -114.7747,
  },
  {
    slug: "mariscos-el-paisa",
    name: "Mariscos El Paisa",
    description: "Mariscos al estilo de Sinaloa y Sonora, ambiente familiar.",
    category: "RESTAURANTE",
    priceRange: "MODERADO",
    address: "Av. Francisco I. Madero 2801, Col. Burócrata",
    phone: "+52 653 105 3469",
    whatsapp: "+52 653 105 3469",
    email: "elpaisa.mariscos@gmail.com",
    website: null,
    latitude: 32.4697,
    longitude: -114.7688,
  },
  {
    slug: "verde-cafe",
    name: "Verde Café",
    description: "Café de especialidad, desayunos saludables y repostería artesanal.",
    category: "CAFETERIA",
    priceRange: "ECONOMICO",
    address: "Av. Lázaro Cárdenas del Río B S/N, Col. Del Bosque",
    phone: "+52 653 272 8001",
    whatsapp: "+52 653 272 8001",
    email: "hola@verdecafe.mx",
    website: "https://www.verdecafe.mx",
    latitude: 32.4678,
    longitude: -114.7642,
  },
  {
    slug: "farmacias-benavides-slrc",
    name: "Farmacias Benavides",
    description: "Cadena de farmacias con medicamentos, productos de salud y promociones diarias.",
    category: "SALUD",
    priceRange: "MODERADO",
    address: "Av. Álvaro Obregón 101, Centro",
    phone: "+52 653 534 1538",
    whatsapp: "+52 653 534 1538",
    email: "sucursal.slrc@benavides.com.mx",
    website: "https://www.benavides.com.mx",
    latitude: 32.4702,
    longitude: -114.7691,
  },
  {
    slug: "farmacia-descuento-san-jorge",
    name: "Farmacia de Descuento San Jorge",
    description: "Farmacia y boticas con precios accesibles y servicio las 24 horas.",
    category: "SALUD",
    priceRange: "ECONOMICO",
    address: "Kino y Calle 22 S/N, Col. Comercial",
    phone: "+52 653 536 2058",
    whatsapp: "+52 653 536 2058",
    email: "sanjorge.farmacia@gmail.com",
    website: null,
    latitude: 32.4766,
    longitude: -114.7764,
  },
  {
    slug: "universidad-vizcaya-slrc",
    name: "Universidad Vizcaya de las Américas — Campus SLRC",
    description: "Institución de educación superior con licenciaturas y posgrados.",
    category: "EDUCACION",
    priceRange: "PREMIUM",
    address: "Av. Carlos G. Calles 3901, Col. Burócrata",
    phone: "+52 653 517 5958",
    whatsapp: "+52 653 517 5958",
    email: "informes.slrc@uvimex.edu.mx",
    website: "https://www.univizcaya.edu.mx",
    latitude: 32.4729,
    longitude: -114.7661,
  },
  {
    slug: "hotel-san-antonio",
    name: "Hotel San Antonio",
    description: "Hotel céntrico, cómodo y cercano a la garita internacional.",
    category: "HOTEL",
    priceRange: "MODERADO",
    address: "Av. Álvaro Obregón 269 Bis, Col. Comercial",
    phone: "+52 653 518 3781",
    whatsapp: "+52 653 538 0067",
    email: "reservas@hotelsanantonio.mx",
    website: "https://hotelsanantonio.mx",
    latitude: 32.4698,
    longitude: -114.7699,
  },
  {
    slug: "clinica-automotriz-mexico",
    name: "Clínica Automotriz México",
    description: "Taller de diagnóstico por computadora, mecánica general y alineación.",
    category: "AUTOMOTRIZ",
    priceRange: "MODERADO",
    address: "Calzada Monterrey y Av. Nuevo León S/N",
    phone: "+52 653 515 2010",
    whatsapp: "+52 653 515 2010",
    email: "clinicaautomotriz.mex@gmail.com",
    website: null,
    latitude: 32.4758,
    longitude: -114.7792,
  },
];

const reviews = [
  { businessSlug: "restaurant-el-herradero", userEmail: "ana.garcia@gmail.com", rating: 5, comment: "El corte de res al carbón está increíble, servicio rápido y precios justos." },
  { businessSlug: "restaurant-el-herradero", userEmail: "carlos.lopez@gmail.com", rating: 4, comment: "Muy buen restaurante, las parrilladas para compartir son generosas." },
  { businessSlug: "restaurant-el-herradero", userEmail: "maria.flores@gmail.com", rating: 5, comment: "El mejor restaurante de comida mexicana que he probado en la ciudad." },
  { businessSlug: "brisa-norte-restaurante", userEmail: "pedro.ramirez@gmail.com", rating: 4, comment: "Los mariscos muy frescos y el ambiente agradable." },
  { businessSlug: "brisa-norte-restaurante", userEmail: "lucia.martinez@gmail.com", rating: 5, comment: "La campechana es espectacular, volveré pronto." },
  { businessSlug: "changs-restaurante", userEmail: "jorge.diaz@gmail.com", rating: 4, comment: "Buena comida china, porciones generosas." },
  { businessSlug: "mariscos-el-rodo", userEmail: "sofia.torres@gmail.com", rating: 4, comment: "El ceviche está muy bueno, pero el estacionamiento es complicado." },
  { businessSlug: "el-palmar-tacos-y-caldos", userEmail: "daniel.agundez@gmail.com", rating: 5, comment: "Los tacos de camarón son de otro nivel." },
  { businessSlug: "mariscos-el-paisa", userEmail: "karla.villalobos@gmail.com", rating: 4, comment: "Buena opción para mariscos, el aguachile está rico." },
  { businessSlug: "verde-cafe", userEmail: "omar.castillo@gmail.com", rating: 5, comment: "El mejor café de especialidad de SLRC, ideal para trabajar." },
  { businessSlug: "verde-cafe", userEmail: "ana.garcia@gmail.com", rating: 4, comment: "Los desayunos saludables están muy buenos." },
  { businessSlug: "farmacias-benavides-slrc", userEmail: "carlos.lopez@gmail.com", rating: 5, comment: "Siempre tienen lo que necesito y atienden rápido." },
  { businessSlug: "universidad-vizcaya-slrc", userEmail: "jorge.diaz@gmail.com", rating: 4, comment: "Buenas instalaciones y maestros preparados." },
  { businessSlug: "hotel-san-antonio", userEmail: "lucia.martinez@gmail.com", rating: 4, comment: "Cómodo, limpio y muy cerca del cruce fronterizo." },
  { businessSlug: "clinica-automotriz-mexico", userEmail: "pedro.ramirez@gmail.com", rating: 4, comment: "Diagnóstico certero y precios razonables." },
  { businessSlug: "farmacia-descuento-san-jorge", userEmail: "sofia.torres@gmail.com", rating: 5, comment: "Muy buenos precios y atención amable." },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
];

const marketplaceListings = [
  { slug: "pickup-chevy-silverado-2008", title: "Pickup Chevrolet Silverado 2008", category: "VEHICULOS", price: "185000", description: "Camioneta 4x4 en buen estado, motor V8, caja de cambios automática. Documentos en regla.", contactName: "Juan Leyva" },
  { slug: "casa-venta-col-cuauhtemoc", title: "Casa en venta Col. Cuauhtémoc", category: "INMUEBLES", price: "1750000", description: "Casa de 2 plantas, 3 recámaras, 2 baños, cochera para 2 autos. Cerca del centro.", contactName: "Inmobiliaria del Río" },
  { slug: "iphone-13-128gb", title: "iPhone 13 128GB", category: "ELECTRONICA", price: "9800", description: "Desbloqueado, batería al 89%, sin rayones. Incluye caja y cable.", contactName: "Raúl Esquer" },
  { slug: "terreno-ejidal-500m2", title: "Terreno 500 m² cerca del malecón", category: "INMUEBLES", price: "420000", description: "Terreno plano con uso de suelo habitacional, servicios cercanos.", contactName: "Marco Cota" },
  { slug: "estufa-5-quemadores", title: "Estufa de 5 quemadores seminueva", category: "HOGAR_Y_JARDIN", price: "2600", description: "Funciona perfecto, se vende por mudanza.", contactName: "Elena Parra" },
  { slug: "ayudante-general-cocina", title: "Se busca ayudante general de cocina", category: "EMPLEO", price: null, description: "Restaurante del centro requiere ayudante, sueldo por definir según experiencia. Lunes a sábado.", contactName: "Restaurant El Herradero" },
  { slug: "mecanico-diesel", title: "Mecánico diésel con experiencia", category: "EMPLEO", price: null, description: "Taller de la colonia Burócrata busca mecánico diésel. Prestaciones de ley.", contactName: "Clínica Automotriz México" },
  { slug: "servicio-mudanzas-locales", title: "Mudanzas locales y entrega de muebles", category: "SERVICIOS", price: "1200", description: "Camioneta de redilas, mudanzas dentro de la ciudad y a Sonoyta.", contactName: "Tony Ramírez" },
  { slug: "laptop-hp-i5", title: "Laptop HP Core i5 8GB 256SSD", category: "ELECTRONICA", price: "5200", description: "Lista para trabajar o estudiar, pantalla 15.6 pulgadas.", contactName: "Luis Navarro" },
  { slug: "moda-ropa-americana", title: "Lote de ropa americana por mayoreo", category: "MODA", price: "15000", description: "Lote de 300 piezas surtido, tallas M y L, ideal para local.", contactName: "Boutique El Paso" },
];

const crossings = [
  { portNumber: "260801", name: "San Luis Río Colorado I", hoursOfOperation: "24 hrs/día", latitude: 32.4763, longitude: -114.7679 },
  { portNumber: "260802", name: "San Luis Río Colorado II", hoursOfOperation: "09:00 - 19:00", latitude: 32.44, longitude: -114.72 },
];

async function main() {
  // Limpia todo en orden de dependencias
  await prisma.waitTimePattern.deleteMany({});
  await prisma.waitTime.deleteMany({});
  await prisma.borderCrossing.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.businessHour.deleteMany({});
  await prisma.galleryImage.deleteMany({});
  await prisma.userInterest.deleteMany({});
  await prisma.marketplaceListing.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("demo1234", 10);

  // Garitas (solo las 2 reales de SLRC)
  const crossingRecords = {};
  for (const c of crossings) {
    const rec = await prisma.borderCrossing.create({ data: { ...c, city: CITY } });
    crossingRecords[c.portNumber] = rec;
  }

  // Usuarios
  const userRecords = {};
  for (const u of users) {
    const rec = await prisma.user.create({
      data: { ...u, city: CITY, passwordHash },
    });
    userRecords[u.email] = rec;
  }

  // Negocios con galería y horarios
  const businessRecords = {};
  const hourSets = [
    { opens: "11:00", closes: "22:00" },
    { opens: "07:00", closes: "15:00" },
    { opens: "08:00", closes: "21:00" },
  ];
  for (let i = 0; i < businesses.length; i++) {
    const b = businesses[i];
    const owner = userRecords["owner@lafrontera.mx"];
    const rec = await prisma.business.create({
      data: {
        ownerId: owner.id,
        name: b.name,
        slug: b.slug,
        description: b.description,
        category: b.category,
        priceRange: b.priceRange,
        featured: i < 5,
        city: CITY,
        address: b.address,
        latitude: b.latitude,
        longitude: b.longitude,
        phone: b.phone,
        whatsapp: b.whatsapp,
        email: b.email,
        website: b.website,
        gallery: {
          create: galleryImages.slice(0, 3 + (i % 3)).map((url, order) => ({
            url,
            caption: b.name,
            order,
          })),
        },
        hours: {
          create: [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
            const h = hourSets[i % hourSets.length];
            return { dayOfWeek, opensAt: h.opens, closesAt: h.closes };
          }),
        },
      },
    });
    businessRecords[b.slug] = rec;
  }

  // Reseñas
  for (const r of reviews) {
    const biz = businessRecords[r.businessSlug];
    const user = userRecords[r.userEmail];
    await prisma.review.create({
      data: { businessId: biz.id, userId: user.id, rating: r.rating, comment: r.comment },
    });
  }

  // Recalcula avgRating y reviewCount de cada negocio
  for (const b of businesses) {
    const biz = businessRecords[b.slug];
    const agg = await prisma.review.aggregate({
      where: { businessId: biz.id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.business.update({
      where: { id: biz.id },
      data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count.rating ?? 0 },
    });
  }

  // Favoritos
  const favorites = [
    { userEmail: "ana.garcia@gmail.com", businessSlug: "restaurant-el-herradero" },
    { userEmail: "carlos.lopez@gmail.com", businessSlug: "mariscos-el-rodo" },
    { userEmail: "maria.flores@gmail.com", businessSlug: "verde-cafe" },
    { userEmail: "pedro.ramirez@gmail.com", businessSlug: "brisa-norte-restaurante" },
    { userEmail: "lucia.martinez@gmail.com", businessSlug: "hotel-san-antonio" },
    { userEmail: "jorge.diaz@gmail.com", businessSlug: "universidad-vizcaya-slrc" },
    { userEmail: "sofia.torres@gmail.com", businessSlug: "changs-restaurante" },
    { userEmail: "daniel.agundez@gmail.com", businessSlug: "el-palmar-tacos-y-caldos" },
    { userEmail: "karla.villalobos@gmail.com", businessSlug: "mariscos-el-paisa" },
    { userEmail: "omar.castillo@gmail.com", businessSlug: "verde-cafe" },
    { userEmail: "javier.mariscos@gmail.com", businessSlug: "restaurant-el-herradero" },
    { userEmail: "laura.benavides@gmail.com", businessSlug: "farmacias-benavides-slrc" },
  ];
  for (const f of favorites) {
    await prisma.favorite.create({
      data: {
        userId: userRecords[f.userEmail].id,
        businessId: businessRecords[f.businessSlug].id,
      },
    });
  }

  // Intereses de usuarios
  const interests = [
    { userEmail: "ana.garcia@gmail.com", category: "RESTAURANTE" },
    { userEmail: "ana.garcia@gmail.com", category: "CAFETERIA" },
    { userEmail: "carlos.lopez@gmail.com", category: "RESTAURANTE" },
    { userEmail: "maria.flores@gmail.com", category: "CAFETERIA" },
    { userEmail: "pedro.ramirez@gmail.com", category: "AUTOMOTRIZ" },
    { userEmail: "lucia.martinez@gmail.com", category: "HOTEL" },
    { userEmail: "jorge.diaz@gmail.com", category: "EDUCACION" },
    { userEmail: "sofia.torres@gmail.com", category: "SALUD" },
    { userEmail: "daniel.agundez@gmail.com", category: "RESTAURANTE" },
    { userEmail: "karla.villalobos@gmail.com", category: "BELLEZA" },
    { userEmail: "omar.castillo@gmail.com", category: "SERVICIOS_PROFESIONALES" },
    { userEmail: "javier.mariscos@gmail.com", category: "RESTAURANTE" },
    { userEmail: "laura.benavides@gmail.com", category: "SALUD" },
    { userEmail: "mario.hernandez@gmail.com", category: "AUTOMOTRIZ" },
  ];
  for (const i of interests) {
    await prisma.userInterest.create({
      data: { userId: userRecords[i.userEmail].id, category: i.category },
    });
  }

  // Refresh tokens (1 por usuario + 2 extra)
  const tokens = users.map((u) => ({ userEmail: u.email }));
  tokens.push({ userEmail: "ana.garcia@gmail.com" }, { userEmail: "carlos.lopez@gmail.com" });
  const crypto = await import("node:crypto");
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        tokenHash: crypto.createHash("sha256").update(`seed-token-${i}-${Date.now()}`).digest("hex"),
        userId: userRecords[t.userEmail].id,
        expiresAt: expiry,
        revoked: false,
      },
    });
  }

  // Marketplace listings
  for (const l of marketplaceListings) {
    const seller = userRecords["mario.hernandez@gmail.com"];
    await prisma.marketplaceListing.create({
      data: {
        sellerId: seller.id,
        title: l.title,
        slug: l.slug,
        description: l.description,
        price: l.price ?? null,
        category: l.category,
        city: CITY,
        contactName: l.contactName,
        contactPhone: "+52 653 000 0000",
        contactWhatsapp: "+52 653 000 0000",
        contactEmail: "anuncio@lafrontera.mx",
      },
    });
  }

  // Tiempos de espera (multiples lanes y momentos por garita)
  const crossing1 = crossingRecords["260801"];
  const crossing2 = crossingRecords["260802"];
  const waitTimes = [
    { crossing: crossing1, laneType: "GENERAL", waitMinutes: 75, lanesOpen: 3, status: "DELAYED", recordedAt: "2026-08-15T08:00:00Z" },
    { crossing: crossing1, laneType: "SENTRI", waitMinutes: 25, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T08:00:00Z" },
    { crossing: crossing1, laneType: "READY_LANE", waitMinutes: 60, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T08:00:00Z" },
    { crossing: crossing1, laneType: "PEATONAL", waitMinutes: 10, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T08:00:00Z" },
    { crossing: crossing1, laneType: "GENERAL", waitMinutes: 45, lanesOpen: 4, status: "OPEN", recordedAt: "2026-08-15T10:00:00Z" },
    { crossing: crossing1, laneType: "SENTRI", waitMinutes: 15, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T10:00:00Z" },
    { crossing: crossing1, laneType: "READY_LANE", waitMinutes: 30, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T10:00:00Z" },
    { crossing: crossing1, laneType: "PEATONAL", waitMinutes: 5, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T10:00:00Z" },
    { crossing: crossing2, laneType: "GENERAL", waitMinutes: 20, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T09:00:00Z" },
    { crossing: crossing2, laneType: "READY_LANE", waitMinutes: 15, lanesOpen: 1, status: "OPEN", recordedAt: "2026-08-15T09:00:00Z" },
    { crossing: crossing2, laneType: "GENERAL", waitMinutes: 35, lanesOpen: 2, status: "OPEN", recordedAt: "2026-08-15T12:00:00Z" },
    { crossing: crossing2, laneType: "READY_LANE", waitMinutes: 25, lanesOpen: 1, status: "OPEN", recordedAt: "2026-08-15T12:00:00Z" },
  ];
  for (const w of waitTimes) {
    await prisma.waitTime.create({
      data: {
        crossingId: w.crossing.id,
        laneType: w.laneType,
        waitMinutes: w.waitMinutes,
        lanesOpen: w.lanesOpen,
        status: w.status,
        recordedAt: new Date(w.recordedAt),
      },
    });
  }

  // Patrones de espera
  const patterns = [];
  const laneOrder = ["GENERAL", "SENTRI", "READY_LANE", "PEATONAL"];
  let idx = 0;
  for (let day = 0; day < 7; day++) {
    for (const laneType of laneOrder) {
      if (idx >= 14) break;
      patterns.push({
        crossing: crossing1,
        laneType,
        dayOfWeek: day,
        hourOfDay: (8 + idx) % 24,
        avgWaitMinutes: 20 + ((idx * 13) % 55),
        sampleCount: 40 + idx * 3,
      });
      idx++;
    }
    if (idx >= 14) break;
  }
  for (const p of patterns) {
    await prisma.waitTimePattern.create({
      data: {
        crossingId: p.crossing.id,
        laneType: p.laneType,
        dayOfWeek: p.dayOfWeek,
        hourOfDay: p.hourOfDay,
        avgWaitMinutes: p.avgWaitMinutes,
        sampleCount: p.sampleCount,
        lastCalculatedAt: new Date(),
      },
    });
  }

  const counts = {
    users: await prisma.user.count(),
    businesses: await prisma.business.count(),
    reviews: await prisma.review.count(),
    galleryImages: await prisma.galleryImage.count(),
    businessHours: await prisma.businessHour.count(),
    favorites: await prisma.favorite.count(),
    userInterests: await prisma.userInterest.count(),
    refreshTokens: await prisma.refreshToken.count(),
    marketplaceListings: await prisma.marketplaceListing.count(),
    borderCrossings: await prisma.borderCrossing.count(),
    waitTimes: await prisma.waitTime.count(),
    waitTimePatterns: await prisma.waitTimePattern.count(),
  };

  console.log("Seed completado (San Luis Río Colorado):");
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k}: ${v}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());