import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../lib/auth.js";
import { serializeBusiness, serializeReview } from "../lib/serialize.js";

const router = Router();

const reviewSchema = z.object({
  rating: z.number().int().min(1, "El rating debe ser entre 1 y 5").max(5),
  comment: z.string().max(500, "Máximo 500 caracteres").optional().nullable(),
});

// GET /businesses — listado con filtros
router.get("/", async (req, res, next) => {
  try {
    const where = { status: "ACTIVE" };

    if (req.query.city) where.city = String(req.query.city);
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.priceRange) {
      where.priceRange = { in: String(req.query.priceRange).split(",") };
    }
    const minRating = Number(req.query.minRating);
    if (req.query.minRating && !Number.isNaN(minRating)) {
      where.avgRating = { gte: minRating };
    }
    if (req.query.q) {
      const q = String(req.query.q);
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const sort = String(req.query.sort ?? "NOVEDADES");
    const orderBy =
      sort === "POPULARIDAD"
        ? { reviewCount: "desc" }
        : sort === "MEJOR_VALORADOS"
          ? { avgRating: "desc" }
          : { createdAt: "desc" };

    const businesses = await prisma.business.findMany({
      where,
      orderBy,
      include: { gallery: { orderBy: { order: "asc" } }, hours: true },
    });

    return res.json({ data: businesses.map(serializeBusiness) });
  } catch (err) {
    next(err);
  }
});

// GET /businesses/:slug — detalle
router.get("/:slug", async (req, res, next) => {
  try {
    const business = await prisma.business.findUnique({
      where: { slug: req.params.slug },
      include: { gallery: { orderBy: { order: "asc" } }, hours: true },
    });

    if (!business) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Restaurante no encontrado" },
      });
    }

    return res.json({ data: serializeBusiness(business) });
  } catch (err) {
    next(err);
  }
});

// GET /businesses/:id/reviews
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { businessId: req.params.id },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    return res.json({ data: reviews.map(serializeReview) });
  } catch (err) {
    next(err);
  }
});

// POST /businesses/:id/reviews — crear reseña (auth)
router.post("/:id/reviews", authRequired, async (req, res, next) => {
  try {
    const { rating, comment } = reviewSchema.parse(req.body);

    const business = await prisma.business.findUnique({ where: { id: req.params.id } });
    if (!business) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Restaurante no encontrado" },
      });
    }

    const existing = await prisma.review.findUnique({
      where: { businessId_userId: { businessId: business.id, userId: req.userId } },
    });
    if (existing) {
      return res.status(409).json({
        error: { code: "ALREADY_REVIEWED", message: "Ya reseñaste este restaurante" },
      });
    }

    const review = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          businessId: business.id,
          userId: req.userId,
          rating,
          comment: comment || null,
        },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      });

      const agg = await tx.review.aggregate({
        where: { businessId: business.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await tx.business.update({
        where: { id: business.id },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewCount: agg._count.rating ?? 0,
        },
      });

      return created;
    });

    return res.status(201).json({ data: serializeReview(review) });
  } catch (err) {
    next(err);
  }
});

export default router;
