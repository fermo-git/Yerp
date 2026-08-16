import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/brand/Wordmark";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";

const icon = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
