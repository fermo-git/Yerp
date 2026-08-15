import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET /crossings?city=TIJUANA
router.get("/", async (req, res, next) => {
  try {
    const { city } = req.query;
    const crossings = await prisma.borderCrossing.findMany({
      where: city ? { city: String(city) } : undefined,
      orderBy: { name: "asc" },
    });
    return res.json({ data: crossings });
  } catch (err) {
    next(err);
  }
});

// GET /crossings/:id — detalle de una garita
router.get("/:id", async (req, res, next) => {
  try {
    const crossing = await prisma.borderCrossing.findUnique({
      where: { id: req.params.id },
    });
    if (!crossing) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Garita no encontrada" } });
    }
    return res.json({ data: crossing });
  } catch (err) {
    next(err);
  }
});

// GET /crossings/:id/wait-times — último registro por cada laneType
router.get("/:id/wait-times", async (req, res, next) => {
  try {
    const waitTimes = await prisma.waitTime.findMany({
      where: { crossingId: req.params.id },
      orderBy: { recordedAt: "desc" },
      take: 20, // suficiente para cubrir los últimos registros de cada carril
    });

    // nos quedamos solo con el más reciente por laneType
    const latestByLane = {};
    for (const wt of waitTimes) {
      if (!latestByLane[wt.laneType]) latestByLane[wt.laneType] = wt;
    }

    return res.json({ data: Object.values(latestByLane) });
  } catch (err) {
    next(err);
  }
});

// GET /crossings/:id/wait-times/history?laneType=GENERAL&hours=24
router.get("/:id/wait-times/history", async (req, res, next) => {
  try {
    const { laneType, hours = 24 } = req.query;
    const since = new Date(Date.now() - Number(hours) * 60 * 60 * 1000);

    const history = await prisma.waitTime.findMany({
      where: {
        crossingId: req.params.id,
        ...(laneType ? { laneType: String(laneType) } : {}),
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: "asc" },
    });

    return res.json({ data: history });
  } catch (err) {
    next(err);
  }
});

// GET /crossings/:id/pattern?laneType=GENERAL — patrón semanal (24x7)
router.get("/:id/pattern", async (req, res, next) => {
  try {
    const { laneType } = req.query;
    const pattern = await prisma.waitTimePattern.findMany({
      where: {
        crossingId: req.params.id,
        ...(laneType ? { laneType: String(laneType) } : {}),
      },
      orderBy: [{ dayOfWeek: "asc" }, { hourOfDay: "asc" }],
    });
    return res.json({ data: pattern });
  } catch (err) {
    next(err);
  }
});

export default router;