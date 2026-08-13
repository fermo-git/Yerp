import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { label: "Explorar", to: "/explorar" },
  { label: "Restaurantes", to: "/restaurantes" },
  { label: "Eventos", to: "/eventos" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "Publica tu negocio", to: "/negocios/nuevo" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-carbon/6 bg-arena/90 backdrop-blur-md">
      <div className="container-frontera flex h-[72px] items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="La Frontera — inicio">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cactus text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 3 8v13h6v-7h6v7h6V8L12 2z" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold text-carbon">
            La Frontera
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-carbon/70 transition-colors hover:bg-carbon/5 hover:text-carbon",
                  isActive && "bg-cactus-light text-cactus-dark"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">
            Iniciar sesión
          </Button>
          <Button variant="primary" size="sm">
            Crear cuenta
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-carbon/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menú de navegación"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-carbon/6 bg-arena md:hidden">
          <nav className="container-frontera flex flex-col gap-1 py-3" aria-label="Navegación móvil">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-carbon/80 hover:bg-carbon/5"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 px-3">
              <Button variant="outline" size="sm" className="flex-1">
                Iniciar sesión
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                Crear cuenta
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
