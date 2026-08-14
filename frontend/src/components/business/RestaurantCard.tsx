import { Link } from "react-router-dom";
import type { Business } from "@/types/business";
import { PRICE_RANGE_LABELS } from "@/types/business";
import { Rating } from "@/components/ui/Rating";
import { OpenStatusBadge } from "@/components/business/OpenStatusBadge";
import { cn } from "@/utils/cn";

interface RestaurantCardProps {
  restaurant: Business;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
}

export function RestaurantCard({ restaurant, isFavorite, onToggleFavorite }: RestaurantCardProps) {
  return (
    <Link to={`/negocios/${restaurant.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5">
        <img
          src={restaurant.coverImageUrl}
          alt={restaurant.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow-soft">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-deep">
            <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
          </svg>
          {restaurant.avgRating.toFixed(1)}
        </span>
        <button
          type="button"
          aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(restaurant.slug);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-soft transition-colors hover:text-verde"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={cn(isFavorite && "text-verde")}
          >
            <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a5.4 5.4 0 0 1 9.8-3.1 5.4 5.4 0 0 1 7.8 3.1z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1 px-0.5">
        <h3 className="font-display text-[15px] font-semibold text-ink group-hover:text-verde">
          {restaurant.name}
        </h3>
        <p className="text-sm text-ink-soft">
          {restaurant.address}
          {restaurant.priceRange ? ` · ${PRICE_RANGE_LABELS[restaurant.priceRange]}` : ""}
        </p>
        <Rating value={restaurant.avgRating} reviewCount={restaurant.reviewCount} className="mt-0.5" />
        <OpenStatusBadge hours={restaurant.hours} />
      </div>
    </Link>
  );
}
