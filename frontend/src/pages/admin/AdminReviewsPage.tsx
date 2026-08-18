import { useMemo, useState } from "react";
import { useAdminReviews, useAdminReviewActions } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { AdminReview } from "@/services/api/admin";

const RATING_OPTIONS: SelectOption[] = [
  { value: "", label: "Cualquier rating" },
  { value: "1", label: "1 estrella" },
  { value: "2", label: "2 estrellas" },
  { value: "3", label: "3 estrellas" },
  { value: "4", label: "4 estrellas" },
  { value: "5", label: "5 estrellas" },
];

export function AdminReviewsPage() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [pendingDelete, setPendingDelete] = useState<AdminReview | null>(null);

  const params = useMemo(
    () => ({ q: search || undefined, rating: rating || undefined }),
    [search, rating]
  );

  const { data, isLoading, isError } = useAdminReviews(params);
  const deleteReview = useAdminReviewActions();

  return (
    <div className="p-5 sm:p-8">
      <AdminPageHeader
        eyebrow="Moderación"
        title="Reseñas"
        description="Revisa y elimina reseñas inapropiadas. Al borrar una reseña se recalcula el rating del negocio."
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
            placeholder="Buscar por autor o negocio"
            className="h-9 w-64 rounded-md border border-ink/10 bg-white px-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20"
            aria-label="Buscar reseña"
          />
          <Button type="submit" size="sm" variant="secondary">
            Buscar
          </Button>
        </form>
        <Select value={rating} options={RATING_OPTIONS} onChange={setRating} ariaLabel="Rating" />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              {["Autor", "Negocio", "Rating", "Comentario", "Fecha", "Acciones"].map((h) => (
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
                  <td colSpan={6} className="px-4 py-3">
                    <Skeleton className="h-6 w-full rounded" />
                  </td>
                </tr>
              ))}

            {!isLoading && isError && (
              <tr>
                <td colSpan={6} className="px-4 py-8">
                  <EmptyState title="No pudimos cargar las reseñas" description="Intenta de nuevo en unos segundos." />
                </td>
              </tr>
            )}

            {!isLoading && !isError && (data?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8">
                  <EmptyState title="Sin resultados" description="Prueba con otros filtros." />
                </td>
              </tr>
            )}

            {data?.map((r) => (
              <tr key={r.id} className="hover:bg-ink/[0.03]">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-xs font-bold text-verde-deep">
                      {r.user?.avatarUrl ? (
                        <img src={r.user.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (r.user?.name ?? "?").charAt(0).toUpperCase()
                      )}
                    </span>
                    <span className="max-w-[160px] truncate font-medium text-ink">{r.user?.name ?? "Usuario"}</span>
                  </span>
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-ink-soft">
                  <a href={`/negocios/${r.business?.slug}`} className="hover:text-verde">
                    {r.business?.name ?? "Negocio eliminado"}
                  </a>
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-amber-deep">{r.rating}★</td>
                <td className="max-w-[280px] truncate px-4 py-3 text-ink-soft">{r.comment ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-ink-soft">
                  {new Date(r.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-alto hover:bg-alto/10"
                    onClick={() => setPendingDelete(r)}
                    disabled={deleteReview.isPending}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="¿Eliminar esta reseña?"
        description={`Se borrará la reseña de ${pendingDelete?.user?.name ?? "este usuario"} sobre «${pendingDelete?.business?.name ?? "el negocio"}» y se recalculará su rating.`}
        isPending={deleteReview.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteReview.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
          }
        }}
      />
    </div>
  );
}
