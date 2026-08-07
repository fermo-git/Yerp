import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clsx + tailwind-merge para componer clases de Tailwind sin colisiones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
