import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/utils/cn";

interface ReviewSummaryProps {
  total: number;
  avg: number;
  counts: number[]; // índice 0..4 = 1..5 estrellas
  selectedStar: number | null;
  onSelectStar: (star: number | null) => void;
}

function BigStars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn("h-6 w-6", i < Math.round(value) ? "fill-amber-deep" : "fill-ink/10")}
        >
          <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function StarGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-deep">
      <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
    </svg>
  );
}

export function ReviewSummary({ total, avg, counts, selectedStar, onSelectStar }: ReviewSummaryProps) {
  return (
    <div className="grid gap-8 rounded-2xl border border-ink/10 bg-white p-6 sm:grid-cols-2">
      <div>
        <Eyebrow>Calificación general</Eyebrow>
        <div className="mt-3 flex items-center gap-2.5">
          <BigStars value={avg} />
          <span className="text-sm font-semibold text-ink">{avg.toFixed(1)}</span>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          {total} {total === 1 ? "reseña" : "reseñas"}
        </p>
      </div>

      <div className="flex flex-col justify-center gap-2.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star - 1];
          const pct = total > 0 ? (count / total) * 100 : 0;
          const active = selectedStar === star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onSelectStar(active ? null : star)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors",
                active ? "bg-verde-tint" : "hover:bg-ink/5"
              )}
            >
              <span
                className={cn(
                  "flex w-12 shrink-0 items-center gap-1 text-sm",
                  active ? "font-semibold text-verde-deep" : "text-ink"
                )}
              >
                {star}
                <StarGlyph />
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                <span
                  className="block h-full rounded-full bg-amber-deep transition-all"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span
                className={cn(
                  "w-8 shrink-0 text-right text-sm",
                  active ? "font-semibold text-verde-deep" : "text-ink-soft"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
