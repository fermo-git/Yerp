import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurants, useRestaurantFilters } from "@/hooks/useRestaurants";
import { RestaurantSearchBar } from "@/components/business/RestaurantSearchBar";
import { RestaurantFilterBar } from "@/components/business/RestaurantFilterBar";
import { RestaurantGrid } from "@/components/business/RestaurantGrid";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { BorderCity, PriceRange, RestaurantSort } from "@/types/business";

export function RestaurantsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { filters, setParam } = useRestaurantFilters();
  const { data, isLoading, isError } = useRestaurants(filters);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  const toggleFavorite = (slug: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const displayed = useMemo(() => {
    let list = data ?? [];
    if (filters.favorites) list = list.filter((r) => favorites.has(r.slug));
    return list;
  }, [data, filters.favorites, favorites]);

  const countLabel =
    displayed.length === 1
      ? "1 restaurante encontrado"
      : `${displayed.length} restaurantes encontrados`;

  return (
    <div className="container-frontera py-10">
      <header className="max-w-2xl">
        <Eyebrow>Guía local</Eyebrow>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Restaurantes
        </h1>
        <p className="mt-3 text-ink-soft">
          Descubre y califica los mejores restaurantes de tu lado de la línea.
        </p>
      </header>

      <div className="mt-8 max-w-2xl">
        <RestaurantSearchBar value={filters.q} onChange={(q) => setParam("q", q || null)} />
      </div>

      <div className="mt-6">
        <RestaurantFilterBar
          filters={filters}
          isAuthenticated={Boolean(user)}
          onCityChange={(city: BorderCity) => setParam("ciudad", city)}
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
          favoriteSlugs={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}
