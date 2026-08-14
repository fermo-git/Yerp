import type { Business, RestaurantFilters } from "@/types/business";
import { MOCK_RESTAURANTS } from "@/services/mocks/restaurants.mock";
import { mockDelay } from "@/services/api/client";

export async function getRestaurants(filters: RestaurantFilters): Promise<Business[]> {
  await mockDelay();

  let results = [...MOCK_RESTAURANTS];

  if (filters.city) {
    results = results.filter((r) => r.city === filters.city);
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    results = results.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }

  if (filters.rating != null) {
    results = results.filter((r) => r.avgRating >= filters.rating!);
  }

  if (filters.price.length > 0) {
    results = results.filter((r) => r.priceRange != null && filters.price.includes(r.priceRange));
  }

  switch (filters.sort) {
    case "POPULARIDAD":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "MEJOR_VALORADOS":
      results.sort((a, b) => b.avgRating - a.avgRating);
      break;
    case "NOVEDADES":
    default:
      results.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
  }

  return results;
}

export async function getRestaurantBySlug(slug: string): Promise<Business | undefined> {
  await mockDelay();
  return MOCK_RESTAURANTS.find((r) => r.slug === slug);
}
