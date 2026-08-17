import { CITY_OPTIONS } from "@/types/business";
import { MARKETPLACE_CATEGORY_OPTIONS } from "@/types/marketplace";

interface MarketplaceFiltersProps {
  city: string;
  category: string;
  query: string;
  onCityChange: (city: string) => void;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
}

export function MarketplaceFilters({
  city,
  category,
  query,
  onCityChange,
  onCategoryChange,
  onQueryChange,
}: MarketplaceFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar publicaciones..."
          className="w-full rounded-md border border-ink/10 bg-white py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20"
        />
      </div>

      <select
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        className="h-[46px] rounded-md border border-ink/10 bg-white px-3.5 text-sm font-medium text-ink focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20"
      >
        <option value="">Todas las ciudades</option>
        {CITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-[46px] rounded-md border border-ink/10 bg-white px-3.5 text-sm font-medium text-ink focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20"
      >
        <option value="">Todas las categorías</option>
        {MARKETPLACE_CATEGORY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
