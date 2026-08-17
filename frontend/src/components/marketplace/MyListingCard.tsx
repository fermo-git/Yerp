import { Link } from "react-router-dom";
import type { MarketplaceListing, MarketplaceStatus } from "@/types/marketplace";
import {
  MARKETPLACE_CATEGORY_LABELS,
  MARKETPLACE_STATUS_LABELS,
} from "@/types/marketplace";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23eef4f1'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f5c46' font-family='sans-serif' font-size='14'%3ESin imagen%3C/text%3E%3C/svg%3E";

const STATUS_TONE: Record<MarketplaceStatus, "verde" | "amber" | "neutral"> = {
  ACTIVE: "verde",
  SOLD: "amber",
  EXPIRED: "neutral",
  ARCHIVED: "neutral",
};

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return "Sin precio";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface MyListingCardProps {
  listing: MarketplaceListing;
  onEdit: (listing: MarketplaceListing) => void;
  onMarkSold: (id: string) => void;
  isUpdating?: boolean;
}

export function MyListingCard({
  listing,
  onEdit,
  onMarkSold,
  isUpdating,
}: MyListingCardProps) {
  const isSoldOrArchived = listing.status !== "ACTIVE";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white sm:flex-row">
      <Link
        to={`/marketplace/${listing.id}`}
        className="relative block h-44 shrink-0 overflow-hidden bg-ink/5 sm:h-auto sm:w-48"
      >
        <img
          src={listing.imageUrl || PLACEHOLDER_IMG}
          alt={listing.title}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
            isSoldOrArchived ? "opacity-60 grayscale-[30%]" : ""
          }`}
        />
        <span className="absolute left-3 top-3">
          <Badge tone={STATUS_TONE[listing.status]}>
            {MARKETPLACE_STATUS_LABELS[listing.status]}
          </Badge>
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge tone="neutral" className="mb-2">
              {MARKETPLACE_CATEGORY_LABELS[listing.category]}
            </Badge>
            <Link to={`/marketplace/${listing.id}`}>
              <h3 className="truncate font-display text-base font-semibold text-ink hover:text-verde">
                {listing.title}
              </h3>
            </Link>
            <p className="mt-0.5 font-display text-lg font-bold text-verde">
              {formatPrice(listing.price)}
            </p>
          </div>
        </div>

        {listing.description && (
          <p className="text-sm leading-relaxed text-ink-soft line-clamp-2">
            {listing.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-3">
          <span className="text-xs text-ink/40">
            Publicada el {formatDate(listing.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(listing)}
            >
              Editar
            </Button>
            {listing.status === "ACTIVE" && (
              <Button
                variant="outline"
                size="sm"
                disabled={isUpdating}
                onClick={() => onMarkSold(listing.id)}
              >
                Marcar vendida
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}