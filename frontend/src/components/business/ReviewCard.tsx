import type { Review } from "@/types/business";
import { formatRelativeDate } from "@/utils/date";
import { cn } from "@/utils/cn";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center gap-3">
        {review.user.avatarUrl ? (
          <img
            src={review.user.avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-verde-tint text-sm font-bold text-verde-deep">
            {review.user.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">{review.user.name}</p>
          <p className="text-xs text-ink-soft">{formatRelativeDate(review.createdAt)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={cn("h-4 w-4", i < review.rating ? "fill-amber-deep" : "fill-ink/10")}
          >
            <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
          </svg>
        ))}
      </div>

      {review.comment && (
        <p className="mt-2.5 text-sm leading-relaxed text-ink">{review.comment}</p>
      )}
    </div>
  );
}
