import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getRestaurants, getRestaurantBySlug } from "@/services/api/restaurants";
import type { BorderCity, PriceRange, RestaurantFilters, RestaurantSort } from "@/types/business";

const DEFAULT_CITY: BorderCity = "TIJUANA";

export function useRestaurantFilters() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<RestaurantFilters>(() => {
    const rawCity = searchParams.get("ciudad");
    const city = (rawCity ?? user?.city ?? DEFAULT_CITY) as BorderCity;

    const rawRating = searchParams.get("rating");
    const rating = rawRating != null && rawRating !== "" ? Number(rawRating) : null;

    const rawPrice = searchParams.get("precio");
    const price = ((rawPrice ?? "").split(",").filter(Boolean) as PriceRange[]);

    const rawSort = searchParams.get("orden");
    const sort: RestaurantSort =
      rawSort === "POPULARIDAD" || rawSort === "MEJOR_VALORADOS" ? rawSort : "NOVEDADES";

    return {
      city,
      q: searchParams.get("q") ?? "",
      rating,
      price,
      favorites: searchParams.get("favoritos") === "1",
      sort,
    };
  }, [searchParams, user]);

  const setParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value == null || value === "") next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  return { filters, setParam };
}

export function useRestaurants(filters: RestaurantFilters) {
  const { city, q, rating, price, sort } = filters;

  return useQuery({
    queryKey: ["restaurants", "list", { city, q, rating, price, sort }],
    queryFn: () => getRestaurants(filters),
  });
}

export function useRestaurantBySlug(slug: string) {
  return useQuery({
    queryKey: ["restaurants", "detail", slug],
    queryFn: () => getRestaurantBySlug(slug),
    enabled: Boolean(slug),
  });
}
