import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { MarketplaceListing } from "@/types/marketplace";
import { MARKETPLACE_CATEGORY_LABELS } from "@/types/marketplace";
import { CITY_LABELS } from "@/types/business";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/Badge";

export function MarketplaceCard({ listing }: { listing: MarketplaceListing }) {
  const isSold = listing.status === "SOLD";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/marketplace/${listing.slug}`} className="group flex flex-col gap-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-carbon/5">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isSold ? "grayscale" : ""
            }`}
          />
          {isSold && (
            <span className="absolute left-3 top-3 rounded-full bg-carbon/80 px-2.5 py-1 text-xs font-medium text-white shadow-soft">
              Vendido
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-carbon shadow-soft">
            {formatCurrency(listing.price)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-display text-[15px] font-semibold leading-snug text-carbon">
            {listing.title}
          </h3>
          <p className="text-sm text-carbon/55">{CITY_LABELS[listing.city]}</p>
          <div>
            <Badge tone="frontera">{MARKETPLACE_CATEGORY_LABELS[listing.category]}</Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
