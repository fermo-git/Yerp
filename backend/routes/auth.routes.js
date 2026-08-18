import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken, authRequired } from "../lib/auth.js";
import { serializeUser } from "../lib/serialize.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Escribe tu nombre"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  phone: z.string().optional(),
  city: z.string().min(2, "Elige tu ciudad"),
  // Whitelist estricta: el cliente solo puede elegir USER o BUSINESS_OWNER.
  // ADMIN jamás se asigna desde el registro (zod lo rechaza con 400).
  role: z.enum(["USER", "BUSINESS_OWNER"]).optional(),
});

router.post("/register", async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      return res.status(409).json({
        error: { code: "EMAIL_TAKEN", message: "Este correo ya está registrado" },
      });
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
        phone: input.phone || null,
        city: input.city,
        role: input.role ?? "USER",
      },
    });
    const accessToken = signToken(user.id);
    return res.status(201).json({
      data: { user: await serializeUser(user.id), accessToken },
    });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

router.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" },
      });
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" },
      });
    }
    const accessToken = signToken(user.id);
    return res.json({ data: { user: await serializeUser(user.id), accessToken } });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authRequired, async (req, res, next) => {
  try {
    const user = await serializeUser(req.userId);
    if (!user) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Usuario no encontrado" },
      });
    }
    return res.json({ data: { user } });
  } catch (err) {
    next(err);
  }
});

// Google OAuth — stub para una iteración futura.
router.post("/google", (_req, res) => {
  return res.status(501).json({
    error: { code: "NOT_IMPLEMENTED", message: "Google OAuth no implementado aún" },
  });
});

export default router;
