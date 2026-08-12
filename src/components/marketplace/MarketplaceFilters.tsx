import { CITY_LABELS, type BorderCity } from "@/types/business";
import type { MarketplaceCategory, MarketplaceSort } from "@/types/marketplace";
import { MARKETPLACE_CATEGORY_LABELS } from "@/types/marketplace";
import { cn } from "@/utils/cn";

interface MarketplaceFiltersProps {
  q: string;
  city: BorderCity | "";
  category: MarketplaceCategory | "";
  sort: MarketplaceSort;
  onQChange: (value: string) => void;
  onCityChange: (value: BorderCity | "") => void;
  onCategoryChange: (value: MarketplaceCategory | "") => void;
  onSortChange: (value: MarketplaceSort) => void;
}

const selectClassName =
  "rounded-full border border-carbon/15 bg-white px-4 py-2.5 text-sm font-medium text-carbon transition-colors hover:border-carbon/30 focus:outline-none focus-visible:outline-2 focus-visible:outline-frontera";

const CATEGORY_ENTRIES = Object.entries(MARKETPLACE_CATEGORY_LABELS) as [
  MarketplaceCategory,
  string
][];

const CITY_ENTRIES = Object.entries(CITY_LABELS) as [BorderCity, string][];

export function MarketplaceFilters({
  q,
  city,
  category,
  sort,
  onQChange,
  onCityChange,
  onCategoryChange,
  onSortChange,
}: MarketplaceFiltersProps) {
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
          placeholder="Buscar en el marketplace…"
          aria-label="Buscar publicaciones"
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

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as MarketplaceCategory | "")}
          className={cn(selectClassName, category && "border-cactus text-cactus-dark")}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {CATEGORY_ENTRIES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as MarketplaceSort)}
          className={cn(selectClassName, "ml-auto")}
          aria-label="Ordenar publicaciones"
        >
          <option value="RECIENTES">Más recientes</option>
          <option value="PRECIO_ASC">Precio: menor a mayor</option>
          <option value="PRECIO_DESC">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  );
}
