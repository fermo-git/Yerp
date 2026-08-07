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
        "flex shrink-0 flex-col items-center gap-2 border-b-2 px-1 pb-3 pt-1 text-sm transition-colors",
        active
          ? "border-carbon text-carbon"
          : "border-transparent text-carbon/50 hover:text-carbon/80"
      )}
    >
      <span className={cn("flex h-6 w-6 items-center justify-center", active ? "text-cactus" : "text-carbon/50")}>
        {icon}
      </span>
      <span className="whitespace-nowrap font-medium">{label}</span>
    </button>
  );
}
