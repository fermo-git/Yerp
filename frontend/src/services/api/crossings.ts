import type { BorderCrossing, WaitTime, WaitTimePattern, LaneType } from "@/types/crossing";
import { apiClient } from "@/services/api/client";

// -----------------------------------------------------------------
// Capa de servicios "crossings" (garitas).
// A diferencia de businesses.ts, esta sí pega directo al backend real
// desde el día uno — no hay mocks intermedios.
// -----------------------------------------------------------------

export async function getCrossings(params?: { city?: string }): Promise<BorderCrossing[]> {
  const query = params?.city ? `?city=${encodeURIComponent(params.city)}` : "";
  return apiClient.get<BorderCrossing[]>(`/crossings${query}`);
}

export async function getCrossingById(id: string): Promise<BorderCrossing> {
  return apiClient.get<BorderCrossing>(`/crossings/${id}`);
}

export async function getCurrentWaitTimes(crossingId: string): Promise<WaitTime[]> {
  return apiClient.get<WaitTime[]>(`/crossings/${crossingId}/wait-times`);
}

export async function getWaitTimeHistory(
  crossingId: string,
  params?: { laneType?: LaneType; hours?: number }
): Promise<WaitTime[]> {
  const search = new URLSearchParams();
  if (params?.laneType) search.set("laneType", params.laneType);
  if (params?.hours) search.set("hours", String(params.hours));
  const query = search.toString() ? `?${search.toString()}` : "";
  return apiClient.get<WaitTime[]>(`/crossings/${crossingId}/wait-times/history${query}`);
}

export async function getWaitTimePattern(
  crossingId: string,
  params?: { laneType?: LaneType }
): Promise<WaitTimePattern[]> {
  const query = params?.laneType ? `?laneType=${params.laneType}` : "";
  return apiClient.get<WaitTimePattern[]>(`/crossings/${crossingId}/pattern${query}`);
}