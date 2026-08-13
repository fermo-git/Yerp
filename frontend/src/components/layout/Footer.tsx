import { Link } from "react-router-dom";
import { Biznaga } from "@/components/brand/Cactus";

const CITIES = [
  "Tijuana",
  "Mexicali",
  "Ciudad Juárez",
  "Nuevo Laredo",
  "Reynosa",
  "Matamoros",
  "Nogales",
  "Piedras Negras",
  "San Luis Río Colorado",
  "Agua Prieta",
];

const COLUMNS = [
  {
    title: "Explorar",
    links: ["Restaurantes", "Cafeterías", "Hoteles", "Tiendas", "Marketplace"],
  },
  {
    title: "Negocios",
    links: ["Publica tu negocio", "Planes para negocios", "Centro de ayuda"],
  },
  {
    title: "La Frontera",
    links: ["Sobre nosotros", "Términos y condiciones", "Privacidad"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="container-frontera grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-verde text-white">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <rect x="7" y="7" width="6" height="6" rx="1" fill="currentColor" transform="rotate(45 10 10)" />
              </svg>
            </span>
            <span className="font-display text-[15px] font-extrabold uppercase tracking-wide text-ink">
              La Frontera
            </span>
          </div>
          <p className="max-w-xs text-sm text-ink/55">
            La guía real de las ciudades fronterizas de México.
          </p>
          <div className="flex gap-2 text-xs text-ink/50">
            <span className="rounded-md bg-ink/5 px-2 py-1 font-medium">ES</span>
            <span className="rounded-md px-2 py-1">EN</span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink/45">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <Link to="#" className="text-sm text-ink/60 hover:text-verde">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink/45">
            Ciudades
          </h4>
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-1">
            {CITIES.map((city) => (
              <li key={city}>
                <Link to="#" className="text-sm text-ink/60 hover:text-verde">
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-frontera flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-2 text-sm text-ink/55">
            <Biznaga className="w-6" />
            <span>© {new Date().getFullYear()} La Frontera. Hecho en la línea.</span>
          </div>
          <div className="flex gap-4 text-sm text-ink/50">
            <span>MXN</span>
            <span>Español (MX)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
