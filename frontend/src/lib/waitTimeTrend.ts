import type { WaitTime, LaneType } from "@/types/crossing";

export type Trend = "up" | "down" | "stable";

const STABLE_THRESHOLD_MINUTES = 5;

/**
 * Agrupa el histórico por laneType y compara la última lectura contra
 * la penúltima para inferir tendencia. Requiere al menos 2 registros
 * por carril; si no hay suficiente historial, regresa "stable" por default.
 */
export function computeTrends(history: WaitTime[]): Partial<Record<LaneType, Trend>> {
  const byLane = new Map<LaneType, WaitTime[]>();

  for (const wt of history) {
    const list = byLane.get(wt.laneType) ?? [];
    list.push(wt);
    byLane.set(wt.laneType, list);
  }

  const trends: Partial<Record<LaneType, Trend>> = {};

  for (const [laneType, readings] of byLane.entries()) {
    const sorted = [...readings].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );
    if (sorted.length < 2) {
      trends[laneType] = "stable";
      continue;
    }
    const last = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    const diff = last.waitMinutes - prev.waitMinutes;

    if (diff >= STABLE_THRESHOLD_MINUTES) trends[laneType] = "up";
    else if (diff <= -STABLE_THRESHOLD_MINUTES) trends[laneType] = "down";
    else trends[laneType] = "stable";
  }

  return trends;
}