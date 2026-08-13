import { cn } from "@/utils/cn";

/** La "línea" de la frontera: hairline con una marca de cruce en el centro. */
export function RouteLine({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px w-full bg-ink/10", className)} aria-hidden="true">
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-verde bg-paper" />
    </div>
  );
}
