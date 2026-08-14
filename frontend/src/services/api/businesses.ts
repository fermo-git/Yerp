import type {
  Business,
  RecentActivityItem,
  BorderWidgetsSnapshot,
  CreateBusinessInput,
  CreateBusinessResponse,
  UploadGalleryResponse,
} from "@/types/business";
import { MOCK_BUSINESSES, MOCK_RECENT_ACTIVITY, MOCK_WIDGETS } from "@/services/mocks/businesses.mock";
import { apiClient, mockDelay } from "@/services/api/client";

// -----------------------------------------------------------------
// Capa de servicios "businesses".
// Contrato: mismas firmas que tendrá la versión real contra
// GET /businesses, /businesses/featured, etc. (ver API_ENDPOINTS.md).
// Para conectar el backend real, reemplazar el cuerpo de cada función
// por `apiClient.get(...)` — los hooks (hooks/useBusinesses.ts) y los
// componentes que los consumen no cambian.
// -----------------------------------------------------------------

export async function getFeaturedBusinesses(): Promise<Business[]> {
  await mockDelay();
  return MOCK_BUSINESSES.filter((b) => b.featured);
}

export async function getBusinesses(params?: {
  city?: string;
  category?: string;
  q?: string;
}): Promise<Business[]> {
  await mockDelay();
  let results = MOCK_BUSINESSES;
  if (params?.city) results = results.filter((b) => b.city === params.city);
  if (params?.category) results = results.filter((b) => b.category === params.category);
  if (params?.q) {
    const q = params.q.toLowerCase();
    results = results.filter(
      (b) => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function getBusinessBySlug(slug: string): Promise<Business | undefined> {
  await mockDelay();
  return MOCK_BUSINESSES.find((b) => b.slug === slug);
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
