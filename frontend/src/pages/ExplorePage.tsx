import { useBusinesses } from "@/hooks/useBusinesses";
import { useExploreFilters } from "@/hooks/useExploreFilters";
import { SearchBar } from "@/components/search/SearchBar";
import { BusinessCard } from "@/components/business/BusinessCard";
import { FilterStrip, type FilterStripItem } from "@/components/business/FilterStrip";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { ALL_CATEGORIES_ICON, CATEGORY_ICONS } from "@/lib/categoryIcons";
import {
  BUSINESS_CATEGORIES,
  CATEGORY_LABELS,
  CITY_LABELS,
  type BorderCity,
  type BusinessSort,
} from "@/types/business";

const CATEGORY_ITEMS: FilterStripItem[] = [
  { value: "", label: "Todo", icon: ALL_CATEGORIES_ICON },
  ...BUSINESS_CATEGORIES.map((c) => ({
    value: c,
    label: CATEGORY_LABELS[c],
    icon: CATEGORY_ICONS[c],
  })),
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "NOVEDADES", label: "Novedades" },
  { value: "POPULARIDAD", label: "Popularidad" },
  { value: "MEJOR_VALORADOS", label: "Mejor valorados" },
];

export function ExplorePage() {
  const { filters, setParam, hasActiveFilters, clearFilters } = useExploreFilters();
  const { data, isLoading, isError, refetch, isFetching } = useBusinesses(filters);

  const title = filters.q.trim()
    ? `Resultados para «${filters.q.trim()}»`
    : filters.category
      ? CATEGORY_LABELS[filters.category]
      : "Explora negocios";

  const countLabel =
    data?.length === 1 ? "1 negocio encontrado" : `${data?.length ?? 0} negocios encontrados`;

  return (
    <div className="container-frontera py-10">
      <header className="max-w-2xl">
        <Eyebrow>Guía local</Eyebrow>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-ink-soft">
          {CITY_LABELS[filters.city as BorderCity]} — negocios, restaurantes y servicios cerca de ti.
        </p>
      </header>

      <div className="mt-8">
        <SearchBar
          variant="compact"
          city={filters.city as BorderCity}
          onCityChange={(city) => setParam("ciudad", city)}
          initialQuery={filters.q}
          onSubmit={(q, city) => {
            setParam("q", q || null);
            setParam("ciudad", city);
          }}
        />
      </div>

      <div className="mt-6">
        <FilterStrip
          items={CATEGORY_ITEMS}
          value={filters.category ?? ""}
          onChange={(v) => setParam("categoria", v || null)}
          ariaLabel="Categorías"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-sm text-ink-soft">
          {isFetching && !isLoading ? "Buscando…" : countLabel}
        </p>
        <div className="ml-auto">
          <Select
            value={filters.sort ?? "NOVEDADES"}
            options={SORT_OPTIONS}
            onChange={(v) => setParam("orden", v as BusinessSort)}
            align="right"
            ariaLabel="Ordenar"
          />
        </div>
      </div>

      <div className="mt-5">
        {isLoading && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <EmptyState
            title="No pudimos buscar ahora"
            description="Revisa tu conexión e inténtalo de nuevo."
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            }
          />
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <EmptyState
            title="Sin resultados"
            description="Prueba con otra palabra o quita los filtros para ver todo."
            action={
              hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  Quitar filtros
                </Button>
              ) : undefined
            }
          />
        )}

        {!isLoading && !isError && (data?.length ?? 0) > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {data?.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
