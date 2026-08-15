import { apiClient } from "@/services/api/client";

export interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geoSearch(q: string, city?: string): Promise<GeoResult[]> {
  const params = new URLSearchParams({ q });
  if (city) params.set("city", city);
  const { results } = await apiClient.get<{ results: GeoResult[] }>(
    `/geo/search?${params.toString()}`
  );
  return results;
}

export async function geoReverse(lat: number, lng: number): Promise<string | null> {
  const { address } = await apiClient.get<{ address: string | null }>(
    `/geo/reverse?lat=${lat}&lng=${lng}`
  );
  return address;
}