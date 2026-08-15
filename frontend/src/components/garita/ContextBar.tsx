import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-4 rounded-xl border border-verde/15 bg-gradient-to-br from-verde/[0.07] to-transparent p-5"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-verde/10"
        >
          {loading || !weather ? (
            <div className="h-6 w-6 animate-pulse rounded-full bg-ink/10" />
          ) : (
            <WeatherIcon condition={weather.condition} isDay={weather.isDay} className="h-6 w-6 text-verde" />
          )}
        </motion.div>
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-ink/40">Clima local</span>
          <span className="font-mono text-2xl font-bold text-ink">
            {loading || !weather ? "—" : `${Math.round(weather.tempC)}°C`}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="flex items-center gap-4 rounded-xl border border-verde/15 bg-gradient-to-br from-verde/[0.07] to-transparent p-5"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-verde/10">
          <DollarSign className="h-6 w-6 text-verde" strokeWidth={1.8} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-wide text-ink/40">USD → MXN</span>
          <span className="font-mono text-2xl font-bold text-ink">
            {loading || !exchangeRate ? "—" : `$${exchangeRate.usdToMxn.toFixed(2)}`}
          </span>
        </div>
      </motion.div>
    </div>
  );
}