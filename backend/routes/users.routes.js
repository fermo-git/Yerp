import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../lib/auth.js";
import { serializeUser } from "../lib/serialize.js";
import { upload, validateAndSaveImage, ImageValidationError } from "../lib/upload.js";

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

const router = Router();
router.use(authRequired);

const avatarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "RATE_LIMIT", message: "Demasiadas subidas, intenta más tarde" } },
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().nullable().optional(),
  city: z.string().min(2).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  favoriteCrossingId: z.string().uuid().nullable().optional(),
});

router.patch("/me", async (req, res, next) => {
  try {
    const input = updateSchema.parse(req.body);
    const data = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.phone !== undefined) data.phone = input.phone;
    if (input.city !== undefined) data.city = input.city;
    if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;
    if (input.favoriteCrossingId !== undefined) {
    if (input.favoriteCrossingId !== null) {
      const exists = await prisma.borderCrossing.findUnique({
        where: { id: input.favoriteCrossingId },
      });
      if (!exists) {
        return res.status(400).json({
          error: { code: "VALIDATION_ERROR", message: "Garita favorita no válida" },
        });
      }
    }
    data.favoriteCrossingId = input.favoriteCrossingId;
  }
    await prisma.user.update({ where: { id: req.userId }, data });
    return res.json({ data: { user: await serializeUser(req.userId) } });
  } catch (err) {
    next(err);
  }
});

// POST /users/me/upgrade-to-owner — promueve USER → BUSINESS_OWNER.
// Endpoint de un solo propósito y sin body: no hay mass assignment posible
// y nunca permite asignar ADMIN desde el cliente. Si el usuario ya es dueño,
// responde el usuario sin cambios (idempotente).
router.post("/me/upgrade-to-owner", async (req, res, next) => {
  try {
    const current = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, role: true },
    });
    if (!current) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Usuario no encontrado" },
      });
    }
    if (current.role === "ADMIN") {
      return res.status(403).json({
        error: { code: "FORBIDDEN", message: "Tu cuenta no puede cambiar de rol" },
      });
    }
    if (current.role === "USER") {
      await prisma.user.update({
        where: { id: req.userId },
        data: { role: "BUSINESS_OWNER" },
      });
    }
    return res.json({ data: { user: await serializeUser(req.userId) } });
  } catch (err) {
    next(err);
  }
});

// POST /users/me/avatar — sube la foto de perfil (multipart, campo "avatar").
// Valida magic bytes + sharp y guarda con UUID en uploads/. Devuelve { url };
// el cliente persiste la URL con PATCH /users/me (avatarUrl). No escribe en BD.
router.post("/me/avatar", avatarLimiter, upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { code: "NO_FILE", message: "Selecciona una imagen" },
      });
    }
    let result;
    try {
      result = await validateAndSaveImage(req.file);
    } catch (err) {
      if (err instanceof ImageValidationError) {
        return res.status(400).json({
          error: { code: err.code, message: `${req.file.originalname}: ${err.message}` },
        });
      }
      throw err;
    }
    return res.status(201).json({ data: { url: result.url } });
  } catch (err) {
    next(err);
  }
});

const interestsSchema = z.object({
  categories: z.array(z.enum(BUSINESS_CATEGORIES)).max(20),
});

router.put("/me/interests", async (req, res, next) => {
  try {
    const { categories } = interestsSchema.parse(req.body);
    await prisma.userInterest.deleteMany({ where: { userId: req.userId } });
    if (categories.length > 0) {
      await prisma.userInterest.createMany({
        data: categories.map((category) => ({ userId: req.userId, category })),
        skipDuplicates: true,
      });
    }
    const user = await serializeUser(req.userId);
    return res.json({ data: { interests: user?.interests ?? [] } });
  } catch (err) {
    next(err);
  }
});

router.get("/me/interests", async (req, res, next) => {
  try {
    const user = await serializeUser(req.userId);
    return res.json({ data: { interests: user?.interests ?? [] } });
  } catch (err) {
    next(err);
  }
});

export default router;
