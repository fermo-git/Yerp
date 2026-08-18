import type { Business } from "@/types/business";
import { apiClient } from "@/services/api/client";
import { toBusiness, type ApiBusiness } from "@/lib/businessAdapter";

export async function getMyFavorites(): Promise<Business[]> {
  const raw = await apiClient.get<ApiBusiness[]>("/users/me/favorites");
  return raw.map(toBusiness);
}

export function addFavorite(businessId: string): Promise<{ favorited: boolean }> {
  return apiClient.put<{ favorited: boolean }>(`/users/me/favorites/${businessId}`, {});
}

export function removeFavorite(businessId: string): Promise<{ favorited: boolean }> {
  return apiClient.delete<{ favorited: boolean }>(`/users/me/favorites/${businessId}`);
}
