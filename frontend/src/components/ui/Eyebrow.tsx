import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Etiqueta de sección en Archivo uppercase, discreta y editorial. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft",
        className
      )}
    >
      {children}
    </span>
  );
}
