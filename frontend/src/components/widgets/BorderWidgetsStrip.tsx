import { useBorderWidgets } from "@/hooks/useBusinesses";
import { Skeleton } from "@/components/ui/Skeleton";
import { CITY_LABELS } from "@/types/business";
import { cn } from "@/utils/cn";

function Cell({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl bg-asphalt-soft p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p
        className={cn(
          "mt-3 font-mono text-3xl font-semibold tabular-nums",
          accent ? "text-amber" : "text-white"
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-white/45">{sub}</p>}
    </div>
  );
}

export function BorderWidgetsStrip() {
  const { data, isLoading } = useBorderWidgets();

  return (
    <section className="container-frontera">
      <div className="rounded-2xl bg-asphalt p-6 text-white sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-amber" />
          </div>
          <span className="font-mono text-xs text-white/40">actualizado hace 5 min</span>
        </div>

        {isLoading || !data ? (
          <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-asphalt-soft p-5">
                <Skeleton className="h-3 w-24 bg-white/10" />
                <Skeleton className="mt-3 h-8 w-28 bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Cell
              label="Tipo de cambio"
              value={`$${data.exchangeRate.usdToMxn.toFixed(2)}`}
              sub="1 USD → MXN"
            />
            <Cell
              label={`Garita · ${CITY_LABELS[data.borderWait[0].city]}`}
              value={`${data.borderWait[0].waitMinutes} min`}
              sub={data.borderWait[0].crossingName}
              accent
            />
            <Cell
              label={`Clima · ${CITY_LABELS[data.weather.city]}`}
              value={`${data.weather.tempC}°C`}
              sub={data.weather.condition}
            />
            <Cell
              label="Gasolina regular"
              value={`$${data.gasPrice.regularPrice.toFixed(2)}`}
              sub="por litro"
            />
          </div>
        )}
      </div>
    </section>
  );
}
