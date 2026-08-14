import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Field, inputClassName } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { geoSearch, geoReverse, type GeoResult } from "@/services/api/geo";
import { CITY_LABELS, type BorderCity } from "@/types/business";

export interface LatLng {
  lat: number;
  lng: number;
}

const CITY_COORDS: Record<BorderCity, LatLng> = {
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

const COVERAGE_WARN_KM = 200;
const DEFAULT_CENTER: LatLng = { lat: 32.0, lng: -115.0 };

const pinIcon = L.divIcon({
  className: "lf-pin",
  html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#0f5c46" stroke="white" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.6" fill="white"/></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 30],
});

function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function nearestCityKm(p: LatLng): number {
  let min = Infinity;
  for (const c of Object.values(CITY_COORDS)) {
    const d = distanceKm(p, c);
    if (d < min) min = d;
  }
  return min;
}

export function MapPicker({
  addressValue,
  onAddressChange,
  location,
  onLocationChange,
  addressError,
  city,
}: {
  addressValue: string;
  onAddressChange: (v: string) => void;
  location: LatLng | null;
  onLocationChange: (v: LatLng | null) => void;
  addressError?: string;
  city?: BorderCity;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [query, setQuery] = useState(addressValue);
  const [status, setStatus] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const reverseAbort = useRef<AbortController | null>(null);

  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [activeSugg, setActiveSugg] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(addressValue);
  }, [addressValue]);

  async function reverseGeocode(lat: number, lng: number) {
    reverseAbort.current?.abort();
    const ac = new AbortController();
    reverseAbort.current = ac;
    try {
      const address = await geoReverse(lat, lng);
      if (address) onAddressChange(address);
    } catch {
      // silencioso
    }
  }

  function movePinTo(lat: number, lng: number, zoom?: number, skipReverse = false) {
    const marker = markerRef.current;
    const map = mapRef.current;
    if (!marker || !map) return;
    marker.setLatLng(L.latLng(lat, lng));
    onLocationChange({ lat, lng });
    if (!skipReverse) void reverseGeocode(lat, lng);
    if (typeof zoom === "number") map.setView(L.latLng(lat, lng), zoom);
    else map.panTo(L.latLng(lat, lng));
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const start = location ?? (city ? CITY_COORDS[city] : DEFAULT_CENTER);
    const map = L.map(containerRef.current, {
      center: L.latLng(start.lat, start.lng),
      zoom: city || location ? 13 : 5,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const marker = L.marker(L.latLng(start.lat, start.lng), {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const ll = marker.getLatLng();
      onLocationChange({ lat: ll.lat, lng: ll.lng });
      void reverseGeocode(ll.lat, ll.lng);
    });
    map.on("click", (e: L.LeafletMouseEvent) => movePinTo(e.latlng.lat, e.latlng.lng));

    const t1 = setTimeout(() => map.invalidateSize(), 200);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    const t3 = setTimeout(() => map.invalidateSize(), 1000);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      ro.disconnect();
      reverseAbort.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const marker = markerRef.current;
    const map = mapRef.current;
    if (!marker || !map || !location) return;
    const ll = L.latLng(location.lat, location.lng);
    const cur = marker.getLatLng();
    if (Math.abs(cur.lat - location.lat) > 1e-6 || Math.abs(cur.lng - location.lng) > 1e-6) {
      marker.setLatLng(ll);
      map.setView(ll, map.getZoom() < 13 ? 13 : map.getZoom());
    }
  }, [location]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !city || location) return;
    const c = CITY_COORDS[city];
    map.setView(L.latLng(c.lat, c.lng), 13);
    markerRef.current?.setLatLng(L.latLng(c.lat, c.lng));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setShowSugg(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await geoSearch(q, city);
        setSuggestions(results);
        setShowSugg(results.length > 0);
        setActiveSugg(-1);
      } catch {
        // silencioso
      }
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, city]);

  function pickSuggestion(s: GeoResult) {
    mapRef.current?.invalidateSize();
    const label = s.displayName.split(",").slice(0, 3).join(",");
    onAddressChange(label);
    setQuery(label);
    setShowSugg(false);
    setSuggestions([]);
    movePinTo(s.lat, s.lng, 15, true);
    setStatus(null);
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("Tu navegador no permite geolocalización.");
      return;
    }
    setGeoBusy(true);
    setStatus("Obteniendo tu ubicación...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        mapRef.current?.invalidateSize();
        movePinTo(lat, lng, 15);
        if (nearestCityKm({ lat, lng }) > COVERAGE_WARN_KM) {
          setWarn("Estás fuera de las ciudades frontera cubiertas; el pin quedó en tu ubicación.");
        } else {
          setWarn(null);
        }
        setStatus(null);
        setGeoBusy(false);
      },
      (err) => {
        const msgs: Record<number, string> = {
          1: "Permiso denegado. Habilita el acceso a tu ubicación en el navegador.",
          2: "Tu ubicación no está disponible ahora mismo. Intenta de nuevo.",
          3: "Tardó demasiado en obtener tu ubicación. Intenta de nuevo.",
        };
        setStatus(msgs[err.code] ?? "No se pudo obtener tu ubicación.");
        setGeoBusy(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  async function explicitSearch() {
    const q = query.trim();
    if (!q) return;
    if (q.length < 3) {
      setStatus("Escribe al menos 3 caracteres para buscar.");
      return;
    }
    setBusy(true);
    setStatus("Buscando dirección...");
    try {
      const results = await geoSearch(q, city);
      if (!results.length) {
        setStatus("No se encontró esa dirección. Prueba con otra forma o mueve el pin a mano.");
        return;
      }
      pickSuggestion(results[0]);
    } catch {
      setStatus("No se pudo buscar la dirección. Mueve el pin a mano.");
    } finally {
      setBusy(false);
    }
  }

  const busyAll = busy || geoBusy;

  return (
    <div className="flex flex-col gap-3">
      <Field label="Dirección" optional error={addressError}>
        <div className="relative">
          <div className="flex gap-2">
            <input
              className={cn(inputClassName, "flex-1")}
              placeholder={city ? `Buscar en ${CITY_LABELS[city]} (ej. Av. Reforma 512)` : "Escribe tu dirección o usa tu ubicación"}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSugg(true);
              }}
              onFocus={() => suggestions.length && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (showSugg && suggestions.length) {
                    const idx = activeSugg >= 0 ? activeSugg : 0;
                    pickSuggestion(suggestions[idx]);
                  } else {
                    void explicitSearch();
                  }
                } else if (e.key === "ArrowDown" && showSugg) {
                  e.preventDefault();
                  setActiveSugg((i) => Math.min(i + 1, suggestions.length - 1));
                } else if (e.key === "ArrowUp" && showSugg) {
                  e.preventDefault();
                  setActiveSugg((i) => Math.max(i - 1, 0));
                } else if (e.key === "Escape") {
                  setShowSugg(false);
                }
              }}
              aria-label="Buscar o escribir dirección"
              autoComplete="off"
            />
            <Button type="button" variant="outline" size="md" disabled={busyAll} onClick={() => void explicitSearch()}>
              Buscar
            </Button>
          </div>

          {showSugg && suggestions.length > 0 && (
            <ul className="absolute z-[1000] mt-1 max-h-52 w-full overflow-auto rounded-xl border border-ink/10 bg-white shadow-raised">
              {suggestions.map((s, i) => (
                <li key={`${s.lat},${s.lng},${i}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      pickSuggestion(s);
                    }}
                    className={cn(
                      "flex w-full items-start gap-2 px-3 py-2 text-left text-xs text-ink hover:bg-verde-tint/60",
                      i === activeSugg && "bg-verde-tint/60"
                    )}
                  >
                    <svg className="mt-0.5 shrink-0 text-verde-deep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeLinejoin="round" />
                      <circle cx="12" cy="9" r="2.4" fill="white" />
                    </svg>
                    <span className="line-clamp-2">{s.displayName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Field>

      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-2xl border border-ink/10 bg-ink/5"
        aria-label="Mapa para elegir ubicación"
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={useMyLocation} disabled={busyAll}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
          </svg>
          Usar mi ubicación
        </Button>
        <span className={cn("text-xs", location ? "text-ink-soft" : "text-amber-deep")}>
          {busyAll
            ? status ?? "..."
            : location
              ? `Pin: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
              : "Arrastra el pin, busca o usa tu ubicación"}
        </span>
      </div>
      {status && !busyAll && <p className="text-xs text-amber-deep">{status}</p>}
      {warn && <p className="text-xs text-amber-deep">{warn}</p>}
      <p className="text-[11px] text-ink-soft">
        Mueve el pin para ajustar la ubicación: la dirección se completa sola. La búsqueda cubre ciudades frontera de México.
      </p>
    </div>
  );
}