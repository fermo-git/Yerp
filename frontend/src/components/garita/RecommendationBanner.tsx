import { Lightbulb } from "lucide-react";
import type { BorderCrossing, WaitTime } from "@/types/crossing";

interface RecommendationBannerProps {
  crossings: BorderCrossing[];
  waitTimesByCrossing: Record<string, WaitTime[]>;
  selectedCrossingId: string | null;
  onSelect: (id: string) => void;
}

const MIN_MINUTES_TO_RECOMMEND = 10;

export function RecommendationBanner({
  crossings,
  waitTimesByCrossing,
  selectedCrossingId,
  onSelect,
}: RecommendationBannerProps) {
  if (crossings.length < 2) return null;

  // Para cada garita, su mejor (menor) tiempo de espera entre todos sus carriles
  const best = crossings
    .map((crossing) => {
      const waitTimes = (waitTimesByCrossing[crossing.id] ?? []).filter((wt) => wt.status !== "CLOSED");
      if (waitTimes.length === 0) return null;
      const min = waitTimes.reduce((a, b) => (a.waitMinutes <= b.waitMinutes ? a : b));
      return { crossing, waitTime: min };
    })
    .filter((x): x is { crossing: BorderCrossing; waitTime: WaitTime } => x !== null)
    .sort((a, b) => a.waitTime.waitMinutes - b.waitTime.waitMinutes);

  if (best.length < 2) return null;

  const fastest = best[0];
  const current = best.find((b) => b.crossing.id === selectedCrossingId);

  if (!current || fastest.crossing.id === current.crossing.id) return null;

  const savedMinutes = current.waitTime.waitMinutes - fastest.waitTime.waitMinutes;
  if (savedMinutes < MIN_MINUTES_TO_RECOMMEND) return null;

  return (
    <button
      onClick={() => onSelect(fastest.crossing.id)}
      className="flex w-full items-start gap-3 rounded-xl border border-ink/10 bg-verde-tint p-4 text-left transition-colors hover:bg-verde-tint/70"
    >
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-verde-deep" strokeWidth={1.7} />
      <p className="text-sm text-ink">
        <span className="font-semibold">Sugerencia:</span> hoy conviene cruzar por{" "}
        <span className="font-semibold">{fastest.crossing.name}</span>. Te ahorrarías
        aproximadamente <span className="font-semibold">{savedMinutes} min</span> comparado con{" "}
        {current.crossing.name}.
      </p>
    </button>
  );
}