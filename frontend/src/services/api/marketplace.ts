import type {
  CreateListingInput,
  MarketplaceFilters,
  MarketplaceListing,
  MarketplaceListingsResponse,
  MarketplaceStatus,
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

export async function getMyMarketplaceListings(): Promise<MarketplaceListing[]> {
  const { listings } = await apiClient.get<{ listings: MarketplaceListing[] }>(
    "/marketplace/mine"
  );
  return listings;
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

export async function updateMarketplaceListingStatus(
  id: string,
  status: MarketplaceStatus
): Promise<MarketplaceListing> {
  const { listing } = await apiClient.patch<{ listing: MarketplaceListing }>(
    `/marketplace/${id}`,
    { status }
  );
  return listing;
}

export async function updateMarketplaceListing(
  id: string,
  input: Partial<CreateListingInput>
): Promise<MarketplaceListing> {
  const { listing } = await apiClient.patch<{ listing: MarketplaceListing }>(
    `/marketplace/${id}`,
    input
  );
  return listing;
}

export async function deleteMarketplaceListing(id: string): Promise<void> {
  await apiClient.delete<{ ok: true }>(`/marketplace/${id}`);
}

/**
 * Sube UNA imagen de publicación (multipart, campo "image") y devuelve la URL
 * pública. La URL se manda después en `imageUrl` al crear/editar el anuncio.
 */
export async function uploadMarketplaceImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file, file.name);
  const { url } = await apiClient.upload<{ url: string }>("/marketplace/images", form);
  return url;
}