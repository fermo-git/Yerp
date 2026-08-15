import { useId, type ReactNode } from "react";

/**
 * Ilustraciones tipo "calcomanía" (sticker) dibujadas con una sola silueta
 * Bézier por forma. Técnica de borde troquelado: se traza el path con borde
 * blanco y se rellena encima, dejando un keyline exterior continuo sin
 * costuras. Una sombra suave da volumen de calcomanía real.
 */

function Sticker({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 140 160" fill="none" className={className} aria-hidden="true">
      <defs>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#16171a" floodOpacity="0.14" />
        </filter>
      </defs>
      {children}
    </svg>
  );
}

function shape(
  d: string,
  fill: string,
  keyline = "var(--color-paper)"
) {
  return (
    <>
      <path d={d} stroke={keyline} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d={d} fill={fill} />
    </>
  );
}

// Silueta del saguaro: tronco + dos brazos, una sola curva cerrada.
const SAGUARO = [
  "M56 150",
  "L56 112",
  "Q48 118 40 104", // brazo izq. — cara inferior
  "L40 76",
  "Q40 68 48 68", // brazo izq. — copa
  "Q56 68 56 76",
  "L56 46",
  "Q56 36 70 36", // copa del tronco
  "Q84 36 84 46",
  "L84 84",
  "Q84 76 92 76", // brazo der. — copa
  "Q100 76 100 84",
  "L100 116",
  "Q92 128 84 124", // brazo der. — cara inferior
  "L84 150",
  "Z",
].join("");

const RIB_L = "M65 50 V146";
const RIB_R = "M75 50 V146";

export function Saguaro({ className }: { className?: string }) {
  const id = `saguaro-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <Sticker id={id} className={className}>
      <circle cx="112" cy="30" r="19" stroke="var(--color-amber)" strokeWidth="2" opacity="0.35" />
      <circle cx="112" cy="30" r="13" fill="var(--color-amber)" />

      <path d="M12 152 Q70 146 128 152" stroke="var(--color-sand-deep)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="156" r="1.8" fill="var(--color-sand-deep)" />
      <circle cx="108" cy="157" r="1.8" fill="var(--color-sand-deep)" />

      <g filter={`url(#${id})`}>
        {shape(SAGUARO, "var(--color-verde)")}
        <path d={RIB_L} stroke="var(--color-verde-deep)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
        <path d={RIB_R} stroke="var(--color-verde-deep)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
        <circle cx="70" cy="33" r="4.5" fill="var(--color-amber)" />
        <circle cx="48" cy="65" r="4" fill="var(--color-amber)" />
        <circle cx="92" cy="73" r="4" fill="var(--color-amber)" />
      </g>
    </Sticker>
  );
}

// Biznaga en maceta: cactus barril (un path) + maceta (un path).
const BIZNAGA = [
  "M44 92",
  "V56",
  "Q44 34 60 34",
  "Q76 34 76 56",
  "V92",
  "Q76 97 71 97",
  "H49",
  "Q44 97 44 92",
  "Z",
].join("");

const POT = ["M32 96", "H88", "L82 124", "Q82 128 76 128", "H44", "Q38 128 38 124", "Z"].join("");

export function Biznaga({ className }: { className?: string }) {
  const id = `biznaga-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 120 132" fill="none" className={className} aria-hidden="true">
      <defs>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#16171a" floodOpacity="0.14" />
        </filter>
      </defs>

      <circle cx="98" cy="22" r="11" fill="var(--color-amber)" />

      <g filter={`url(#${id})`}>
        {shape(POT, "var(--color-sand-deep)")}
        <rect x="24" y="88" width="72" height="10" rx="3" fill="var(--color-sand-deep)" stroke="var(--color-paper)" strokeWidth="6" />
        {shape(BIZNAGA, "var(--color-verde)")}
        <path d="M52 44 V90" stroke="var(--color-verde-deep)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
        <path d="M60 42 V92" stroke="var(--color-verde-deep)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
        <path d="M68 44 V90" stroke="var(--color-verde-deep)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
        <circle cx="60" cy="31" r="4" fill="var(--color-amber)" />
      </g>
    </svg>
  );
}
