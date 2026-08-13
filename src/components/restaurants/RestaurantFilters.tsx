import { CITY_LABELS, type BorderCity } from "@/types/business";
import { MIN_RATING_OPTIONS, RESTAURANT_SORT_LABELS, type RestaurantSort } from "@/types/restaurant";
import { cn } from "@/utils/cn";

interface RestaurantFiltersProps {
  q: string;
  city: BorderCity | "";
  minRating: number;
  sort: RestaurantSort;
  onQChange: (value: string) => void;
  onCityChange: (value: BorderCity | "") => void;
  onMinRatingChange: (value: number) => void;
  onSortChange: (value: RestaurantSort) => void;
}

const selectClassName =
  "rounded-full border border-carbon/15 bg-white px-4 py-2.5 text-sm font-medium text-carbon transition-colors hover:border-carbon/30 focus:outline-none focus-visible:outline-2 focus-visible:outline-frontera";

const CITY_ENTRIES = Object.entries(CITY_LABELS) as [BorderCity, string][];
const SORT_ENTRIES = Object.entries(RESTAURANT_SORT_LABELS) as [RestaurantSort, string][];

export function RestaurantFilters({
  q,
  city,
  minRating,
  sort,
  onQChange,
  onCityChange,
  onMinRatingChange,
  onSortChange,
}: RestaurantFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-carbon/40"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder="Buscar restaurantes…"
          aria-label="Buscar restaurantes"
          className="w-full rounded-full border border-carbon/15 bg-white py-3 pl-11 pr-4 text-sm text-carbon placeholder:text-carbon/40 focus:outline-none focus-visible:outline-2 focus-visible:outline-frontera"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value as BorderCity | "")}
          className={cn(selectClassName, city && "border-cactus text-cactus-dark")}
          aria-label="Filtrar por ciudad"
        >
          <option value="">Todas las ciudades</option>
          {CITY_ENTRIES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Filtro extra: estrellas mínimas, tipo Google Maps ("4.0+"). */}
        <select
          value={minRating}
          onChange={(e) => onMinRatingChange(Number(e.target.value))}
          className={cn(selectClassName, minRating > 0 && "border-cactus text-cactus-dark")}
          aria-label="Filtrar por calificación mínima"
        >
          {MIN_RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Filtro extra: orden, incluye "Novedades". */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as RestaurantSort)}
          className={cn(selectClassName, "ml-auto")}
          aria-label="Ordenar restaurantes"
        >
          {SORT_ENTRIES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
