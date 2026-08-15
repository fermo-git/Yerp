import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authRequired } from "../lib/auth.js";
import { serializeUser } from "../lib/serialize.js";

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
