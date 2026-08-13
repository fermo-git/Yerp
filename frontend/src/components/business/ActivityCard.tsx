import { Link } from "react-router-dom";
import type { RecentActivityItem } from "@/types/business";
import { Rating } from "@/components/ui/Rating";

export function ActivityCard({ item }: { item: RecentActivityItem }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2.5">
        <img src={item.userAvatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
        <div className="leading-tight">
          <p className="text-sm font-medium text-ink">
            {item.userName}{" "}
            <span className="font-normal text-ink-soft">
              {item.action === "REVIEW" ? "escribió una reseña" : "agregó una foto"}
            </span>
          </p>
          <p className="text-xs text-ink-soft/80">{item.timeAgo}</p>
        </div>
      </div>

      <Link to={`/negocios/${item.business.slug}`} className="group">
        <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-ink/5">
          <img
            src={item.business.coverImageUrl}
            alt={item.business.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <Link
          to={`/negocios/${item.business.slug}`}
          className="font-display text-sm font-semibold text-ink hover:text-verde"
        >
          {item.business.name}
        </Link>
        <Rating value={item.business.avgRating} reviewCount={item.business.reviewCount} />
        {item.reviewComment && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{item.reviewComment}</p>
        )}
      </div>
    </div>
  );
}
