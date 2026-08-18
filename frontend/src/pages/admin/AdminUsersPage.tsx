import { useMemo, useState } from "react";
import { useAdminUsers, useAdminUserActions } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CITY_LABELS, CITY_OPTIONS, type BorderCity } from "@/types/business";
import type { AdminUser } from "@/services/api/admin";

const ROLE_OPTIONS: SelectOption[] = [
  { value: "", label: "Todos los roles" },
  { value: "USER", label: "Exploradores" },
  { value: "BUSINESS_OWNER", label: "Dueños de negocio" },
  { value: "ADMIN", label: "Administradores" },
];

const CITY_SELECT_OPTIONS: SelectOption[] = [
  { value: "", label: "Todas las ciudades" },
  ...CITY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
];

const ROLE_LABELS: Record<AdminUser["role"], string> = {
  USER: "Explorador",
  BUSINESS_OWNER: "Dueño",
  ADMIN: "Admin",
};

export function AdminUsersPage() {
  const { user: me } = useAuth();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");

  const filters = useMemo(
    () => ({ q: search || undefined, role: role || undefined, city: city || undefined }),
    [search, role, city]
  );

  const { data, isLoading, isError } = useAdminUsers(filters);
  const userActions = useAdminUserActions();
  const submitting = userActions.isPending;

return (
    <div className="p-5 sm:p-8">
      <AdminPageHeader
        eyebrow="Personas"
        title="Usuarios"
        description="Cambia el rol de una cuenta o desactívala. El rol ADMIN solo se gestiona en la base de datos."
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(q);
          }}
        >
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o correo"
            className="h-9 w-64 rounded-md border border-ink/10 bg-white px-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20"
            aria-label="Buscar usuario"
          />
          <Button type="submit" size="sm" variant="secondary">
            Buscar
          </Button>
        </form>
        <Select value={role} options={ROLE_OPTIONS} onChange={setRole} ariaLabel="Rol" />
        <Select value={city} options={CITY_SELECT_OPTIONS} onChange={setCity} ariaLabel="Ciudad" />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              {["Usuario", "Correo", "Ciudad", "Rol", "Negocios", "Estado", "Acciones"].map((h) => (
                <th key={h} className="px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <Skeleton className="h-6 w-full rounded" />
                  </td>
                </tr>
              ))}

            {!isLoading && isError && (
              <tr>
                <td colSpan={7} className="px-4 py-8">
                  <EmptyState title="No pudimos cargar los usuarios" description="Intenta de nuevo en unos segundos." />
                </td>
              </tr>
            )}

            {!isLoading && !isError && (data?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8">
                  <EmptyState title="Sin resultados" description="Prueba con otros filtros." />
                </td>
              </tr>
            )}

            {data?.map((u) => {
              const isSelf = u.id === me?.id;
              const isAdmin = u.role === "ADMIN";
              return (
                <tr key={u.id} className="hover:bg-ink/[0.03]">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-xs font-bold text-verde-deep">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          u.name.charAt(0).toUpperCase()
                        )}
                      </span>
                      <span className="max-w-[160px] truncate font-medium text-ink">
                        {u.name}
                        {isSelf && <span className="ml-1 text-xs text-ink-soft">(tú)</span>}
                      </span>
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-ink-soft">{u.email}</td>
                  <td className="px-4 py-3 text-ink-soft">{CITY_LABELS[u.city as BorderCity] ?? u.city}</td>
                  <td className="px-4 py-3">
                    <Badge tone={isAdmin ? "amber" : "neutral"}>{ROLE_LABELS[u.role]}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm tabular-nums text-ink-soft">{u.businessCount}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.isActive ? "verde" : "neutral"}>{u.isActive ? "Activo" : "Inactivo"}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={submitting || isAdmin}
                        title={isAdmin ? "El rol de un administrador no se cambia desde aquí" : undefined}
                        onClick={() =>
                          userActions.mutate({
                            id: u.id,
                            patch: { role: u.role === "BUSINESS_OWNER" ? "USER" : "BUSINESS_OWNER" },
                          })
                        }
                      >
                        {u.role === "BUSINESS_OWNER" ? "Quitar dueño" : "Hacer dueño"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={submitting || isSelf}
                        title={isSelf ? "No puedes desactivar tu propia cuenta" : undefined}
                        className="text-alto hover:bg-alto/10"
                        onClick={() => userActions.mutate({ id: u.id, patch: { isActive: !u.isActive } })}
                      >
                        {u.isActive ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
