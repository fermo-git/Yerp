import { DollarSign } from "lucide-react";
import { WeatherIcon } from "@/components/garita/WeatherIcon";

interface ContextBarProps {
  weather: { tempC: number; condition: string; isDay: boolean } | null;
  exchangeRate: { usdToMxn: number } | null;
  loading?: boolean;
}

export function ContextBar({ weather, exchangeRate, loading }: ContextBarProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-verde-tint">
          {loading || !weather ? (
            <div className="h-6 w-6 animate-pulse rounded-full bg-ink/10" />
          ) : (
            <WeatherIcon condition={weather.condition} isDay={weather.isDay} className="h-6 w-6 text-verde" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">Clima local</span>
          <span className="font-mono text-2xl font-bold text-ink">
            {loading || !weather ? "—" : `${Math.round(weather.tempC)}°C`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-verde-tint">
          <DollarSign className="h-6 w-6 text-verde" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">USD → MXN</span>
          <span className="font-mono text-2xl font-bold text-ink">
            {loading || !exchangeRate ? "—" : `$${exchangeRate.usdToMxn.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
}