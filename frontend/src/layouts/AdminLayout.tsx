import type { ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Wordmark } from "@/components/brand/Wordmark";
import { RouteLine } from "@/components/brand/RouteLine";
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
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ADMIN_LINKS = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: icon(
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  {
    label: "Negocios",
    to: "/admin/negocios",
    icon: icon(
      <path d="M4 4h16l-1.2 5H5.2L4 4zM5.5 9.5V20h13V9.5M9.5 20v-6.5h5V20" />
    ),
  },
  {
    label: "Reseñas",
    to: "/admin/resenas",
    icon: icon(
      <path d="M12 3.5l2.65 5.5 6.05.85-4.4 4.25 1.05 6-5.3-2.85-5.3 2.85 1.05-6L3.3 9.85l6.05-.85L12 3.5z" />
    ),
  },
  {
    label: "Usuarios",
    to: "/admin/usuarios",
    icon: icon(
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0M15.5 4.8a3.5 3.5 0 0 1 0 6.4M17.5 14.8a5.5 5.5 0 0 1 3 5.2" />
      </>
    ),
  },
];

function UserCard() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-paper px-3 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-sm font-bold text-verde-deep">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          user.name.charAt(0).toUpperCase()
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
        <span className="mt-0.5 block">
          <Badge tone="neutral">Admin</Badge>
        </span>
      </span>
    </div>
  );
}

export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <aside className="bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-ink/10">
        <div className="border-b border-ink/10 px-5 py-4 lg:border-b-0">
          <div className="flex items-center justify-between gap-3">
            <Wordmark size="sm" />
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                Admin
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md p-1.5 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink lg:hidden"
                aria-label="Cerrar sesión"
              >
                {icon(<path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M9 16l4-4-4-4M13 12H3" />)}
              </button>
            </div>
          </div>
          <RouteLine className="mt-4 hidden lg:block" />
        </div>

        <nav
          className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:py-4"
          aria-label="Navegación de administración"
        >
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-verde-tint text-verde-deep"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                )
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden flex-col gap-2 border-t border-ink/10 p-4 lg:flex">
          <UserCard />
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            Ver sitio
          </Button>
          <Button variant="ghost" size="sm" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
