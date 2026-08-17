import { Link } from "react-router-dom";
import type { MarketplaceListing } from "@/types/marketplace";
import { MARKETPLACE_CATEGORY_LABELS } from "@/types/marketplace";
import { CITY_LABELS, type BorderCity } from "@/types/business";
import { Badge } from "@/components/ui/Badge";

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return "Sin precio";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Justo ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `Hace ${diffHr} h`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `Hace ${diffDays} d`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Hace ${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23eef4f1'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f5c46' font-family='sans-serif' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";

export function MarketplaceCard({ listing }: { listing: MarketplaceListing }) {
  const cityLabel =
    CITY_LABELS[listing.city as BorderCity] ?? listing.city;

  return (
    <Link to={`/marketplace/${listing.id}`} className="group block">
    <article className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        <img
          src={listing.imageUrl || PLACEHOLDER_IMG}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3">
          <Badge tone="verde">
            {MARKETPLACE_CATEGORY_LABELS[listing.category]}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] font-semibold leading-snug text-ink line-clamp-2 group-hover:text-verde">
            {listing.title}
          </h3>
        </div>

        <p className="font-display text-lg font-bold text-verde">
          {formatPrice(listing.price)}
        </p>

        {listing.description && (
          <p className="text-sm leading-relaxed text-ink-soft line-clamp-2">
            {listing.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-ink/10">
          <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-[10px] font-bold text-verde-deep">
            {listing.seller.avatarUrl ? (
              <img
                src={listing.seller.avatarUrl}
                alt={listing.seller.name}
                className="h-full w-full object-cover"
              />
            ) : (
              listing.seller.name.charAt(0).toUpperCase()
            )}
          </span>
          <span className="truncate text-xs text-ink-soft">
            {listing.seller.name}
          </span>
          <span className="ml-auto shrink-0 text-xs text-ink/40">
            {cityLabel} · {timeAgo(listing.createdAt)}
          </span>
        </div>
      </div>
    </article>
    </Link>
  );
}

export function MarketplaceCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-ink/8" />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-ink/8" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-ink/8" />
        <div className="h-3.5 w-full animate-pulse rounded bg-ink/8" />
        <div className="mt-2 flex items-center gap-2 border-t border-ink/10 pt-3">
          <div className="h-6 w-6 animate-pulse rounded-full bg-ink/8" />
          <div className="h-3 w-20 animate-pulse rounded bg-ink/8" />
        </div>
      </div>
    </div>
  );
}
