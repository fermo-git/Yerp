import { cn } from "@/utils/cn";

interface CategoryPillProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ label, icon, active, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 flex-col items-center gap-1.5 border-b-2 px-1 pb-3 pt-1 text-sm font-medium transition-colors",
        active
          ? "border-ink text-ink"
          : "border-transparent text-ink-soft hover:border-ink/25 hover:text-ink"
      )}
    >
      <span className={cn("transition-colors", active ? "text-verde" : "text-ink-soft")}>
        {icon}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
