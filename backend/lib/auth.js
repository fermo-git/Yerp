import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";

export function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "No autenticado" },
    });
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token inválido o expirado" },
    });
  }
}

// Middleware de autorización por rol. Verifica SIEMPRE el rol en la base de
// datos (no confía en el JWT ni en el cliente) y responde 403 si no coincide.
// Uso: router.post("/x", authRequired, requireRole("BUSINESS_OWNER"), handler)
export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true, isActive: true },
      });
      if (!user || !user.isActive) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: "Sin permisos" },
        });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: "Tu cuenta no puede realizar esta acción" },
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
