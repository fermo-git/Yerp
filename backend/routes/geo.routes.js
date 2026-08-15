import { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router();

const NOMINATIM = "https://nominatim.openstreetmap.org";
const UA = "LaFrontera/1.0 (negocios@lafrontera.mx)";
const CITY_RADIUS_KM = 50;

const CITY_COORDS = {
  TIJUANA: { lat: 32.5149, lng: -117.0382 },
  MEXICALI: { lat: 32.6245, lng: -115.4523 },
  CIUDAD_JUAREZ: { lat: 31.6904, lng: -106.4245 },
  NUEVO_LAREDO: { lat: 27.5005, lng: -99.5074 },
  REYNOSA: { lat: 26.0833, lng: -98.2886 },
  MATAMOROS: { lat: 25.8796, lng: -97.5047 },
  NOGALES: { lat: 31.2933, lng: -110.9397 },
  PIEDRAS_NEGRAS: { lat: 28.7136, lng: -100.5339 },
  SAN_LUIS_RIO_COLORADO: { lat: 32.4719, lng: -114.7757 },
  AGUA_PRIETA: { lat: 31.3284, lng: -109.5669 },
};

function bboxAround(c, radiusKm) {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos((c.lat * Math.PI) / 180));
  return `${c.lng - lngDelta},${c.lat + latDelta},${c.lng + lngDelta},${c.lat - latDelta}`;
}

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_MAX = 200;

async function cachedFetch(url) {
  const hit = cache.get(url);
  if (hit && hit.exp > Date.now()) return hit.data;
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "es" } });
  if (!res.ok) return null;
  const data = await res.json();
  if (cache.size >= CACHE_MAX) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
  cache.set(url, { exp: Date.now() + CACHE_TTL, data });
  return data;
}

const geoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMIT", message: "Demasiadas búsquedas, intenta más tarde" } },
});

router.use(geoLimiter);

router.get("/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const city = String(req.query.city ?? "").trim();
  if (q.length < 3) {
    return res.json({ data: { results: [] } });
  }
  const coords = CITY_COORDS[city];
  const viewbox = coords
    ? `&viewbox=${encodeURIComponent(bboxAround(coords, CITY_RADIUS_KM))}&bounded=1`
    : "";
  const url =
    `${NOMINATIM}/search?format=jsonv2&limit=6&addressdetails=1&countrycodes=mx${viewbox}` +
    `&q=${encodeURIComponent(q)}`;
  const data = await cachedFetch(url);
  if (!data) {
    return res.status(502).json({ error: { code: "GEO_ERROR", message: "No se pudo buscar la dirección" } });
  }
  const results = data
    .map((d) => ({ lat: Number(d.lat), lng: Number(d.lon), displayName: d.display_name }))
    .filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lng));
  return res.json({ data: { results } });
});

router.get("/reverse", async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: { code: "INVALID", message: "Coordenadas inválidas" } });
  }
  const url = `${NOMINATIM}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`;
  const data = await cachedFetch(url);
  if (!data || !data.address) {
    return res.json({ data: { address: null } });
  }
  const a = data.address;
  const parts = [
    [a.house_number, a.road].filter(Boolean).join(" "),
    a.neighbourhood || a.suburb,
    a.city || a.town || a.village || a.municipality,
    a.state,
  ].filter(Boolean);
  return res.json({ data: { address: parts.join(", ") || null } });
});

export default router;