import type {
  Restaurant,
  RestaurantQueryParams,
  PaginatedResult,
} from "@/types/restaurant";
import { MOCK_RESTAURANTS } from "@/services/mocks/restaurants.mock";
import { mockDelay } from "@/services/api/client";

// -----------------------------------------------------------------
// Capa de servicios "restaurants". Reutiliza el mismo negocio de
// GET /businesses (ver API_ENDPOINTS.md) filtrado a category=RESTAURANTE,
// más el filtro `minRating` y el sort `RATING_DESC`/`REVIEWS_DESC` que se
// resolverán en la query real cuando exista el backend. Por ahora todo
// (rating, reviews, "novedades") es provisional sobre datos mock.
// -----------------------------------------------------------------

const DEFAULT_LIMIT = 9;

export async function getRestaurants(
  params?: RestaurantQueryParams
): Promise<PaginatedResult<Restaurant>> {
  await mockDelay();

  let results = [...MOCK_RESTAURANTS];

  if (params?.city) results = results.filter((r) => r.city === params.city);
  if (params?.q) {
    const q = params.q.toLowerCase();
    results = results.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }
  if (params?.minRating) {
    results = results.filter((r) => r.avgRating >= params.minRating!);
  }

  switch (params?.sort) {
    case "RATING_DESC":
      results.sort((a, b) => b.avgRating - a.avgRating);
      break;
    case "REVIEWS_DESC":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "RECIENTES":
    default:
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const limit = params?.limit ?? DEFAULT_LIMIT;
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(params?.page ?? 1, 1), totalPages);
  const start = (page - 1) * limit;
  const items = results.slice(start, start + limit);

  return { items, total, page, totalPages };
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | undefined> {
  await mockDelay();
  return MOCK_RESTAURANTS.find((r) => r.slug === slug);
}
