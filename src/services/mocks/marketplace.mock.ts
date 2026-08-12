import type { MarketplaceListing, MarketplaceCategory } from "@/types/marketplace";
import type { BorderCity } from "@/types/business";

// -----------------------------------------------------------------
// Mock de MarketplaceListing — 50 publicaciones repartidas entre las
// 10 ciudades fronterizas y las 8 categorías del diccionario de datos.
// Se genera a partir de plantillas para mantener el archivo legible;
// el resultado (MOCK_MARKETPLACE_LISTINGS) es un arreglo plano, igual
// que MOCK_BUSINESSES en businesses.mock.ts.
// -----------------------------------------------------------------

const CITIES: BorderCity[] = [
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
];

interface ListingTemplate {
  title: string;
  category: MarketplaceCategory;
  description: string;
  price: number | null;
  imageSeed: string;
}

const TEMPLATES: ListingTemplate[] = [
  // VEHICULOS
  {
    title: "Honda Civic 2018, único dueño",
    category: "VEHICULOS",
    description: "Automático, factura original, sin choques. Papeles fronterizos en regla.",
    price: 215000,
    imageSeed: "civic-2018",
  },
  {
    title: "Camioneta Ford F-150 2015",
    category: "VEHICULOS",
    description: "4x4, motor 5.0L, llantas nuevas. Ideal para trabajo o cruce diario.",
    price: 289000,
    imageSeed: "f150-2015",
  },
  {
    title: "Bicicleta de montaña rodada 29",
    category: "VEHICULOS",
    description: "Aluminio, 21 velocidades, frenos de disco. Poco uso.",
    price: 3200,
    imageSeed: "bici-mtb",
  },
  {
    title: "Motoneta Italika 150cc",
    category: "VEHICULOS",
    description: "Modelo reciente, rinde muy bien para moverse dentro de la ciudad.",
    price: 21500,
    imageSeed: "italika-150",
  },
  {
    title: "Nissan Versa 2020 seminuevo",
    category: "VEHICULOS",
    description: "Estándar, aire acondicionado, bajo kilometraje. Revisión mecánica al día.",
    price: 178000,
    imageSeed: "versa-2020",
  },
  {
    title: "Remolque de carga usado",
    category: "VEHICULOS",
    description: "Doble eje, piso de madera reforzado. Bueno para mudanzas o negocio.",
    price: 32000,
    imageSeed: "remolque",
  },
  // INMUEBLES
  {
    title: "Departamento en renta cerca del cruce",
    category: "INMUEBLES",
    description: "2 recámaras, 1 baño, estacionamiento techado. A 10 min de la garita.",
    price: 8500,
    imageSeed: "depto-cruce",
  },
  {
    title: "Casa en venta, fraccionamiento privado",
    category: "INMUEBLES",
    description: "3 recámaras, jardín trasero, caseta de vigilancia 24 hrs.",
    price: 1650000,
    imageSeed: "casa-privada",
  },
  {
    title: "Local comercial en renta, planta baja",
    category: "INMUEBLES",
    description: "60 m², frente a avenida principal, ideal para negocio propio.",
    price: 12000,
    imageSeed: "local-comercial",
  },
  {
    title: "Terreno residencial 300 m²",
    category: "INMUEBLES",
    description: "Esquina, servicios de luz y agua ya instalados. Escrituras al corriente.",
    price: 480000,
    imageSeed: "terreno-residencial",
  },
  {
    title: "Cuarto en renta, zona centro",
    category: "INMUEBLES",
    description: "Amueblado, incluye servicios. A unas cuadras del centro histórico.",
    price: 3800,
    imageSeed: "cuarto-centro",
  },
  {
    title: "Bodega industrial en renta",
    category: "INMUEBLES",
    description: "400 m², altura de 6 m, acceso para tráiler. Zona industrial.",
    price: 25000,
    imageSeed: "bodega-industrial",
  },
  // ELECTRONICA
  {
    title: "Laptop HP Pavilion 15, 16GB RAM",
    category: "ELECTRONICA",
    description: "Poco uso, incluye cargador original y mochila.",
    price: 9800,
    imageSeed: "laptop-hp",
  },
  {
    title: "iPhone 13, 128GB, desbloqueado",
    category: "ELECTRONICA",
    description: "Batería al 91%, sin rayones, incluye caja y cable.",
    price: 8200,
    imageSeed: "iphone-13",
  },
  {
    title: "Pantalla Smart TV 55 pulgadas",
    category: "ELECTRONICA",
    description: "4K, poco uso, incluye control original y soporte de pared.",
    price: 6500,
    imageSeed: "smart-tv-55",
  },
  {
    title: "Consola PlayStation 5 con 2 controles",
    category: "ELECTRONICA",
    description: "Edición estándar, incluye 3 juegos físicos.",
    price: 9200,
    imageSeed: "ps5-consola",
  },
  {
    title: "Bocina Bluetooth portátil JBL",
    category: "ELECTRONICA",
    description: "Resistente al agua, batería dura todo el día.",
    price: 950,
    imageSeed: "bocina-jbl",
  },
  {
    title: "Cámara réflex Canon con dos lentes",
    category: "ELECTRONICA",
    description: "Ideal para quienes están empezando en fotografía. Poco uso.",
    price: 7400,
    imageSeed: "camara-canon",
  },
  // HOGAR_Y_JARDIN
  {
    title: "Juego de sala de 3 piezas",
    category: "HOGAR_Y_JARDIN",
    description: "Tela gris, muy cómodo, sin manchas ni desgaste.",
    price: 5200,
    imageSeed: "sala-3-piezas",
  },
  {
    title: "Refrigerador 14 pies, poco uso",
    category: "HOGAR_Y_JARDIN",
    description: "Dos puertas, no frost, funciona perfecto.",
    price: 6800,
    imageSeed: "refrigerador-14",
  },
  {
    title: "Set de macetas de barro para jardín",
    category: "HOGAR_Y_JARDIN",
    description: "12 piezas de distintos tamaños, ideales para exterior.",
    price: 650,
    imageSeed: "macetas-barro",
  },
  {
    title: "Comedor de madera maciza, 6 sillas",
    category: "HOGAR_Y_JARDIN",
    description: "Diseño rústico, muy resistente. Se vende por mudanza.",
    price: 7900,
    imageSeed: "comedor-madera",
  },
  {
    title: "Lavadora automática 18 kg",
    category: "HOGAR_Y_JARDIN",
    description: "Funcionando perfectamente, poco uso, incluye manguera.",
    price: 4300,
    imageSeed: "lavadora-18kg",
  },
  {
    title: "Parrilla de gas para patio",
    category: "HOGAR_Y_JARDIN",
    description: "4 quemadores, incluye tanque de gas y cubierta protectora.",
    price: 2600,
    imageSeed: "parrilla-gas",
  },
  // EMPLEO
  {
    title: "Se solicita mesero(a) con experiencia",
    category: "EMPLEO",
    description: "Turno mixto, prestaciones de ley. Presentarse con CV actualizado.",
    price: null,
    imageSeed: "empleo-mesero",
  },
  {
    title: "Vacante para chofer de reparto",
    category: "EMPLEO",
    description: "Licencia vigente, disponibilidad de horario. Sueldo base más comisiones.",
    price: null,
    imageSeed: "empleo-chofer",
  },
  {
    title: "Busco empleo como costurera",
    category: "EMPLEO",
    description: "Experiencia en maquila y arreglos de ropa. Disponibilidad inmediata.",
    price: null,
    imageSeed: "empleo-costurera",
  },
  {
    title: "Se busca auxiliar administrativo",
    category: "EMPLEO",
    description: "Manejo de Excel y atención al cliente. Turno matutino.",
    price: null,
    imageSeed: "empleo-admin",
  },
  {
    title: "Vacante técnico en refrigeración",
    category: "EMPLEO",
    description: "Experiencia mínima de 1 año, herramienta propia deseable.",
    price: null,
    imageSeed: "empleo-refrigeracion",
  },
  // SERVICIOS
  {
    title: "Clases particulares de inglés",
    category: "SERVICIOS",
    description: "Para niños y adultos, presencial o en línea. Material incluido.",
    price: 250,
    imageSeed: "clases-ingles",
  },
  {
    title: "Servicio de mudanzas locales",
    category: "SERVICIOS",
    description: "Camión propio, personal para carga y descarga. Presupuesto sin compromiso.",
    price: null,
    imageSeed: "mudanzas-servicio",
  },
  {
    title: "Reparación de aires acondicionados",
    category: "SERVICIOS",
    description: "Mantenimiento, recarga de gas y diagnóstico a domicilio.",
    price: 450,
    imageSeed: "reparacion-ac",
  },
  {
    title: "Maquillaje profesional para eventos",
    category: "SERVICIOS",
    description: "Sesiones a domicilio o en estudio. Paquetes para XV años y bodas.",
    price: 800,
    imageSeed: "maquillaje-eventos",
  },
  {
    title: "Clases de manejo para principiantes",
    category: "SERVICIOS",
    description: "Auto automático, instructor certificado, horarios flexibles.",
    price: 350,
    imageSeed: "clases-manejo",
  },
  {
    title: "Servicio de plomería y fugas de agua",
    category: "SERVICIOS",
    description: "Atención rápida, presupuesto gratis antes de iniciar el trabajo.",
    price: null,
    imageSeed: "plomeria-servicio",
  },
  // MODA
  {
    title: "Chamarra de piel talla M",
    category: "MODA",
    description: "Poco uso, ideal para el invierno fronterizo. Color negro.",
    price: 900,
    imageSeed: "chamarra-piel",
  },
  {
    title: "Vestido de noche talla 8",
    category: "MODA",
    description: "Usado una sola vez, perfecto para eventos formales.",
    price: 1100,
    imageSeed: "vestido-noche",
  },
  {
    title: "Tenis deportivos nuevos, talla 27",
    category: "MODA",
    description: "Nunca usados, con caja original.",
    price: 1350,
    imageSeed: "tenis-deportivos",
  },
  {
    title: "Bolsa de mano tipo piel",
    category: "MODA",
    description: "Estilo clásico, buen estado, varios compartimentos.",
    price: 550,
    imageSeed: "bolsa-mano",
  },
  {
    title: "Lote de ropa de niño 4-6 años",
    category: "MODA",
    description: "20 piezas entre playeras, pantalones y sudaderas.",
    price: 400,
    imageSeed: "ropa-nino-lote",
  },
  // OTRO
  {
    title: "Set de herramientas para taller",
    category: "OTRO",
    description: "Incluye llaves, desarmadores y caja organizadora.",
    price: 1800,
    imageSeed: "herramientas-set",
  },
  {
    title: "Guitarra acústica con estuche",
    category: "OTRO",
    description: "Buen estado, cuerdas nuevas, ideal para empezar a tocar.",
    price: 1600,
    imageSeed: "guitarra-acustica",
  },
  {
    title: "Libros usados de preparatoria",
    category: "OTRO",
    description: "Paquete completo de varias materias, buen estado.",
    price: 500,
    imageSeed: "libros-prepa",
  },
  {
    title: "Jaula grande para mascotas",
    category: "OTRO",
    description: "Metálica, plegable, ideal para perro mediano.",
    price: 750,
    imageSeed: "jaula-mascota",
  },
  {
    title: "Equipo de pesca completo",
    category: "OTRO",
    description: "Caña, carrete y caja de señuelos. Poco uso.",
    price: 1200,
    imageSeed: "equipo-pesca",
  },
];

function slugify(text: string, suffix: string) {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${suffix}`;
}

const CONTACT_NAMES = [
  "Laura M.", "José R.", "Ana P.", "Carlos G.", "Marisol T.",
  "Eduardo V.", "Diana L.", "Ricardo H.", "Fernanda S.", "Miguel A.",
];

function buildListings(): MarketplaceListing[] {
  const listings: MarketplaceListing[] = [];
  const totalTarget = 50;
  const now = Date.now();

  for (let i = 0; i < totalTarget; i++) {
    const template = TEMPLATES[i % TEMPLATES.length];
    const city = CITIES[i % CITIES.length];
    const contactName = CONTACT_NAMES[i % CONTACT_NAMES.length];
    // Un pequeño porcentaje se marca como vendido, para reflejar un
    // marketplace real (no todo lo publicado sigue disponible).
    const status = i % 12 === 0 ? "SOLD" : "ACTIVE";
    const suffix = `${city.toLowerCase().replace(/_/g, "-")}-${i + 1}`;
    const daysAgo = (i * 7) % 60;

    listings.push({
      id: `mkt_${i + 1}`,
      slug: slugify(template.title, suffix),
      title: template.title,
      description: template.description,
      price: template.price,
      category: template.category,
      status,
      city,
      imageUrl: `https://picsum.photos/seed/${template.imageSeed}-${i}/800/600`,
      contactName,
      contactPhone: `+52 1 ${656 + (i % 9)} ${100 + i} ${1000 + i}`,
      contactWhatsapp: i % 3 !== 0 ? `+52 1 ${656 + (i % 9)} ${100 + i} ${1000 + i}` : undefined,
      contactEmail: i % 4 === 0 ? `contacto${i + 1}@correo.com` : undefined,
      createdAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return listings;
}

export const MOCK_MARKETPLACE_LISTINGS: MarketplaceListing[] = buildListings();
