import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

const HEIGHTS = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
} as const;

/**
 * Wordmark oficial con el nuevo logotipo PNG.
 * No duplicar el asset en otros componentes.
 */
export function Wordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof HEIGHTS;
  className?: string;
}) {
  return (
    <Link to="/" className={cn("flex items-center", className)} aria-label="La Frontera — inicio">
      <img
        src="/logo-full.png"
        alt="La Frontera"
        className={cn("w-auto object-contain", HEIGHTS[size])}
      />
    </Link>
  );
}