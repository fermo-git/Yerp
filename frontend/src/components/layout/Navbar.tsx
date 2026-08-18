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
    label: "Garitas",
    to: "/garitas",
    icon: icon(
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
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
    label: "Publica tu negocio",
    to: "/negocios/nuevo",
    icon: icon(<path d="M4 8h16v12H4zM9 8V5a3 3 0 0 1 6 0v3M4 13h16" />),
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links =
    user?.role === "BUSINESS_OWNER"
      ? NAV_LINKS
      : NAV_LINKS.filter((link) => link.to !== "/negocios/nuevo");

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper">
      <div className="container-frontera flex h-[72px] items-center justify-between gap-4">
        <Wordmark />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {links.map((link) => (
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
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/perfil");
                  }}
                  aria-label="Ir a mi perfil"
                  title="Mi perfil"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-verde-tint text-sm font-bold text-verde-deep transition-opacity hover:opacity-80"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </button>
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
            {links.map((link) => (
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
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setOpen(false);
                      navigate("/perfil");
                    }}
                  >
                    Mi perfil
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={logout}>
                    Salir
                  </Button>
                </>
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
