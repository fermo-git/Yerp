import type {
  MarketplaceListing,
  MarketplaceQueryParams,
  PaginatedResult,
} from "@/types/marketplace";
import { MOCK_MARKETPLACE_LISTINGS } from "@/services/mocks/marketplace.mock";
import { mockDelay } from "@/services/api/client";

// -----------------------------------------------------------------
// Capa de servicios "marketplace".
// Contrato: misma forma que tendrá la versión real contra
// GET /marketplace (ver API_ENDPOINTS.md), incluyendo paginación
// (`?page=&limit=`, igual que el resto del contrato REST) y filtros
// por `city`, `category` y `q`. Para conectar el backend real, basta
// con reemplazar el cuerpo de cada función por `apiClient.get(...)`;
// hooks/useMarketplace.ts y los componentes que lo consumen no cambian.
// -----------------------------------------------------------------

const DEFAULT_LIMIT = 12;

export async function getMarketplaceListings(
  params?: MarketplaceQueryParams
): Promise<PaginatedResult<MarketplaceListing>> {
  await mockDelay();

  let results = MOCK_MARKETPLACE_LISTINGS.filter((l) => l.status !== "ARCHIVED" && l.status !== "EXPIRED");

  if (params?.city) results = results.filter((l) => l.city === params.city);
  if (params?.category) results = results.filter((l) => l.category === params.category);
  if (params?.q) {
    const q = params.q.toLowerCase();
    results = results.filter(
      (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
    );
  }

  switch (params?.sort) {
    case "PRECIO_ASC":
      results = [...results].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "PRECIO_DESC":
      results = [...results].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      break;
    case "RECIENTES":
    default:
      results = [...results].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const limit = params?.limit ?? DEFAULT_LIMIT;
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(params?.page ?? 1, 1), totalPages);
  const start = (page - 1) * limit;
  const items = results.slice(start, start + limit);

  return { items, total, page, totalPages };
}

export async function getMarketplaceListingBySlug(
  slug: string
): Promise<MarketplaceListing | undefined> {
  await mockDelay();
  return MOCK_MARKETPLACE_LISTINGS.find((l) => l.slug === slug);
}
