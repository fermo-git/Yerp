import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "cactus" | "terracota" | "frontera" | "neutral";
  className?: string;
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  cactus: "bg-cactus-light text-cactus-dark",
  terracota: "bg-terracota-light text-terracota",
  frontera: "bg-frontera-light text-frontera",
  neutral: "bg-carbon/5 text-carbon/70",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
