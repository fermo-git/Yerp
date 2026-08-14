import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../lib/auth.js";

const MARKETPLACE_CATEGORIES = [
  "VEHICULOS",
  "INMUEBLES",
  "ELECTRONICA",
  "HOGAR_Y_JARDIN",
  "EMPLEO",
  "SERVICIOS",
  "MODA",
  "OTRO",
];

const MARKETPLACE_STATUSES = ["ACTIVE", "SOLD", "EXPIRED", "ARCHIVED"];

const router = Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const where = { status: "ACTIVE" };

    if (req.query.city) {
      where.city = req.query.city;
    }
    if (req.query.category && MARKETPLACE_CATEGORIES.includes(req.query.category)) {
      where.category = req.query.category;
    }
    if (req.query.q) {
      where.OR = [
        { title: { contains: req.query.q, mode: "insensitive" } },
        { description: { contains: req.query.q, mode: "insensitive" } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.marketplaceListing.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          seller: {
            select: { id: true, name: true, avatarUrl: true, city: true },
          },
        },
      }),
      prisma.marketplaceListing.count({ where }),
    ]);

    const serialized = listings.map((l) => ({
      id: l.id,
      sellerId: l.sellerId,
      title: l.title,
      slug: l.slug,
      description: l.description,
      price: l.price ? Number(l.price) : null,
      category: l.category,
      status: l.status,
      city: l.city,
      imageUrl: l.imageUrl,
      contactName: l.contactName,
      contactPhone: l.contactPhone,
      contactWhatsapp: l.contactWhatsapp,
      contactEmail: l.contactEmail,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      seller: l.seller,
    }));

    return res.json({
      data: {
        listings: serialized,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: req.params.id },
      include: {
        seller: {
          select: { id: true, name: true, avatarUrl: true, city: true },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Publicación no encontrada" },
      });
    }

    return res.json({
      data: {
        listing: {
          id: listing.id,
          sellerId: listing.sellerId,
          title: listing.title,
          slug: listing.slug,
          description: listing.description,
          price: listing.price ? Number(listing.price) : null,
          category: listing.category,
          status: listing.status,
          city: listing.city,
          imageUrl: listing.imageUrl,
          contactName: listing.contactName,
          contactPhone: listing.contactPhone,
          contactWhatsapp: listing.contactWhatsapp,
          contactEmail: listing.contactEmail,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          seller: listing.seller,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

const createSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(120),
  description: z.string().max(2000).nullable().optional(),
  price: z.number().min(0).nullable().optional(),
  category: z.enum(MARKETPLACE_CATEGORIES),
  city: z.string().min(2, "Elige tu ciudad"),
  imageUrl: z.string().url().nullable().optional(),
  contactName: z.string().max(100).nullable().optional(),
  contactPhone: z.string().max(20).nullable().optional(),
  contactWhatsapp: z.string().max(20).nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
});

router.post("/", authRequired, async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);

    let baseSlug = slugify(input.title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.marketplaceListing.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const listing = await prisma.marketplaceListing.create({
      data: {
        sellerId: req.userId,
        title: input.title,
        slug,
        description: input.description || null,
        price: input.price ?? null,
        category: input.category,
        city: input.city,
        imageUrl: input.imageUrl || null,
        contactName: input.contactName || null,
        contactPhone: input.contactPhone || null,
        contactWhatsapp: input.contactWhatsapp || null,
        contactEmail: input.contactEmail || null,
      },
      include: {
        seller: {
          select: { id: true, name: true, avatarUrl: true, city: true },
        },
      },
    });

    return res.status(201).json({
      data: {
        listing: {
          id: listing.id,
          sellerId: listing.sellerId,
          title: listing.title,
          slug: listing.slug,
          description: listing.description,
          price: listing.price ? Number(listing.price) : null,
          category: listing.category,
          status: listing.status,
          city: listing.city,
          imageUrl: listing.imageUrl,
          contactName: listing.contactName,
          contactPhone: listing.contactPhone,
          contactWhatsapp: listing.contactWhatsapp,
          contactEmail: listing.contactEmail,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          seller: listing.seller,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", authRequired, async (req, res, next) => {
  try {
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: req.params.id },
    });

    if (!listing) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Publicación no encontrada" },
      });
    }
    if (listing.sellerId !== req.userId) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "No puedes editar esta publicación" },
      });
    }

    const updateSchema = z.object({
      title: z.string().min(3).max(120).optional(),
      description: z.string().max(2000).nullable().optional(),
      price: z.number().min(0).nullable().optional(),
      category: z.enum(MARKETPLACE_CATEGORIES).optional(),
      city: z.string().min(2).optional(),
      imageUrl: z.string().url().nullable().optional(),
      contactName: z.string().max(100).nullable().optional(),
      contactPhone: z.string().max(20).nullable().optional(),
      contactWhatsapp: z.string().max(20).nullable().optional(),
      contactEmail: z.string().email().nullable().optional(),
      status: z.enum(MARKETPLACE_STATUSES).optional(),
    });

    const input = updateSchema.parse(req.body);
    const data = {};
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) data[key] = value;
    }

    const updated = await prisma.marketplaceListing.update({
      where: { id: req.params.id },
      data,
      include: {
        seller: {
          select: { id: true, name: true, avatarUrl: true, city: true },
        },
      },
    });

    return res.json({
      data: {
        listing: {
          id: updated.id,
          sellerId: updated.sellerId,
          title: updated.title,
          slug: updated.slug,
          description: updated.description,
          price: updated.price ? Number(updated.price) : null,
          category: updated.category,
          status: updated.status,
          city: updated.city,
          imageUrl: updated.imageUrl,
          contactName: updated.contactName,
          contactPhone: updated.contactPhone,
          contactWhatsapp: updated.contactWhatsapp,
          contactEmail: updated.contactEmail,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
          seller: updated.seller,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authRequired, async (req, res, next) => {
  try {
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: req.params.id },
    });

    if (!listing) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Publicación no encontrada" },
      });
    }
    if (listing.sellerId !== req.userId) {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "No puedes eliminar esta publicación" },
      });
    }

    await prisma.marketplaceListing.delete({ where: { id: req.params.id } });

    return res.json({ data: { ok: true } });
  } catch (err) {
    next(err);
  }
});

export default router;
