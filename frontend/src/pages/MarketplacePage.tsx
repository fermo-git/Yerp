import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMarketplaceListings } from "@/hooks/useMarketplace";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { Pagination } from "@/components/marketplace/Pagination";
import { MarketplaceCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BorderCity } from "@/types/business";
import type { MarketplaceCategory, MarketplaceSort } from "@/types/marketplace";

const LIMIT = 12;

export function MarketplacePage() {
  // Estado en la URL (?city=&category=&q=&sort=&page=): permite compartir
  // o recargar un filtro específico, y refleja el mismo patrón de
  // querystring que usa el contrato REST (ver API_ENDPOINTS.md).
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const city = (searchParams.get("city") as BorderCity | null) ?? "";
  const category = (searchParams.get("category") as MarketplaceCategory | null) ?? "";
  const sort = (searchParams.get("sort") as MarketplaceSort | null) ?? "RECIENTES";
  const page = Number(searchParams.get("page") ?? "1");

  const params = useMemo(
    () => ({
      q: q || undefined,
      city: city || undefined,
      category: category || undefined,
      sort,
      page,
      limit: LIMIT,
    }),
    [q, city, category, sort, page]
  );

  const { data, isLoading, isError } = useMarketplaceListings(params);

  function updateParams(next: Record<string, string>) {
    const updated = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) updated.set(key, value);
      else updated.delete(key);
    });
    // Cualquier cambio de filtro regresa a la página 1.
    if (!("page" in next)) updated.delete("page");
    setSearchParams(updated);
  }

  return (
    <div className="container-frontera py-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold text-carbon sm:text-3xl">
          Marketplace local
        </h1>
        <p className="text-sm text-carbon/55">
          Publicaciones de la comunidad para revisar y contactar directo con quien vende.
          Aquí no se procesan pagos: solo te ayudamos a encontrar qué hay y dónde queda.
        </p>
      </div>

      <div className="mt-6">
        <MarketplaceFilters
          q={q}
          city={city}
          category={category}
          sort={sort}
          onQChange={(value) => updateParams({ q: value })}
          onCityChange={(value) => updateParams({ city: value })}
          onCategoryChange={(value) => updateParams({ category: value })}
          onSortChange={(value) => updateParams({ sort: value })}
        />
      </div>

      {!isLoading && data && (
        <p className="mt-6 text-sm text-carbon/50">
          {data.total} {data.total === 1 ? "publicación encontrada" : "publicaciones encontradas"}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: LIMIT }).map((_, i) => <MarketplaceCardSkeleton key={i} />)}

        {!isLoading && isError && (
          <div className="col-span-full">
            <EmptyState
              title="No pudimos cargar el marketplace"
              description="Intenta de nuevo en unos segundos."
            />
          </div>
        )}

        {!isLoading && !isError && data?.items.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="No encontramos publicaciones con esos filtros"
              description="Prueba con otra ciudad, categoría o palabra de búsqueda."
            />
          </div>
        )}

        {data?.items.map((listing) => (
          <MarketplaceCard key={listing.id} listing={listing} />
        ))}
      </div>

      {!isLoading && data && data.totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(nextPage) => {
              updateParams({ page: String(nextPage) });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}
