import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useRestaurants } from "@/hooks/useRestaurants";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { RestaurantFilters } from "@/components/restaurants/RestaurantFilters";
import { Pagination } from "@/components/marketplace/Pagination";
import { RestaurantCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BorderCity } from "@/types/business";
import type { RestaurantSort } from "@/types/restaurant";

const LIMIT = 9; // 3 columnas x 3 filas

export function RestaurantsPage() {
  // Mismo patrón que MarketplacePage: estado en la URL
  // (?q=&city=&minRating=&sort=&page=).
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const city = (searchParams.get("city") as BorderCity | null) ?? "";
  const minRating = Number(searchParams.get("minRating") ?? "0");
  const sort = (searchParams.get("sort") as RestaurantSort | null) ?? "RECIENTES";
  const page = Number(searchParams.get("page") ?? "1");

  const params = useMemo(
    () => ({
      q: q || undefined,
      city: city || undefined,
      minRating: minRating || undefined,
      sort,
      page,
      limit: LIMIT,
    }),
    [q, city, minRating, sort, page]
  );

  const { data, isLoading, isError } = useRestaurants(params);

  function updateParams(next: Record<string, string>) {
    const updated = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) updated.set(key, value);
      else updated.delete(key);
    });
    if (!("page" in next)) updated.delete("page");
    setSearchParams(updated);
  }

  return (
    <div className="container-frontera py-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold text-carbon sm:text-3xl">
          Restaurantes
        </h1>
        <p className="text-sm text-carbon/55">
          Calificaciones y reseñas de restaurantes en las ciudades fronterizas.
          Rating y reseñas provisionales mientras se conecta el backend.
        </p>
      </div>

      <div className="mt-6">
        <RestaurantFilters
          q={q}
          city={city}
          minRating={minRating}
          sort={sort}
          onQChange={(value) => updateParams({ q: value })}
          onCityChange={(value) => updateParams({ city: value })}
          onMinRatingChange={(value) => updateParams({ minRating: value ? String(value) : "" })}
          onSortChange={(value) => updateParams({ sort: value })}
        />
      </div>

      {!isLoading && data && (
        <p className="mt-6 text-sm text-carbon/50">
          {data.total} {data.total === 1 ? "restaurante encontrado" : "restaurantes encontrados"}
        </p>
      )}

      {/* 3 por fila (en vez de 4), imágenes más grandes que BusinessCard/MarketplaceCard. */}
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: LIMIT }).map((_, i) => <RestaurantCardSkeleton key={i} />)}

        {!isLoading && isError && (
          <div className="col-span-full">
            <EmptyState
              title="No pudimos cargar los restaurantes"
              description="Intenta de nuevo en unos segundos."
            />
          </div>
        )}

        {!isLoading && !isError && data?.items.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="No encontramos restaurantes con esos filtros"
              description="Prueba con otra ciudad, calificación mínima o palabra de búsqueda."
            />
          </div>
        )}

        {data?.items.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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
