import { cn } from "@/utils/cn";

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({ value, reviewCount, size = "sm", className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4", i < Math.round(value) ? "fill-amber-deep" : "fill-ink/10")}
          >
            <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
          </svg>
        ))}
      </span>
      <span className={cn("font-medium text-ink", size === "sm" ? "text-xs" : "text-sm")}>
        {value.toFixed(1)}
      </span>
      {typeof reviewCount === "number" && (
        <span className={cn("text-ink/50", size === "sm" ? "text-xs" : "text-sm")}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
