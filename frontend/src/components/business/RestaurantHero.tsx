import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Business } from "@/types/business";
import { CATEGORY_LABELS, PRICE_RANGE_LABELS } from "@/types/business";
import { Rating } from "@/components/ui/Rating";
import { OpenStatusBadge } from "@/components/business/OpenStatusBadge";
import { GalleryLightbox } from "@/components/business/GalleryLightbox";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface RestaurantHeroProps {
  restaurant: Business;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onWriteReview: () => void;
}

export function RestaurantHero({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onWriteReview,
}: RestaurantHeroProps) {
  const images = restaurant.gallery.length > 0 ? restaurant.gallery : [restaurant.coverImageUrl];
  const [main, ...rest] = images;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section>
      <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label="Ver foto principal"
          className="overflow-hidden rounded-2xl sm:col-span-2"
        >
          <img
            src={main}
            alt={restaurant.name}
            className="h-64 w-full object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-80"
          />
        </button>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
          {rest.slice(0, 2).map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i + 1)}
              aria-label={`Ver foto ${i + 2}`}
              className="overflow-hidden rounded-2xl"
            >
              <img
                src={url}
                alt=""
                className="h-32 w-full object-cover transition-transform duration-300 hover:scale-[1.02] sm:h-[156px]"
              />
            </button>
          ))}
        </div>

        {images.length > 3 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-soft transition-colors hover:bg-ink/5"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="m5 16 4-4 3 3 3-4 4 5" />
            </svg>
            Ver todas las fotos ({images.length})
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {restaurant.name}
          </h1>
          <div className="mt-2">
            <Rating value={restaurant.avgRating} reviewCount={restaurant.reviewCount} size="md" />
          </div>
          <p className="mt-1.5 text-sm text-ink-soft">
            {restaurant.priceRange ? PRICE_RANGE_LABELS[restaurant.priceRange] : ""}
            {restaurant.priceRange ? " · " : ""}
            {CATEGORY_LABELS[restaurant.category]}
          </p>
          <div className="mt-3">
            <OpenStatusBadge hours={restaurant.hours} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onWriteReview}>
            Escribir reseña
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onToggleFavorite}
            className={cn(isFavorite && "text-verde")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a5.4 5.4 0 0 1 9.8-3.1 5.4 5.4 0 0 1 7.8 3.1z" />
            </svg>
            {isFavorite ? "Guardado" : "Guardar"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
