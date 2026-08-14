import { getOpenStatus, type OpenState } from "@/utils/hours";
import type { BusinessHours } from "@/types/business";
import { cn } from "@/utils/cn";

const toneStyles: Record<OpenState, string> = {
  OPEN: "bg-verde-tint text-verde-deep",
  CLOSING_SOON: "bg-amber-tint text-amber-deep",
  CLOSED: "bg-ink/5 text-ink/60",
};

const dotStyles: Record<OpenState, string> = {
  OPEN: "bg-verde",
  CLOSING_SOON: "bg-amber-deep",
  CLOSED: "bg-ink/30",
};

export function OpenStatusBadge({ hours }: { hours?: BusinessHours[] }) {
  const status = getOpenStatus(hours);

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
        toneStyles[status.state]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[status.state])} />
      {status.label}
    </span>
  );
}
