import { Link } from "react-router-dom";
import type { Business } from "@/types/business";
import { CATEGORY_LABELS, CITY_LABELS, PRICE_RANGE_LABELS } from "@/types/business";
import { Rating } from "@/components/ui/Rating";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <Link to={`/negocios/${business.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5">
        <img
          src={business.coverImageUrl}
          alt={business.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-soft">
          {business.featured
            ? "Favorito en La Frontera"
            : business.priceRange
              ? PRICE_RANGE_LABELS[business.priceRange]
              : CATEGORY_LABELS[business.category]}
        </span>
        <button
          type="button"
          aria-label="Guardar en favoritos"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-soft transition-colors hover:text-verde"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a5.4 5.4 0 0 1 9.8-3.1 5.4 5.4 0 0 1 7.8 3.1z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-0.5 px-0.5">
        <h3 className="font-display text-[15px] font-semibold text-ink group-hover:text-verde">
          {business.name}
        </h3>
        <p className="text-sm text-ink-soft">
          {CITY_LABELS[business.city]} · {CATEGORY_LABELS[business.category]}
        </p>
        <Rating value={business.avgRating} reviewCount={business.reviewCount} className="mt-1" />
      </div>
    </Link>
  );
}
