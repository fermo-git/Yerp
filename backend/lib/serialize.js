import { prisma } from "./prisma.js";
import { getOpenStatus } from "./hours.js";

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

/** Negocio con la forma que espera el frontend (cover, galería, horarios, isOpen). */
export function serializeBusiness(b) {
  const cover = b.gallery?.[0]?.url ?? "";
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
    coverImageUrl: cover,
    gallery: (b.gallery ?? []).map((g) => g.url),
    featured: b.featured,
    avgRating: b.avgRating,
    reviewCount: b.reviewCount,
    phone: b.phone,
    whatsapp: b.whatsapp,
    email: b.email,
    website: b.website,
    menuUrl: b.menuUrl ?? null,
    hours: (b.hours ?? []).map((h) => ({
      dayOfWeek: h.dayOfWeek,
      opensAt: h.opensAt,
      closesAt: h.closesAt,
    })),
    openStatus: getOpenStatus(b.hours ?? [], b.city),
    createdAt: b.createdAt,
  };
}

/** Reseña con el autor embebido para pintar en el frontend. */
export function serializeReview(r) {
  return {
    id: r.id,
    businessId: r.businessId,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    user: {
      id: r.user.id,
      name: r.user.name,
      avatarUrl: r.user.avatarUrl,
    },
  };
}
