import { useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const icon = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
  >
    {children}
  </svg>
);

const NAV_LINKS = [
  {
    label: "Explorar",
    to: "/explorar",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2z" />
      </>
    ),
  },
  {
    label: "Restaurantes",
    to: "/restaurantes",
    icon: icon(<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v6M5 3h4M19 3v18M19 3c-2 0-3 2-3 5s1 4 3 4" />),
  },
  {
    label: "Marketplace",
    to: "/marketplace",
    icon: icon(
      <>
        <path d="M3 3h7l11 11-7 7L3 10V3z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </>
    ),
  },
  {
    label: "Negocios",
    to: "/negocios/nuevo",
    icon: icon(<path d="M4 8h16v12H4zM9 8V5a3 3 0 0 1 6 0v3M4 13h16" />),
  },
];

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="La Frontera — inicio">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-verde text-white">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="7" y="7" width="6" height="6" rx="1" fill="currentColor" transform="rotate(45 10 10)" />
        </svg>
      </span>
      <span className="font-display text-[15px] font-extrabold uppercase tracking-wide text-ink">
        La Frontera
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper">
      <div className="container-frontera flex h-[72px] items-center justify-between gap-4">
        <Wordmark />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-soft hover:text-ink"
                )
              }
            >
              <span className={cn("text-ink-soft")}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Idioma"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-ink lg:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
            </svg>
          </button>

          <div className="hidden items-center gap-1.5 md:flex">
            {user ? (
              <>
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-sm font-bold text-verde-deep">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                  Iniciar sesión
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate("/registro")}>
                  Crear cuenta
                </Button>
              </>
            )}
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Abrir menú de navegación"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper lg:hidden">
          <nav className="container-frontera flex flex-col gap-1 py-3" aria-label="Navegación móvil">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-ink/5"
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 px-3">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={logout}>
                  Salir
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      navigate("/registro");
                    }}
                  >
                    Crear cuenta
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
