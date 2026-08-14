import type {
  BorderCity,
  PriceRange,
  RestaurantFilters,
  RestaurantSort,
} from "@/types/business";
import { CITY_OPTIONS, PRICE_RANGE_LABELS } from "@/types/business";
import { cn } from "@/utils/cn";

interface RestaurantFilterBarProps {
  filters: RestaurantFilters;
  isAuthenticated: boolean;
  onCityChange: (city: BorderCity) => void;
  onRatingChange: (rating: number | null) => void;
  onPriceToggle: (price: PriceRange) => void;
  onFavoritesChange: (value: boolean) => void;
  onSortChange: (sort: RestaurantSort) => void;
}

const RATING_OPTIONS = [
  { value: "", label: "Cualquier rating" },
  { value: "3", label: "3.0+" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

const SORT_OPTIONS: { value: RestaurantSort; label: string }[] = [
  { value: "NOVEDADES", label: "Novedades" },
  { value: "POPULARIDAD", label: "Popularidad" },
  { value: "MEJOR_VALORADOS", label: "Mejor valorados" },
];

const selectClassName =
  "appearance-none bg-transparent pr-1 text-sm font-medium text-ink focus:outline-none";

const pillClassName =
  "flex shrink-0 items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm";

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-verde"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-amber-deep">
      <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a5.4 5.4 0 0 1 9.8-3.1 5.4 5.4 0 0 1 7.8 3.1z" />
    </svg>
  );
}

export function RestaurantFilterBar({
  filters,
  isAuthenticated,
  onCityChange,
  onRatingChange,
  onPriceToggle,
  onFavoritesChange,
  onSortChange,
}: RestaurantFilterBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1">
        <label className={pillClassName}>
          <PinIcon />
          <select
            value={filters.city ?? ""}
            onChange={(e) => onCityChange(e.target.value as BorderCity)}
            aria-label="Ubicación"
            className={selectClassName}
          >
            {CITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className={pillClassName}>
          <StarIcon />
          <select
            value={filters.rating == null ? "" : String(filters.rating)}
            onChange={(e) =>
              onRatingChange(e.target.value === "" ? null : Number(e.target.value))
            }
            aria-label="Rating"
            className={selectClassName}
          >
            {RATING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex shrink-0 items-center gap-1.5">
          {(Object.keys(PRICE_RANGE_LABELS) as PriceRange[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPriceToggle(p)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filters.price.includes(p)
                  ? "border-verde bg-verde-tint text-verde-deep"
                  : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink"
              )}
            >
              {PRICE_RANGE_LABELS[p]}
            </button>
          ))}
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={() => onFavoritesChange(!filters.favorites)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              filters.favorites
                ? "border-verde bg-verde-tint text-verde-deep"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink"
            )}
          >
            <HeartIcon filled={filters.favorites} />
            Solo favoritos
          </button>
        )}
      </div>

      <label className={cn(pillClassName, "ml-auto")}>
        <span className="hidden text-ink-soft sm:inline">Ordenar por</span>
        <select
          value={filters.sort}
          onChange={(e) => onSortChange(e.target.value as RestaurantSort)}
          aria-label="Ordenar"
          className={cn(selectClassName, "font-semibold")}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
