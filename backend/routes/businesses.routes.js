import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { authRequired, requireRole } from "../lib/auth.js";
import { uniqueSlug } from "../lib/slug.js";
import {
  upload,
  validateAndSaveImage,
  menuUpload,
  validateAndSaveMenu,
  ImageValidationError,
  MAX_FILES,
} from "../lib/upload.js";
import { serializeBusiness, serializeReview } from "../lib/serialize.js";

const router = Router();

const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMIT", message: "Demasiadas solicitudes, intenta más tarde" } },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMIT", message: "Demasiadas subidas, intenta más tarde" } },
});

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

const PRICE_RANGES = ["ECONOMICO", "MODERADO", "ALTO", "PREMIUM"];

const PHONE_RE = /^[+]?[\d\s().-]{7,}$/;
const CONTROL_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f]/;
const HTML_RE = /[<>]/;

const noMarkup = (field) => field.refine((s) => !HTML_RE.test(s), "No se permite HTML");
const noControl = (field) => field.refine((s) => !CONTROL_RE.test(s), "Caracteres no válidos");

const optionalString = (schema) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    schema.optional()
  );

const optionalNumber = (min, max, label) =>
  z.preprocess(
    (v) => {
      if (v == null || v === "") return undefined;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : Number.NaN;
    },
    z
      .number({ invalid_type_error: `${label} inválida`, required_error: `${label} inválida` })
      .min(min, `${label} inválida`)
      .max(max, `${label} inválida`)
      .optional()
  );

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const hoursSchema = z
  .array(
    z
      .object({
        dayOfWeek: z.number({ invalid_type_error: "Día inválido" }).int().min(0, "Día inválido").max(6, "Día inválido"),
        opensAt: z.string().regex(TIME_RE, "Hora de apertura inválida"),
        closesAt: z.string().regex(TIME_RE, "Hora de cierre inválida"),
      })
      .refine((h) => h.closesAt > h.opensAt, "El cierre debe ser después de la apertura")
  )
  .max(7, "Máximo 7 días")
  .optional();

const createSchema = z.object({
  name: noMarkup(
    noControl(z.string().trim().min(2, "Escribe el nombre").max(80)).transform((s) => s.replace(/\s+/g, " "))
  ),
  description: noMarkup(
    noControl(z.string().trim().min(10, "Describe tu negocio (mínimo 10 caracteres)").max(1000)).transform(
      (s) => s.replace(/\s+/g, " ")
    )
  ),
  category: z.enum(BUSINESS_CATEGORIES),
  priceRange: optionalString(z.enum(PRICE_RANGES)),
  city: noControl(z.string().trim().min(2, "Elige una ciudad").max(80)),
  address: optionalString(noMarkup(noControl(z.string().trim().max(200)))),
  latitude: optionalNumber(-90, 90, "Latitud"),
  longitude: optionalNumber(-180, 180, "Longitud"),
  phone: optionalString(z.string().trim().regex(PHONE_RE, "Teléfono inválido").max(40)),
  whatsapp: optionalString(z.string().trim().regex(PHONE_RE, "WhatsApp inválido").max(40)),
  email: optionalString(z.string().trim().email("Correo inválido").max(120)),
  website: optionalString(
    z
      .string()
      .trim()
      .url("URL inválida")
      .max(200)
      .refine((u) => /^https?:\/\//i.test(u), "La URL debe iniciar con http:// o https://")
  ),
  hours: hoursSchema,
});

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

// POST /businesses — crea un negocio (solo BUSINESS_OWNER)
router.post("/", createLimiter, authRequired, requireRole("BUSINESS_OWNER"), async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const slug = await uniqueSlug(input.name);

    const business = await prisma.business.create({
      data: {
        ownerId: req.userId,
        name: input.name,
        slug,
        description: input.description,
        category: input.category,
        priceRange: input.priceRange ?? "MODERADO",
        city: input.city,
        address: input.address ?? null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        phone: input.phone ?? null,
        whatsapp: input.whatsapp ?? null,
        email: input.email ?? null,
        website: input.website ?? null,
        status: "ACTIVE",
        featured: false,
      },
    });

    if (input.hours?.length) {
      await prisma.businessHour.createMany({
        data: input.hours.map((h) => ({
          businessId: business.id,
          dayOfWeek: h.dayOfWeek,
          opensAt: h.opensAt,
          closesAt: h.closesAt,
        })),
      });
    }

    const full = await prisma.business.findUnique({
      where: { id: business.id },
      include: { gallery: { orderBy: { order: "asc" } }, hours: { orderBy: { dayOfWeek: "asc" } } },
    });

    return res.status(201).json({ data: { business: serializeBusiness(full) } });
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

// POST /businesses/:id/gallery — sube imágenes (máx 10). Solo el dueño.
router.post(
  "/:id/gallery",
  uploadLimiter,
  authRequired,
  upload.array("gallery", MAX_FILES),
  async (req, res, next) => {
    try {
      const business = await prisma.business.findUnique({
        where: { id: req.params.id },
        select: { id: true, ownerId: true },
      });
      if (!business) {
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Negocio no encontrado" },
        });
      }
      if (business.ownerId !== req.userId) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: "No puedes editar este negocio" },
        });
      }

      const files = Array.isArray(req.files) ? req.files : [];
      if (files.length === 0) {
        return res.status(400).json({
          error: { code: "NO_FILES", message: "Selecciona al menos una imagen" },
        });
      }

      const startOrder = await prisma.galleryImage.count({ where: { businessId: business.id } });

      const saved = [];
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        try {
          const { url } = await validateAndSaveImage(file);
          const image = await prisma.galleryImage.create({
            data: { businessId: business.id, url, order: startOrder + i },
          });
          saved.push({ id: image.id, url: image.url, order: image.order });
        } catch (err) {
          if (err instanceof ImageValidationError) {
            return res.status(400).json({
              error: { code: err.code, message: `${file.originalname}: ${err.message}` },
            });
          }
          throw err;
        }
      }

      return res.status(201).json({ data: { gallery: saved } });
    } catch (err) {
      next(err);
    }
  }
);

// POST /businesses/:id/menu — sube el menú (imagen o PDF). Solo el dueño.
router.post(
  "/:id/menu",
  uploadLimiter,
  authRequired,
  menuUpload.single("menu"),
  async (req, res, next) => {
    try {
      const business = await prisma.business.findUnique({
        where: { id: req.params.id },
        select: { id: true, ownerId: true },
      });
      if (!business) {
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Negocio no encontrado" },
        });
      }
      if (business.ownerId !== req.userId) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: "No puedes editar este negocio" },
        });
      }
      if (!req.file) {
        return res.status(400).json({
          error: { code: "NO_FILE", message: "Selecciona un archivo de menú" },
        });
      }
      let result;
      try {
        result = await validateAndSaveMenu(req.file);
      } catch (err) {
        if (err instanceof ImageValidationError) {
          return res.status(400).json({ error: { code: err.code, message: err.message } });
        }
        throw err;
      }
      await prisma.business.update({
        where: { id: business.id },
        data: { menuUrl: result.url },
      });
      return res.status(201).json({ data: { menuUrl: result.url, type: result.type } });
    } catch (err) {
      next(err);
    }
  }
);

// Manejador de errores de Multer (tamaño/nº/tipo de archivo) — exportado para
// integrarse al manejador de errores global en server.js.
export function isMulterError(err) {
  return err?.name === "MulterError" || err?.code === "LIMIT_UNEXPECTED_FILE";
}

export const multerMessages = {
  LIMIT_FILE_COUNT: `Máximo ${MAX_FILES} imágenes por subida`,
  LIMIT_UNEXPECTED_FILE: "Tipo de archivo no permitido",
};

export default router;
