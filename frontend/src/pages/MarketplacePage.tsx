import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateMarketplaceListing,
  useMarketplaceListings,
  useUploadMarketplaceImage,
} from "@/hooks/useMarketplace";
import { MarketplaceCard, MarketplaceCardSkeleton } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { CreateListingModal } from "@/components/marketplace/CreateListingModal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { CreateListingInput, MarketplaceCategory } from "@/types/marketplace";

export function MarketplacePage() {
  const { status: authStatus } = useAuth();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const filters = {
    city: city || undefined,
    category: (category || undefined) as MarketplaceCategory | undefined,
    q: query || undefined,
    page,
  };

  const { data, isLoading, isError } = useMarketplaceListings(filters);
  const createMutation = useCreateMarketplaceListing();
  const uploadImage = useUploadMarketplaceImage();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCityChange = useCallback((v: string) => {
    setCity(v);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((v: string) => {
    setCategory(v);
    setPage(1);
  }, []);

  const handleQueryChange = useCallback((v: string) => {
    setQuery(v);
    setPage(1);
  }, []);

  function handleOpenModal() {
    if (authStatus !== "authenticated") {
      navigate("/login");
      return;
    }
    setModalOpen(true);
  }

  async function handleCreateListing(input: CreateListingInput, imageFile: File | null) {
    setSubmitError(null);
    try {
      let imageUrl: string | null = null;
      if (imageFile) imageUrl = await uploadImage.mutateAsync(imageFile);
      await createMutation.mutateAsync({ ...input, imageUrl });
      setModalOpen(false);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "No se pudo publicar. Intenta de nuevo."
      );
    }
  }

  const listings = data?.listings ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <>
      <section className="container-frontera py-10 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Compra y venta local</Eyebrow>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Marketplace
            </h1>
            <p className="mt-2 max-w-lg text-sm text-ink-soft">
              Encuentra artículos, vehículos, servicios y más en tu ciudad fronteriza.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="lg" variant="outline" onClick={() => navigate("/marketplace/mias")}>
              Mis publicaciones
            </Button>
            <Button size="lg" onClick={handleOpenModal}>
              <svg width="24" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Publicar
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <MarketplaceFilters
            city={city}
            category={category}
            query={query}
            onCityChange={handleCityChange}
            onCategoryChange={handleCategoryChange}
            onQueryChange={handleQueryChange}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading &&
            Array.from({ length: 20 }).map((_, i) => (
              <MarketplaceCardSkeleton key={i} />
            ))}

          {!isLoading && isError && (
            <div className="col-span-full">
              <EmptyState
                title="No pudimos cargar las publicaciones"
                description="Intenta de nuevo en unos segundos."
              />
            </div>
          )}

          {!isLoading && !isError && listings.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                title="No hay publicaciones"
                description="Sé el primero en publicar algo en el marketplace."
                action={
                  <Button size="md" onClick={handleOpenModal}>
                    Crear publicación
                  </Button>
                }
              />
            </div>
          )}

          {listings.map((listing) => (
            <MarketplaceCard key={listing.id} listing={listing} />
          ))}
        </div>

        {!isLoading && !isError && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {paginationRange(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-sm text-ink-soft">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-verde text-white"
                        : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Button>
          </div>
        )}

        {!isLoading && !isError && meta && (
          <p className="mt-4 text-center text-xs text-ink-soft">
            Mostrando {(meta.page - 1) * meta.limit + 1}–
            {Math.min(meta.page * meta.limit, meta.total)} de {meta.total}{" "}
            publicaciones
          </p>
        )}
      </section>

      <CreateListingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSubmitError(null);
        }}
        onSubmit={handleCreateListing}
        isSubmitting={createMutation.isPending || uploadImage.isPending}
        error={submitError}
      />
    </>
  );
}

function paginationRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
