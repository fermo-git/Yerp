import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-ink/8", className)} aria-hidden="true" />;
}

export function BusinessCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  );
}

/** Skeleton específico para MarketplaceCard, mismas proporciones que la tarjeta real. */
export function MarketplaceCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  );
}

/** Skeleton específico para RestaurantCard: imagen más grande (3 por fila). */
export function RestaurantCardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton className="aspect-[16/11] w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-2/5" />
      </div>
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink/10 bg-white p-4">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-3.5 w-28" />
      </div>
      <Skeleton className="aspect-[16/10] w-full rounded-xl" />
      <Skeleton className="h-3.5 w-2/3" />
    </div>
  );
}
