// backend/services/patternAggregation.js
import { prisma } from "../lib/prisma.js";

export async function recalculatePatterns() {
  // Agrupa por garita, carril, día de la semana y hora
  const rows = await prisma.$queryRaw`
    SELECT
      "crossingId",
      "laneType",
      EXTRACT(DOW FROM "recordedAt")::int AS "dayOfWeek",
      EXTRACT(HOUR FROM "recordedAt")::int AS "hourOfDay",
      AVG("waitMinutes")::float AS "avgWaitMinutes",
      COUNT(*)::int AS "sampleCount"
    FROM "wait_times"
    GROUP BY "crossingId", "laneType", "dayOfWeek", "hourOfDay"
  `;

  const now = new Date();
  for (const row of rows) {
    await prisma.waitTimePattern.upsert({
      where: {
        crossingId_laneType_dayOfWeek_hourOfDay: {
          crossingId: row.crossingId,
          laneType: row.laneType,
          dayOfWeek: row.dayOfWeek,
          hourOfDay: row.hourOfDay,
        },
      },
      update: {
        avgWaitMinutes: row.avgWaitMinutes,
        sampleCount: row.sampleCount,
        lastCalculatedAt: now,
      },
      create: {
        crossingId: row.crossingId,
        laneType: row.laneType,
        dayOfWeek: row.dayOfWeek,
        hourOfDay: row.hourOfDay,
        avgWaitMinutes: row.avgWaitMinutes,
        sampleCount: row.sampleCount,
        lastCalculatedAt: now,
      },
    });
  }

  console.log(`[patternAggregation] ${rows.length} patrones recalculados.`);
  return rows.length;
}