// Generación de slugs seguros únicos desde un texto.
// Quita acentos, baja a minúsculas, colapsa no-alfanuméricos a guiones.
import { prisma } from "./prisma.js";

export function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Garantiza un slug único contra la tabla indicada. Si existe, añade un
// sufijo corto aleatorio hasta 10 intentos.
export async function uniqueSlug(baseSlug, whereUnique) {
  const base = slugify(baseSlug) || "negocio";
  let candidate = base;
  for (let i = 0; i < 10; i += 1) {
    const exists = await prisma.business.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    const suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${base}-${suffix}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}