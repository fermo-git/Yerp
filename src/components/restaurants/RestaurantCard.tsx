import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Restaurant } from "@/types/restaurant";
import { CITY_LABELS, PRICE_RANGE_LABELS } from "@/types/business";
import { Rating } from "@/components/ui/Rating";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/negocios/${restaurant.slug}`} className="group flex flex-col gap-3">
        {/* Imagen más grande que BusinessCard/MarketplaceCard: 3 por fila en vez de 4. */}
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-carbon/5">
          <img
            src={restaurant.coverImageUrl}
            alt={restaurant.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            type="button"
            aria-label="Guardar en favoritos"
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-carbon shadow-soft transition-colors hover:text-terracota"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a5.4 5.4 0 0 1 9.8-3.1 5.4 5.4 0 0 1 7.8 3.1z" />
            </svg>
          </button>
          {/* En lugar del precio: rating destacado sobre la imagen. */}
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-carbon shadow-soft">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-terracota">
              <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
            </svg>
            {restaurant.avgRating.toFixed(1)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug text-carbon">
              {restaurant.name}
            </h3>
          </div>

          <p className="text-sm text-carbon/55">
            {CITY_LABELS[restaurant.city]}
            {restaurant.priceRange && (
              <>
                {" · "}
                <span className="font-medium text-carbon/70">
                  {PRICE_RANGE_LABELS[restaurant.priceRange]}
                </span>
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <Rating value={restaurant.avgRating} />
            <span className="text-sm text-carbon/50">
              ({restaurant.reviewCount} {restaurant.reviewCount === 1 ? "reseña" : "reseñas"})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
