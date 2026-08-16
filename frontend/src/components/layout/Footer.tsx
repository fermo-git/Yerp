import { Link } from "react-router-dom";
import { Biznaga } from "@/components/brand/Cactus";
import { Wordmark } from "@/components/brand/Wordmark";
import { RouteLine } from "@/components/brand/RouteLine";
import { CITY_LABELS, type BorderCity } from "@/types/business";

const CITIES = Object.entries(CITY_LABELS) as [BorderCity, string][];

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Explorar",
    links: [
      { label: "Restaurantes", to: "/explorar?categoria=RESTAURANTE" },
      { label: "Cafeterías", to: "/explorar?categoria=CAFETERIA" },
      { label: "Hoteles", to: "/explorar?categoria=HOTEL" },
      { label: "Tiendas", to: "/explorar?categoria=TIENDA" },
      { label: "Marketplace", to: "/marketplace" },
    ],
  },
  {
    title: "Negocios",
    links: [{ label: "Publica tu negocio", to: "/negocios/nuevo" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="container-frontera grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <Wordmark size="sm" />
          <p className="max-w-xs text-sm text-ink/60">
            La guía real de las ciudades fronterizas de México.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink/60">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ink/60 hover:text-verde">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink/60">
            Ciudades
          </h4>
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-1">
            {CITIES.map(([value, label]) => (
              <li key={value}>
                <Link
                  to={`/explorar?ciudad=${value}`}
                  className="text-sm text-ink/60 hover:text-verde"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Firma: el wordmark atravesado por La Línea */}
      <div className="border-t border-ink/10">
        <div className="container-frontera overflow-hidden py-10 sm:py-14">
          <div className="relative select-none" aria-hidden="true">
            <p className="whitespace-nowrap text-center font-display font-expanded text-[clamp(2.5rem,9vw,9rem)] font-extrabold uppercase leading-none tracking-[-0.02em] text-ink">
              La Frontera
            </p>
            <RouteLine
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-ink/20"
              diamondClassName="bg-white"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="container-frontera flex items-center gap-2 py-5 text-sm text-ink/60">
          <Biznaga className="w-6" />
          <span>© {new Date().getFullYear()} La Frontera. Hecho en la línea.</span>
        </div>
      </div>
    </footer>
  );
}
