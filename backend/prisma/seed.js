import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function main() {
  for (const crossing of CROSSINGS) {
    await prisma.borderCrossing.upsert({
      where: { portNumber: crossing.portNumber },
      update: crossing,
      create: crossing,
    });
  }
  console.log(`Seed listo: ${CROSSINGS.length} garitas.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());