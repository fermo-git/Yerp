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

async function main() {
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

  const bySlug = {};
  for (const r of restaurants) {
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

  console.log("Seed completado: restaurantes, horarios, galería y reseñas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
