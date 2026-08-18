import { Link } from "react-router-dom";
import { useAdminStats } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_LABELS, CITY_LABELS, type BorderCity } from "@/types/business";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminStats();

  return (
    <div className="p-5 sm:p-8">
      <AdminPageHeader
        eyebrow="Panel de control"
        title="Resumen"
        description="Estado general de La Frontera: usuarios, negocios, reseñas y marketplace."
      />

      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="mt-6">
          <EmptyState title="No pudimos cargar el resumen" description="Intenta de nuevo en unos segundos." />
        </div>
      )}

      {data && (
        <div className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Usuarios"
              value={data.users.total}
              detail={`${data.users.active} activos`}
            />
            <StatCard
              label="Negocios"
              value={data.businesses.total}
              detail={`${data.businesses.ACTIVE} activos · ${data.businesses.ARCHIVED} archivados`}
              alert={data.businesses.ARCHIVED > 0}
            />
            <StatCard label="Reseñas" value={data.reviews.total} />
            <StatCard label="Marketplace" value={data.marketplace.total} />
          </div>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
            <section>
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                Últimos negocios
              </h2>
              <ul className="mt-3 flex flex-col divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
                {data.recentBusinesses.length === 0 && (
                  <li className="px-4 py-5 text-sm text-ink-soft">Aún no hay negocios.</li>
                )}
                {data.recentBusinesses.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink/5">
                      {b.coverImageUrl ? (
                        <img src={b.coverImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-ink-soft">{b.name.charAt(0)}</span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link to={`/negocios/${b.slug}`} className="block truncate text-sm font-semibold text-ink hover:text-verde">
                        {b.name}
                      </Link>
                      <span className="block truncate text-xs text-ink-soft">
                        {CITY_LABELS[b.city as BorderCity] ?? b.city} ·{" "}
                        {CATEGORY_LABELS[b.category as keyof typeof CATEGORY_LABELS]}
                      </span>
                    </span>
                    <Badge tone={b.status === "ACTIVE" ? "verde" : "neutral"}>{b.status}</Badge>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                Últimas reseñas
              </h2>
              <ul className="mt-3 flex flex-col divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
                {data.recentReviews.length === 0 && (
                  <li className="px-4 py-5 text-sm text-ink-soft">Aún no hay reseñas.</li>
                )}
                {data.recentReviews.map((r) => (
                  <li key={r.id} className="px-4 py-3">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-ink">
                        {r.business?.name ?? "Negocio eliminado"}
                      </span>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-amber-deep">
                        {r.rating}★
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-soft">
                      {r.user?.name ?? "Usuario"} ·{" "}
                      <span className="font-mono tabular-nums">{shortDate(r.createdAt)}</span>
                    </span>
                    {r.comment && (
                      <span className="mt-1 block truncate text-sm text-ink">{r.comment}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                Usuarios recientes
              </h2>
              <ul className="mt-3 flex flex-col divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
                {data.recentUsers.length === 0 && (
                  <li className="px-4 py-5 text-sm text-ink-soft">Aún no hay usuarios.</li>
                )}
                {data.recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-xs font-bold text-verde-deep">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        u.name.charAt(0).toUpperCase()
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{u.name}</span>
                      <span className="block truncate text-xs text-ink-soft">
                        {CITY_LABELS[u.city as BorderCity] ?? u.city} ·{" "}
                        <span className="font-mono tabular-nums">{shortDate(u.createdAt)}</span>
                      </span>
                    </span>
                    <Badge tone={u.role === "BUSINESS_OWNER" ? "verde" : "neutral"}>
                      {u.role === "BUSINESS_OWNER" ? "Dueño" : u.role === "ADMIN" ? "Admin" : "Explorador"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
