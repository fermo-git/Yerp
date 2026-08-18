import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurants, useRestaurantFilters } from "@/hooks/useRestaurants";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { SearchBar } from "@/components/search/SearchBar";
import { RestaurantFilterBar } from "@/components/business/RestaurantFilterBar";
import { RestaurantGrid } from "@/components/business/RestaurantGrid";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import type { BorderCity, PriceRange, RestaurantSort } from "@/types/business";

export function RestaurantsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { filters, setParam } = useRestaurantFilters();
  const { data, isLoading, isError } = useRestaurants(filters);
  const { data: myFavorites } = useFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const favoriteSlugs = useMemo(
    () => new Set((myFavorites ?? []).map((f) => f.slug)),
    [myFavorites]
  );

  const toggleFavorite = (slug: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const business = data?.find((b) => b.slug === slug);
    if (!business) return;
    toggleFavoriteMutation.mutate({ business, favorite: !favoriteSlugs.has(slug) });
  };

  const displayed = useMemo(() => {
    let list = data ?? [];
    if (filters.favorites) list = list.filter((r) => favoriteSlugs.has(r.slug));
    return list;
  }, [data, filters.favorites, favoriteSlugs]);

  const countLabel =
    displayed.length === 1
      ? "1 restaurante encontrado"
      : `${displayed.length} restaurantes encontrados`;

  return (
    <div className="container-frontera py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <Eyebrow>Guía local</Eyebrow>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Restaurantes
          </h1>
          <p className="mt-3 text-ink-soft">
            Descubre y califica los mejores restaurantes de tu lado de la línea.
          </p>
        </div>
        {user?.role === "BUSINESS_OWNER" && (
          <Button size="md" className="shrink-0" onClick={() => navigate("/negocios/nuevo")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Publicar restaurante
          </Button>
        )}
      </header>

      <div className="mt-8">
        <SearchBar
          variant="compact"
          city={filters.city ?? "TIJUANA"}
          onCityChange={(city: BorderCity) => setParam("ciudad", city)}
          initialQuery={filters.q}
          onSubmit={(q, city) => {
            setParam("q", q || null);
            setParam("ciudad", city);
          }}
        />
      </div>

      <div className="mt-6">
        <RestaurantFilterBar
          filters={filters}
          isAuthenticated={Boolean(user)}
          onRatingChange={(rating) => setParam("rating", rating == null ? null : String(rating))}
          onPriceToggle={(price: PriceRange) => {
            const current = filters.price;
            const next = current.includes(price)
              ? current.filter((p) => p !== price)
              : [...current, price];
            setParam("precio", next.length ? next.join(",") : null);
          }}
          onFavoritesChange={(value) => setParam("favoritos", value ? "1" : null)}
          onSortChange={(sort: RestaurantSort) => setParam("orden", sort)}
        />
      </div>

      <p className="mt-6 text-sm text-ink-soft">{countLabel}</p>

      <div className="mt-5">
        <RestaurantGrid
          restaurants={displayed}
          isLoading={isLoading}
          isError={isError}
          favoriteSlugs={favoriteSlugs}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}
