import type {
  BorderCity,
  Business,
  BusinessQueryParams,
  RecentActivityItem,
  BorderWidgetsSnapshot,
  CreateBusinessInput,
  CreateBusinessResponse,
  UploadGalleryResponse,
} from "@/types/business";
import { MOCK_RECENT_ACTIVITY, MOCK_WIDGETS } from "@/services/mocks/businesses.mock";
import { apiClient, mockDelay } from "@/services/api/client";
import { toBusiness, type ApiBusiness } from "@/lib/businessAdapter";

// -----------------------------------------------------------------
// Capa de servicios "businesses".
// getBusinesses / getFeaturedBusinesses / getBusinessBySlug consumen la
// API real (GET /businesses). getRecentActivity y getBorderWidgets siguen
// leyendo mocks (sin endpoint real todavía).
// -----------------------------------------------------------------

function buildQuery(params?: BusinessQueryParams): string {
  const p = new URLSearchParams();
  if (!params) return "";
  if (params.city) p.set("city", params.city);
  if (params.category) p.set("category", params.category);
  if (params.q?.trim()) p.set("q", params.q.trim());
  if (params.minRating != null) p.set("minRating", String(params.minRating));
  if (params.priceRange?.length) p.set("priceRange", params.priceRange.join(","));
  if (params.sort) p.set("sort", params.sort);
  if (params.featured) p.set("featured", "true");
  if (params.limit != null) p.set("limit", String(params.limit));
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export async function getFeaturedBusinesses(city?: BorderCity): Promise<Business[]> {
  return getBusinesses({
    featured: true,
    sort: "MEJOR_VALORADOS",
    limit: 8,
    ...(city ? { city } : {}),
  });
}

export async function getBusinesses(params?: BusinessQueryParams): Promise<Business[]> {
  const raw = await apiClient.get<ApiBusiness[]>(`/businesses${buildQuery(params)}`);
  return raw.map(toBusiness);
}

export async function getBusinessBySlug(slug: string): Promise<Business> {
  const raw = await apiClient.get<ApiBusiness>(`/businesses/${slug}`);
  return toBusiness(raw);
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  await mockDelay();
  return MOCK_RECENT_ACTIVITY;
}

export async function getBorderWidgets(): Promise<BorderWidgetsSnapshot> {
  await mockDelay(300);
  return MOCK_WIDGETS;
}

// -----------------------------------------------------------------
// Endpoints reales (no mocks) para publicar un negocio y su galería.
// POST /businesses crea el negocio; POST /businesses/:id/gallery sube
// las imágenes (multipart/form-data, campo "gallery").
// -----------------------------------------------------------------

export async function createBusiness(
  input: CreateBusinessInput
): Promise<CreateBusinessResponse> {
  return apiClient.post<CreateBusinessResponse>("/businesses", input);
}

export async function uploadBusinessGallery(
  businessId: string,
  files: File[]
): Promise<UploadGalleryResponse> {
  const form = new FormData();
  files.forEach((file) => form.append("gallery", file, file.name));
  return apiClient.upload<UploadGalleryResponse>(
    `/businesses/${businessId}/gallery`,
    form
  );
}

export async function uploadBusinessMenu(
  businessId: string,
  file: File
): Promise<{ menuUrl: string; type: string }> {
  const form = new FormData();
  form.append("menu", file, file.name);
  return apiClient.upload<{ menuUrl: string; type: string }>(
    `/businesses/${businessId}/menu`,
    form
  );
}
