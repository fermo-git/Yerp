import { XMLParser } from "fast-xml-parser";
import { prisma } from "../lib/prisma.js";

const CBP_FEED_URL = "https://bwt.cbp.gov/xml/bwt.xml";

// Mapea la sección del XML de CBP a nuestro enum LaneType.
// Cada "lane group" (passenger_vehicle_lanes, pedestrian_lanes) trae
// varias sub-secciones según el tipo de carril disponible en ese puerto.
const LANE_MAP = {
  standard_lanes: "GENERAL",
  NEXUS_SENTRI_lanes: "SENTRI",
  ready_lanes: "READY_LANE",
};

function mapStatus(operationalStatus) {
  if (!operationalStatus) return "CLOSED";
  const s = String(operationalStatus).toLowerCase();
  if (s.includes("closed")) return "CLOSED";
  if (s.includes("delay")) return "DELAYED";
  return "OPEN";
}

function extractLaneReadings(laneGroup, laneTypeKey) {
  // laneGroup ya es el objeto de, ej., passenger_vehicle_lanes
  const readings = [];
  for (const [xmlKey, laneType] of Object.entries(LANE_MAP)) {
    const lane = laneGroup?.[xmlKey];
    if (!lane || lane.operational_status === "N/A") continue;

    const waitMinutes = Number(lane.delay_minutes ?? 0);
    const lanesOpen = lane.lanes_open != null ? Number(lane.lanes_open) : null;

    readings.push({
      laneType: laneTypeKey === "pedestrian" && laneType === "GENERAL" ? "PEATONAL" : laneType,
      waitMinutes: Number.isFinite(waitMinutes) ? waitMinutes : 0,
      lanesOpen,
      status: mapStatus(lane.operational_status),
    });
  }
  return readings;
}

export async function syncWaitTimesFromCBP() {
  const res = await fetch(CBP_FEED_URL);
  if (!res.ok) throw new Error(`CBP feed respondió ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser();
  const data = parser.parse(xml);

  const ports = data.border_wait_time.port;
  const portsArray = Array.isArray(ports) ? ports : [ports];

  // Traemos nuestras garitas y armamos un mapa portNumber -> id
  const crossings = await prisma.borderCrossing.findMany();
  const crossingByPort = new Map(crossings.map((c) => [c.portNumber, c]));

  const recordedAt = new Date(); // timestamp de esta corrida
  let inserted = 0;
  let skipped = 0;

  for (const port of portsArray) {
    const crossing = crossingByPort.get(String(port.port_number));
    if (!crossing) {
      skipped++;
      continue; // no es una garita que nos interese (o no está en nuestro seed)
    }

    const constructionNotice = cleanConstructionNotice(port.construction_notice);

    // Carriles de vehículo particular (pasajero)
    const passengerReadings = extractLaneReadings(port.passenger_vehicle_lanes, "passenger");
    // Carriles peatonales
    const pedestrianReadings = extractLaneReadings(port.pedestrian_lanes, "pedestrian");

    const allReadings = [...passengerReadings, ...pedestrianReadings];

    for (const reading of allReadings) {
      await prisma.waitTime.create({
        data: {
          crossingId: crossing.id,
          laneType: reading.laneType,
          waitMinutes: reading.waitMinutes,
          lanesOpen: reading.lanesOpen,
          status: reading.status,
          constructionNotice,
          recordedAt,
        },
      });
      inserted++;
    }
  }

  function cleanConstructionNotice(raw) {
  if (!raw) return null;
  let text = String(raw);

  // Quita el wrapper CDATA si el parser no lo despojó ya
  text = text.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");

  // Convierte [texto](url) en solo "texto" — no necesitamos el link crudo
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Quita cualquier tag HTML residual
  text = text.replace(/<[^>]+>/g, "");

  text = text.trim();
  return text.length > 0 ? text : null;
}

  console.log(`[cbpSync] ${inserted} registros insertados, ${skipped} puertos del feed ignorados (no están en nuestras garitas).`);
  return { inserted, skipped };
}