import { Link } from "react-router-dom";
import type { Business } from "@/types/business";
import { CATEGORY_LABELS, CITY_LABELS, PRICE_RANGE_LABELS } from "@/types/business";
import { Rating } from "@/components/ui/Rating";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <Link to={`/negocios/${business.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink/5">
        <img
          src={business.coverImageUrl}
          alt={business.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
          {business.featured
            ? "Favorito en La Frontera"
            : business.priceRange
              ? PRICE_RANGE_LABELS[business.priceRange]
              : CATEGORY_LABELS[business.category]}
        </span>
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
