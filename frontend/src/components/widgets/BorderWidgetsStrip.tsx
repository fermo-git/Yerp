import { Link } from "react-router-dom";
import { DollarSign, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCrossing, useCrossings, useCurrentWaitTimes } from "@/hooks/useCrossings";
import { useWeather, useExchangeRate } from "@/hooks/useContextData";
import { WeatherIcon } from "@/components/garita/WeatherIcon";
import { Skeleton } from "@/components/ui/Skeleton";

const LANE_LABELS: Record<string, string> = {
  GENERAL: "General",
  SENTRI: "SENTRI",
  READY_LANE: "Ready Lane",
  PEATONAL: "Peatonal",
};

function CellShell({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-asphalt-soft p-5 sm:p-6">{children}</div>;
}

function CellLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
      {icon}
      {text}
    </p>
  );
}

export function BorderWidgetsStrip() {
  const { user } = useAuth();

  const fallbackCity = user?.city ?? "TIJUANA";
  const { data: favoriteCrossing } = useCrossing(user?.favoriteCrossingId ?? undefined);
  const { data: fallbackCrossings } = useCrossings(fallbackCity);

  const crossing = favoriteCrossing ?? fallbackCrossings?.[0] ?? null;

  const { data: waitTimes, isLoading: loadingWait } = useCurrentWaitTimes(crossing?.id);
  const { data: weather, isLoading: loadingWeather } = useWeather(
    crossing?.latitude,
    crossing?.longitude
  );
  const { data: exchangeRate, isLoading: loadingRate } = useExchangeRate();

  const topLanes = (waitTimes ?? [])
    .filter((lane) => lane.status !== "CLOSED")
    .sort((a, b) => a.waitMinutes - b.waitMinutes)
    .slice(0, 2);

  const isLoading = !crossing || loadingWait;

  return (
    <section className="container-frontera">
      <Link to="/garitas" className="block">
        <div className="rounded-2xl bg-asphalt p-6 text-white transition-colors hover:bg-asphalt/95 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-amber" />
              <span className="font-mono text-xs text-white/40">
                {crossing ? `${crossing.name} · ${user?.favoriteCrossingId === crossing.id ? "tu favorita" : "estatus en vivo"}` : "estatus en vivo"}
              </span>
            </div>
            <span className="font-mono text-xs text-white/40">ver garitas &rarr;</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* Garita: 2 carriles más rápidos */}
            <CellShell>
              <CellLabel icon={<MapPin className="h-3 w-3 text-verde" />} text="Garita" />
              {isLoading ? (
                <Skeleton className="mt-3 h-8 w-28 bg-white/10" />
              ) : topLanes.length > 0 ? (
                <div className="mt-3 flex flex-col gap-1.5">
                  {topLanes.map((lane) => (
                    <div key={lane.id} className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-2xl font-semibold tabular-nums text-white">
                        {lane.waitMinutes}
                        <span className="ml-1 text-sm text-white/50">min</span>
                      </span>
                      <span className="text-xs text-white/45">{LANE_LABELS[lane.laneType]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-white/45">Sin datos por ahora</p>
              )}
            </CellShell>

            {/* Clima */}
            <CellShell>
              <CellLabel icon={<WeatherIcon condition={weather?.condition ?? "Clear"} isDay className="h-3 w-3 text-verde" />} text="Clima local" />
              <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-white">
                {loadingWeather || !weather ? (
                  <Skeleton className="h-8 w-20 bg-white/10" />
                ) : (
                  `${Math.round(weather.tempC)}°C`
                )}
              </p>
              {weather && <p className="mt-1 text-xs text-white/45">{weather.condition}</p>}
            </CellShell>

            {/* Tipo de cambio */}
            <CellShell>
              <CellLabel icon={<DollarSign className="h-3 w-3 text-verde" />} text="Tipo de cambio" />
              <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-white">
                {loadingRate || !exchangeRate ? (
                  <Skeleton className="h-8 w-24 bg-white/10" />
                ) : (
                  `$${exchangeRate.usdToMxn.toFixed(2)}`
                )}
              </p>
              <p className="mt-1 text-xs text-white/45">1 USD → MXN</p>
            </CellShell>
          </div>
        </div>
      </Link>
    </section>
  );
}