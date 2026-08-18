import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authRequired, requireRole } from "../lib/auth.js";
import { serializeBusiness } from "../lib/serialize.js";

const router = Router();

// Todas las rutas de admin requieren sesión y rol ADMIN (verificado en BD).
router.use(authRequired, requireRole("ADMIN"));

const BUSINESS_CATEGORIES = [
  "RESTAURANTE",
  "CAFETERIA",
  "BAR",
  "TIENDA",
  "SALUD",
  "BELLEZA",
  "SERVICIOS_PROFESIONALES",
  "ENTRETENIMIENTO",
  "HOTEL",
  "AUTOMOTRIZ",
  "EDUCACION",
  "OTRO",
];

const BUSINESS_STATUSES = ["ACTIVE", "ARCHIVED"];

/** Forma compacta para la tabla de negocios del admin (incluye dueño). */
function serializeAdminBusiness(b) {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    category: b.category,
    status: b.status,
    featured: b.featured,
    city: b.city,
    avgRating: b.avgRating,
    reviewCount: b.reviewCount,
    coverImageUrl: b.gallery?.[0]?.url ?? "",
    createdAt: b.createdAt,
    owner: b.owner
      ? { id: b.owner.id, name: b.owner.name, email: b.owner.email }
      : null,
  };
}

/** Forma de una reseña para moderación (autor + negocio). */
function serializeAdminReview(r) {
  return {
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    user: r.user
      ? { id: r.user.id, name: r.user.name, avatarUrl: r.user.avatarUrl }
      : null,
    business: r.business
      ? { id: r.business.id, slug: r.business.slug, name: r.business.name }
      : null,
  };
}

// GET /admin/stats — KPIs + actividad reciente para el dashboard.
router.get("/stats", async (_req, res, next) => {
  try {
    const [users, businesses, reviews, marketplace] = await Promise.all([
      prisma.user.aggregate({ _count: { id: true } }),
      prisma.business.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.review.count(),
      prisma.marketplaceListing.count(),
    ]);

    const usersActive = await prisma.user.count({ where: { isActive: true } });
    const businessesByStatus = {
      ACTIVE: 0,
      PENDING: 0,
      ARCHIVED: 0,
    };
    businesses.forEach((g) => {
      businessesByStatus[g.status] = g._count.id;
    });

    const [recentBusinessesRaw, recentReviewsRaw, recentUsersRaw] = await Promise.all([
      prisma.business.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          gallery: { orderBy: { order: "asc" }, take: 1 },
          owner: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          business: { select: { id: true, slug: true, name: true } },
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          city: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
    ]);

    return res.json({
      data: {
        users: { total: users._count.id, active: usersActive },
        businesses: {
          total: businesses.reduce((acc, g) => acc + g._count.id, 0),
          ...businessesByStatus,
        },
        reviews: { total: reviews },
        marketplace: { total: marketplace },
        recentBusinesses: recentBusinessesRaw.map(serializeAdminBusiness),
        recentReviews: recentReviewsRaw.map(serializeAdminReview),
        recentUsers: recentUsersRaw,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /admin/businesses — todos los negocios (incluye archivados), con filtros.
router.get("/businesses", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.city) where.city = String(req.query.city);
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.status) where.status = String(req.query.status);
    if (req.query.q) {
      const q = String(req.query.q);
      where.OR = [{ name: { contains: q, mode: "insensitive" } }];
    }

    const businesses = await prisma.business.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        gallery: { orderBy: { order: "asc" }, take: 1 },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    return res.json({ data: businesses.map(serializeAdminBusiness) });
  } catch (err) {
    next(err);
  }
});

const businessPatchSchema = z
  .object({
    status: z.enum(BUSINESS_STATUSES),
    featured: z.boolean(),
  })
  .partial()
  .refine((v) => v.status !== undefined || v.featured !== undefined, {
    message: "No hay cambios que aplicar",
  });

// PATCH /admin/businesses/:id — cambiar estado (ACTIVE/ARCHIVED) y/o featured.
router.patch("/businesses/:id", async (req, res, next) => {
  try {
    const input = businessPatchSchema.parse(req.body);
    const business = await prisma.business.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });
    if (!business) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Negocio no encontrado" },
      });
    }
    const updated = await prisma.business.update({
      where: { id: business.id },
      data: input,
    });
    return res.json({
      data: {
        id: updated.id,
        status: updated.status,
        featured: updated.featured,
      },
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/businesses/:id — elimina el negocio (cascade).
router.delete("/businesses/:id", async (req, res, next) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });
    if (!business) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Negocio no encontrado" },
      });
    }
    await prisma.business.delete({ where: { id: business.id } });
    return res.json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
});

// GET /admin/reviews — reseñas para moderación, con filtros.
router.get("/reviews", async (req, res, next) => {
  try {
    const where = {};
    const rating = Number(req.query.rating);
    if (req.query.rating && !Number.isNaN(rating)) {
      where.rating = Number(rating);
    }
    if (req.query.q) {
      const q = String(req.query.q);
      where.OR = [
        { comment: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { business: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        business: { select: { id: true, slug: true, name: true } },
      },
    });

    return res.json({ data: reviews.map(serializeAdminReview) });
  } catch (err) {
    next(err);
  }
});

// DELETE /admin/reviews/:id — elimina la reseña y recalcula el rating del negocio.
router.delete("/reviews/:id", async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      select: { id: true, businessId: true },
    });
    if (!review) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Reseña no encontrada" },
      });
    }
    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: review.id } });
      const agg = await tx.review.aggregate({
        where: { businessId: review.businessId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.business.update({
        where: { id: review.businessId },
        data: {
          avgRating: agg._avg.rating ?? 0,
          reviewCount: agg._count.rating ?? 0,
        },
      });
    });
    return res.json({ data: { deleted: true } });
  } catch (err) {
    next(err);
  }
});

// GET /admin/users — usuarios con filtros y nº de negocios.
router.get("/users", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.role) where.role = String(req.query.role);
    if (req.query.city) where.city = String(req.query.city);
    if (req.query.q) {
      const q = String(req.query.q);
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { _count: { select: { businesses: true } } },
    });

    return res.json({
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatarUrl,
        phone: u.phone,
        city: u.city,
        role: u.role,
        isActive: u.isActive,
        businessCount: u._count.businesses,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

const userPatchSchema = z
  .object({
    role: z.enum(["USER", "BUSINESS_OWNER"]), // nunca ADMIN
    isActive: z.boolean(),
  })
  .partial()
  .refine((v) => v.role !== undefined || v.isActive !== undefined, {
    message: "No hay cambios que aplicar",
  });

// PATCH /admin/users/:id — cambiar rol (whitelist, nunca ADMIN) y/o activar.
router.patch("/users/:id", async (req, res, next) => {
  try {
    const input = userPatchSchema.parse(req.body);
    const target = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, role: true },
    });
    if (!target) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Usuario no encontrado" },
      });
    }
    if (input.role && target.role === "ADMIN") {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "No se puede cambiar el rol de un administrador" },
      });
    }
    const updated = await prisma.user.update({
      where: { id: target.id },
      data: input,
      select: { id: true, role: true, isActive: true },
    });
    return res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
