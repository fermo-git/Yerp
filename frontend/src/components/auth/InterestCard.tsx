import { cn } from "@/utils/cn";
import { CATEGORY_LABELS, type BusinessCategory } from "@/types/business";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";

export function InterestCard({
  category,
  selected,
  onToggle,
}: {
  category: BusinessCategory;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
        selected
          ? "border-verde bg-verde-tint text-verde-deep"
          : "border-ink/10 bg-white text-ink hover:border-ink/25"
      )}
    >
      <span className={cn("shrink-0", selected ? "text-verde" : "text-ink-soft")}>
        {CATEGORY_ICONS[category]}
      </span>
      <span className="min-w-0 flex-1 truncate">{CATEGORY_LABELS[category]}</span>
      {selected && (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="shrink-0 text-verde"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}
