import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BorderCrossing, WaitTime } from "@/types/crossing";

interface CrossingMapProps {
  crossings: BorderCrossing[];
  waitTimesByCrossing: Record<string, WaitTime[]>;
  selectedCrossingId: string | null;
  onSelect: (id: string) => void;
}

function toneColor(minutes: number | null): string {
  if (minutes === null) return "#6b6b70"; // ink-soft
  if (minutes <= 20) return "#0f5c46"; // verde
  if (minutes <= 60) return "#e8a13c"; // amber
  return "#b3362b"; // alto, crítico
}

function buildIcon(color: string, selected: boolean) {
  const size = selected ? 22 : 15;
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 ${
      selected ? 4 : 2
    }px ${selected ? color + "55" : "rgba(0,0,0,0.15)"};transition:all .2s;"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FitBounds({ crossings }: { crossings: BorderCrossing[] }) {
  const map = useMap();
  useEffect(() => {
    const coords = crossings
      .filter((c) => c.latitude != null && c.longitude != null)
      .map((c) => [c.latitude as number, c.longitude as number] as [number, number]);
    if (coords.length === 0) return;
    if (coords.length === 1) map.setView(coords[0], 13);
    else map.fitBounds(coords, { padding: [32, 32] });
  }, [crossings, map]);
  return null;
}

export function CrossingMap({
  crossings,
  waitTimesByCrossing,
  selectedCrossingId,
  onSelect,
}: CrossingMapProps) {
  const withCoords = useMemo(
    () => crossings.filter((c) => c.latitude != null && c.longitude != null),
    [crossings]
  );

  if (withCoords.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10">
      <MapContainer
        center={[withCoords[0].latitude as number, withCoords[0].longitude as number]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds crossings={withCoords} />
        {withCoords.map((crossing) => {
          const waitTimes = waitTimesByCrossing[crossing.id] ?? [];
          const best = waitTimes.length > 0 ? Math.min(...waitTimes.map((w) => w.waitMinutes)) : null;
          return (
            <Marker
              key={crossing.id}
              position={[crossing.latitude as number, crossing.longitude as number]}
              icon={buildIcon(toneColor(best), crossing.id === selectedCrossingId)}
              eventHandlers={{ click: () => onSelect(crossing.id) }}
            >
              <Popup>
                <span className="font-medium">{crossing.name}</span>
                {best !== null && (
                  <>
                    <br />
                    {best} min de espera
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}