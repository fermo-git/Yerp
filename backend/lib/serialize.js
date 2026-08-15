import { prisma } from "./prisma.js";

/** Devuelve el usuario con la forma que espera el frontend (intereses como string[]). */
export async function serializeUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { interests: { select: { category: true } } },
  });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    city: user.city,
    role: user.role,
    isActive: user.isActive,
    favoriteCrossingId: user.favoriteCrossingId,
    interests: user.interests.map((i) => i.category),
    createdAt: user.createdAt,
  };
}
