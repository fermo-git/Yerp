import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getRestaurants, getRestaurantBySlug } from "@/services/api/restaurants";
import type { RestaurantQueryParams } from "@/types/restaurant";

export function useRestaurants(params: RestaurantQueryParams) {
  return useQuery({
    queryKey: ["restaurants", "list", params],
    queryFn: () => getRestaurants(params),
    placeholderData: keepPreviousData,
  });
}

export function useRestaurantBySlug(slug: string) {
  return useQuery({
    queryKey: ["restaurants", "detail", slug],
    queryFn: () => getRestaurantBySlug(slug),
    enabled: Boolean(slug),
  });
}
