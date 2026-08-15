import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { authRequired, requireRole } from "../lib/auth.js";
import { uniqueSlug } from "../lib/slug.js";
import { upload, validateAndSaveImage, menuUpload, validateAndSaveMenu, ImageValidationError, MAX_FILES } from "../lib/upload.js";

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

async function serializeBusiness(businessId) {
  const b = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      gallery: { orderBy: { order: "asc" } },
      hours: { orderBy: { dayOfWeek: "asc" } },
    },
  });
  if (!b) return null;
  const gallery = b.gallery.map((g) => g.url);
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    description: b.description,
    category: b.category,
    priceRange: b.priceRange,
    city: b.city,
    address: b.address,
    latitude: b.latitude,
    longitude: b.longitude,
    phone: b.phone,
    whatsapp: b.whatsapp,
    email: b.email,
    website: b.website,
    menuUrl: b.menuUrl ?? null,
    hours: b.hours.map((h) => ({
      dayOfWeek: h.dayOfWeek,
      opensAt: h.opensAt,
      closesAt: h.closesAt,
    })),
    featured: b.featured,
    avgRating: b.avgRating,
    reviewCount: b.reviewCount,
    gallery,
    coverImageUrl: gallery[0] ?? null,
  };
}

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

    return res.status(201).json({ data: { business: await serializeBusiness(business.id) } });
  } catch (err) {
    next(err);
  }
});

// POST /businesses/:id/gallery — sube imágenes (máx 10, 16:9). Solo el dueño.
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
  LIMIT_FILE_SIZE: "Cada imagen debe pesar máximo 5 MB",
  LIMIT_FILE_COUNT: `Máximo ${MAX_FILES} imágenes por subida`,
  LIMIT_UNEXPECTED_FILE: "Tipo de archivo no permitido",
};

export default router;