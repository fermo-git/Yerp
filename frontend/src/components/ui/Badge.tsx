import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "verde" | "amber" | "neutral";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  verde: "bg-verde-tint text-verde-deep",
  amber: "bg-amber-tint text-amber-deep",
  neutral: "bg-ink/5 text-ink/70",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
