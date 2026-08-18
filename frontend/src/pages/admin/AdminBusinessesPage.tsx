import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminBusinesses, useAdminBusinessActions } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CATEGORY_LABELS, CITY_LABELS, CITY_OPTIONS, BUSINESS_CATEGORIES, type BorderCity } from "@/types/business";
import type { AdminBusiness } from "@/services/api/admin";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "Todos los estados" },
  { value: "ACTIVE", label: "Activos" },
  { value: "ARCHIVED", label: "Archivados" },
];

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "", label: "Todas las categorías" },
  ...BUSINESS_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
];

const CITY_SELECT_OPTIONS: SelectOption[] = [
  { value: "", label: "Todas las ciudades" },
  ...CITY_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
];

function FavoriteGlyph({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path d="M20.8 8.6c0 4.5-8.8 10.4-8.8 10.4S3.2 13.1 3.2 8.6a5.4 5.4 0 0 1 9.8-3.1 5.4 5.4 0 0 1 7.8 3.1z" />
    </svg>
  );
}

export function AdminBusinessesPage() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [pendingDelete, setPendingDelete] = useState<AdminBusiness | null>(null);

  const filters = useMemo(
    () => ({ q: search || undefined, city: city || undefined, category: category || undefined, status: status || undefined }),
    [search, city, category, status]
  );

  const { data, isLoading, isError } = useAdminBusinesses(filters);
  const { update, remove } = useAdminBusinessActions();

  const submitting = update.isPending || remove.isPending;

  return (
    <div className="p-5 sm:p-8">
      <AdminPageHeader
        eyebrow="Gestión"
        title="Negocios"
        description="Archiva, destaca o elimina negocios. Los archivados desaparecen de la vista pública."
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
            placeholder="Buscar por nombre"
            className="h-9 w-52 rounded-md border border-ink/10 bg-white px-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20"
            aria-label="Buscar negocio"
          />
          <Button type="submit" size="sm" variant="secondary">
            Buscar
          </Button>
        </form>
        <Select value={city} options={CITY_SELECT_OPTIONS} onChange={setCity} ariaLabel="Ciudad" />
        <Select value={category} options={CATEGORY_OPTIONS} onChange={setCategory} ariaLabel="Categoría" />
        <Select value={status} options={STATUS_OPTIONS} onChange={setStatus} ariaLabel="Estado" />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              {["Negocio", "Ciudad", "Categoría", "Estado", "Rating", "Dueño", "Acciones"].map((h) => (
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
                  <EmptyState title="No pudimos cargar los negocios" description="Intenta de nuevo en unos segundos." />
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

            {data?.map((b) => (
              <tr key={b.id} className="hover:bg-ink/[0.03]">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink/5">
                      {b.coverImageUrl ? (
                        <img src={b.coverImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-ink-soft">{b.name.charAt(0)}</span>
                      )}
                    </span>
                    <Link to={`/negocios/${b.slug}`} className="max-w-[200px] truncate font-semibold text-ink hover:text-verde">
                      {b.name}
                    </Link>
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{CITY_LABELS[b.city as BorderCity] ?? b.city}</td>
                <td className="px-4 py-3 text-ink-soft">{CATEGORY_LABELS[b.category as keyof typeof CATEGORY_LABELS]}</td>
                <td className="px-4 py-3">
                  <Badge tone={b.status === "ACTIVE" ? "verde" : "neutral"}>{b.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs tabular-nums text-amber-deep">{b.avgRating.toFixed(1)}★</span>
                  <span className="ml-1 font-mono text-xs tabular-nums text-ink-soft">({b.reviewCount})</span>
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-ink-soft">{b.owner?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => update.mutate({ id: b.id, patch: { featured: !b.featured } })}
                      disabled={submitting}
                      title={b.featured ? "Quitar destacado" : "Destacar"}
                      aria-label={b.featured ? "Quitar destacado" : "Destacar"}
                      className={"flex h-8 w-8 items-center justify-center rounded-md border transition-colors " + (b.featured ? "border-verde/30 bg-verde-tint text-verde-deep" : "border-ink/10 text-ink-soft hover:text-ink")}
                    >
                      <FavoriteGlyph filled={b.featured} />
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => update.mutate({ id: b.id, patch: { status: b.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE" } })}
                      disabled={submitting}
                    >
                      {b.status === "ACTIVE" ? "Archivar" : "Activar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-alto hover:bg-alto/10"
                      onClick={() => setPendingDelete(b)}
                      disabled={submitting}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`¿Eliminar «${pendingDelete?.name}»?`}
        description="Se eliminará el negocio junto con sus reseñas, galería y horarios. Esta acción no se puede deshacer."
        isPending={remove.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            remove.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
          }
        }}
      />
    </div>
  );
}
