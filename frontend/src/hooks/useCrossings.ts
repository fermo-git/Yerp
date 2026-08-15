import { useQuery, useQueries } from "@tanstack/react-query";
import {
  getCrossings,
  getCurrentWaitTimes,
  getWaitTimeHistory,
  getWaitTimePattern,
} from "@/services/api/crossings";
import type { LaneType, WaitTime } from "@/types/crossing";
import { getCrossingById } from "@/services/api/crossings";

export function useCrossings(city?: string) {
  return useQuery({
    queryKey: ["crossings", city],
    queryFn: () => getCrossings(city ? { city } : undefined),
  });
}

export function useCurrentWaitTimes(crossingId?: string) {
  return useQuery({
    queryKey: ["wait-times", "current", crossingId],
    queryFn: () => getCurrentWaitTimes(crossingId!),
    enabled: !!crossingId,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useWaitTimeHistory(crossingId?: string, laneType?: LaneType, hours = 24) {
  return useQuery({
    queryKey: ["wait-times", "history", crossingId, laneType, hours],
    queryFn: () => getWaitTimeHistory(crossingId!, { laneType, hours }),
    enabled: !!crossingId,
  });
}

export function useWaitTimePattern(crossingId?: string, laneType?: LaneType) {
  return useQuery({
    queryKey: ["wait-times", "pattern", crossingId, laneType],
    queryFn: () => getWaitTimePattern(crossingId!, { laneType }),
    enabled: !!crossingId,
  });
}

/**
 * Trae el wait time actual de VARIAS garitas a la vez (todas las de una
 * ciudad), para poder comparar entre ellas y armar la recomendación.
 * Regresa un mapa crossingId -> WaitTime[].
 */
export function useCityWaitTimesSummary(crossingIds: string[]) {
  const results = useQueries({
    queries: crossingIds.map((id) => ({
      queryKey: ["wait-times", "current", id],
      queryFn: () => getCurrentWaitTimes(id),
      enabled: !!id,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const data: Record<string, WaitTime[]> = {};
  crossingIds.forEach((id, i) => {
    data[id] = results[i].data ?? [];
  });

  return { data, isLoading };
}

export function useCrossing(id?: string) {
  return useQuery({
    queryKey: ["crossing", id],
    queryFn: () => getCrossingById(id!),
    enabled: !!id,
  });
}