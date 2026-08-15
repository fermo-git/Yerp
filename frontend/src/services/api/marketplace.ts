import type {
  CreateListingInput,
  MarketplaceFilters,
  MarketplaceListing,
  MarketplaceListingsResponse,
} from "@/types/marketplace";
import { apiClient } from "./client";

function buildQuery(filters?: MarketplaceFilters): string {
  const params = new URLSearchParams();
  if (filters?.city) params.set("city", filters.city);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.q) params.set("q", filters.q);
  if (filters?.page) params.set("page", String(filters.page));
  params.set("limit", "20");
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getMarketplaceListings(
  filters?: MarketplaceFilters
): Promise<MarketplaceListingsResponse> {
  return apiClient.get<MarketplaceListingsResponse>(
    `/marketplace${buildQuery(filters)}`
  );
}

export async function getMarketplaceListing(id: string): Promise<MarketplaceListing> {
  const { listing } = await apiClient.get<{ listing: MarketplaceListing }>(
    `/marketplace/${id}`
  );
  return listing;
}

export async function createMarketplaceListing(
  input: CreateListingInput
): Promise<MarketplaceListing> {
  const { listing } = await apiClient.post<{ listing: MarketplaceListing }>(
    "/marketplace",
    input
  );
  return listing;
}
