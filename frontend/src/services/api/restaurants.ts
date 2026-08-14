import type { Business, RestaurantFilters } from "@/types/business";
import { apiClient } from "@/services/api/client";

export async function getRestaurants(filters: RestaurantFilters): Promise<Business[]> {
  const params = new URLSearchParams();
  params.set("category", "RESTAURANTE");
  if (filters.city) params.set("city", filters.city);
  if (filters.q) params.set("q", filters.q);
  if (filters.rating != null) params.set("minRating", String(filters.rating));
  if (filters.price.length > 0) params.set("priceRange", filters.price.join(","));
  params.set("sort", filters.sort);

  return apiClient.get<Business[]>(`/businesses?${params.toString()}`);
}

export async function getRestaurantBySlug(slug: string): Promise<Business> {
  return apiClient.get<Business>(`/businesses/${slug}`);
}
