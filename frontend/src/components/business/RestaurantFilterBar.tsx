import type {
  BorderCity,
  PriceRange,
  RestaurantFilters,
  RestaurantSort,
} from "@/types/business";
import { CITY_OPTIONS, PRICE_RANGE_LABELS } from "@/types/business";
import { Select, type SelectOption } from "@/components/ui/Select";
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

const STAR_PATH =
  "M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z";

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const isHalf = value % 1 !== 0 && i === Math.ceil(value);
        if (i <= value) {
          return (
            <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-deep">
              <path d={STAR_PATH} />
            </svg>
          );
        }
        if (isHalf) {
          return (
            <span key={i} className="relative inline-block h-3.5 w-3.5">
              <svg viewBox="0 0 20 20" className="absolute inset-0 h-full w-full fill-ink/15">
                <path d={STAR_PATH} />
              </svg>
              <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-deep">
                  <path d={STAR_PATH} />
                </svg>
              </span>
            </span>
          );
        }
        return (
          <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-ink/15">
            <path d={STAR_PATH} />
          </svg>
        );
      })}
    </span>
  );
}

function StarLabel({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1.5">
      <Stars value={value} />
      <span className="text-ink-soft">y más</span>
    </span>
  );
}

const RATING_OPTIONS: SelectOption[] = [
  { value: "", label: "Cualquier rating" },
  { value: "3", label: <StarLabel value={3} /> },
  { value: "4", label: <StarLabel value={4} /> },
  { value: "4.5", label: <StarLabel value={4.5} /> },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "NOVEDADES", label: "Novedades" },
  { value: "POPULARIDAD", label: "Popularidad" },
  { value: "MEJOR_VALORADOS", label: "Mejor valorados" },
];

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

function SortIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-ink-soft"
    >
      <path d="M8 9l4-4 4 4" />
      <path d="M8 15l4 4 4-4" />
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
  const cityOptions: SelectOption[] = CITY_OPTIONS.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.city ?? ""}
        options={cityOptions}
        onChange={(v) => onCityChange(v as BorderCity)}
        icon={<PinIcon />}
        ariaLabel="Ubicación"
      />

      <Select
        value={filters.rating == null ? "" : String(filters.rating)}
        options={RATING_OPTIONS}
        onChange={(v) => onRatingChange(v === "" ? null : Number(v))}
        ariaLabel="Rating"
      />

      <div className="flex items-center gap-1.5">
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
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            filters.favorites
              ? "border-verde bg-verde-tint text-verde-deep"
              : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink"
          )}
        >
          <HeartIcon filled={filters.favorites} />
          Solo favoritos
        </button>
      )}

      <div className="ml-auto">
        <Select
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(v) => onSortChange(v as RestaurantSort)}
          icon={<SortIcon />}
          align="right"
          ariaLabel="Ordenar"
        />
      </div>
    </div>
  );
}
