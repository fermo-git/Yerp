import type { BusinessHours } from "@/types/business";
import { formatTime12h } from "@/utils/hours";
import { cn } from "@/utils/cn";

const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function formatDay(hours: BusinessHours[] | undefined, day: number): string {
  const entries = (hours ?? []).filter((h) => h.dayOfWeek === day);
  if (entries.length === 0) return "Cerrado";
  return entries
    .map((h) => `${formatTime12h(h.opensAt)} – ${formatTime12h(h.closesAt)}`)
    .join(" · ");
}

export function HoursTable({ hours }: { hours?: BusinessHours[] }) {
  const today = new Date().getDay();

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
      {DAY_LABELS.map((label, day) => {
        const active = day === today;
        return (
          <div
            key={day}
            className={cn(
              "flex items-center justify-between px-4 py-2.5 text-sm",
              active ? "bg-verde-tint" : "border-t border-ink/5 first:border-t-0"
            )}
          >
            <span className={cn("font-medium", active ? "text-verde-deep" : "text-ink")}>
              {label}
            </span>
            <span className={cn(active ? "text-verde-deep" : "text-ink-soft")}>
              {formatDay(hours, day)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
