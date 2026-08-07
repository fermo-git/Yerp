import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Business } from "@/types/business";
import { CATEGORY_LABELS, CITY_LABELS, PRICE_RANGE_LABELS } from "@/types/business";
import { Rating } from "@/components/ui/Rating";

export function BusinessCard({ business }: { business: Business }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/negocios/${business.slug}`} className="group flex flex-col gap-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-carbon/5">
          <img
            src={business.coverImageUrl}
            alt={business.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            type="button"
            aria-label="Guardar en favoritos"
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-carbon shadow-soft transition-colors hover:text-terracota"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a5.4 5.4 0 0 1 9.8-3.1 5.4 5.4 0 0 1 7.8 3.1z" />
            </svg>
          </button>
          {business.priceRange && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-carbon shadow-soft">
              {PRICE_RANGE_LABELS[business.priceRange]}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[15px] font-semibold leading-snug text-carbon">
              {business.name}
            </h3>
          </div>
          <p className="text-sm text-carbon/55">
            {CATEGORY_LABELS[business.category]} · {CITY_LABELS[business.city]}
          </p>
          <Rating value={business.avgRating} reviewCount={business.reviewCount} />
        </div>
      </Link>
    </motion.div>
  );
}
