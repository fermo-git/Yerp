import { useBorderWidgets } from "@/hooks/useBusinesses";
import { Skeleton } from "@/components/ui/Skeleton";
import { CITY_LABELS } from "@/types/business";

interface WidgetTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

function WidgetTile({ icon, label, value, sub }: WidgetTileProps) {
  return (
    <div className="flex min-w-[168px] shrink-0 flex-col gap-2 rounded-2xl border border-carbon/8 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2 text-carbon/50">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-frontera-light text-frontera">
          {icon}
        </span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-display text-xl font-semibold text-carbon">{value}</p>
      {sub && <p className="text-xs text-carbon/45">{sub}</p>}
    </div>
  );
}

function WidgetTileSkeleton() {
  return (
    <div className="flex min-w-[168px] shrink-0 flex-col gap-3 rounded-2xl border border-carbon/8 bg-white p-4">
      <Skeleton className="h-7 w-7 rounded-full" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function BorderWidgetsStrip() {
  const { data, isLoading } = useBorderWidgets();

  return (
    <section aria-label="Widgets de frontera" className="container-frontera">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-carbon">Estado de la frontera</h2>
        <span className="text-xs text-carbon/40">Actualizado hace unos minutos</span>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {isLoading || !data ? (
          Array.from({ length: 4 }).map((_, i) => <WidgetTileSkeleton key={i} />)
        ) : (
          <>
            <WidgetTile
              icon={<span className="text-sm font-bold">$</span>}
              label="Tipo de cambio"
              value={`$${data.exchangeRate.usdToMxn.toFixed(2)}`}
              sub="1 USD → MXN"
            />
            <WidgetTile
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              }
              label={`Garita ${CITY_LABELS[data.borderWait[0].city]}`}
              value={`${data.borderWait[0].waitMinutes} min`}
              sub={data.borderWait[0].crossingName}
            />
            <WidgetTile
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              }
              label={`Clima ${CITY_LABELS[data.weather.city]}`}
              value={`${data.weather.tempC}°C`}
              sub={data.weather.condition}
            />
            <WidgetTile
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 22h12M4 22V9l5-4 5 4v13M9 22V13h2v9" />
                </svg>
              }
              label="Gasolina regular"
              value={`$${data.gasPrice.regularPrice.toFixed(2)}`}
              sub={CITY_LABELS[data.gasPrice.city]}
            />
          </>
        )}
      </div>
    </section>
  );
}
