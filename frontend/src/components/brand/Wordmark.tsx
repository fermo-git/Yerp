import { Link } from "react-router-dom";
import { CrossingIcon } from "@/components/brand/Icons";
import { cn } from "@/utils/cn";

/**
 * Wordmark oficial: tile verde señal con el rombo de cruce + «LA FRONTERA»
 * en Archivo Expanded 800 uppercase. Única fuente del logo en toda la app —
 * no duplicar el SVG inline (ver DESIGN_GUIDE.md §2).
 */
const SIZES = {
  sm: { tile: "h-8 w-8 rounded-md", icon: "h-4 w-4", text: "text-sm" },
  md: { tile: "h-9 w-9 rounded-md", icon: "h-5 w-5", text: "text-[15px]" },
  lg: { tile: "h-10 w-10 rounded-md", icon: "h-5 w-5", text: "text-base" },
} as const;

export function Wordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="La Frontera — inicio">
      <span className={cn("flex items-center justify-center bg-verde text-white", s.tile)}>
        <CrossingIcon className={s.icon} />
      </span>
      <span
        className={cn(
          "font-display font-expanded font-extrabold uppercase tracking-wide text-ink",
          s.text
        )}
      >
        La Frontera
      </span>
    </Link>
  );
}
