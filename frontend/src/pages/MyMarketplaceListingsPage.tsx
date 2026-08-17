import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useMyMarketplaceListings,
  useUpdateMarketplaceListing,
  useUpdateMarketplaceListingStatus,
} from "@/hooks/useMarketplace";
import { MyListingCard } from "@/components/marketplace/MyListingCard";
import { CreateListingModal } from "@/components/marketplace/CreateListingModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { CreateListingInput, MarketplaceListing } from "@/types/marketplace";

export function MyMarketplaceListingsPage() {
  const { status: authStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      navigate("/login");
    }
  }, [authStatus, navigate]);

  const { data: listings, isLoading, isError } = useMyMarketplaceListings();
  const updateStatus = useUpdateMarketplaceListingStatus();
  const updateListing = useUpdateMarketplaceListing();

  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);

  function handleMarkSold(id: string) {
    updateStatus.mutate({ id, status: "SOLD" });
  }

  async function handleEditSubmit(input: CreateListingInput) {
    if (!editingListing) return;
    await updateListing.mutateAsync({ id: editingListing.id, input });
    setEditingListing(null);
  }

  return (
    <section className="container-frontera py-10 sm:py-14">
      <Link
        to="/marketplace"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-verde"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Volver al marketplace
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Tu actividad</Eyebrow>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Mis publicaciones
          </h1>
          <p className="mt-2 max-w-lg text-sm text-ink-soft">
            Administra tus publicaciones del marketplace.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-ink/5" />
          ))}

        {!isLoading && isError && (
          <EmptyState
            title="No pudimos cargar tus publicaciones"
            description="Intenta de nuevo en unos segundos."
          />
        )}

        {!isLoading && !isError && listings && listings.length === 0 && (
          <EmptyState
            title="Aún no tienes publicaciones"
            description="Crea tu primera publicación desde el marketplace."
            action={
              <Button size="md" onClick={() => navigate("/marketplace")}>
                Ir al marketplace
              </Button>
            }
          />
        )}

        {listings?.map((listing) => (
          <MyListingCard
            key={listing.id}
            listing={listing}
            onEdit={setEditingListing}
            onMarkSold={handleMarkSold}
            isUpdating={updateStatus.isPending}
          />
        ))}
      </div>

      <CreateListingModal
        open={Boolean(editingListing)}
        mode="edit"
        onClose={() => setEditingListing(null)}
        onSubmit={handleEditSubmit}
        isSubmitting={updateListing.isPending}
        initialValues={
          editingListing
            ? {
                title: editingListing.title,
                description: editingListing.description ?? "",
                price: editingListing.price,
                category: editingListing.category,
                city: editingListing.city,
                imageUrl: editingListing.imageUrl ?? "",
                contactName: editingListing.contactName ?? "",
                contactPhone: editingListing.contactPhone ?? "",
                contactWhatsapp: editingListing.contactWhatsapp ?? "",
                contactEmail: editingListing.contactEmail ?? "",
              }
            : undefined
        }
      />
    </section>
  );
}