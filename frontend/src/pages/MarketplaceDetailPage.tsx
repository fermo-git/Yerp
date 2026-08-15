import { Link, useParams } from "react-router-dom";
import { useMarketplaceListing } from "@/hooks/useMarketplace";
import { MARKETPLACE_CATEGORY_LABELS } from "@/types/marketplace";
import { CITY_LABELS, type BorderCity } from "@/types/business";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23eef4f1'%3E%3Crect width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230f5c46' font-family='sans-serif' font-size='18'%3ESin imagen%3C/text%3E%3C/svg%3E";

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return "Sin precio";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, isError } = useMarketplaceListing(id ?? "");

  if (isLoading) {
    return (
      <div className="container-frontera py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl lg:aspect-auto lg:min-h-[500px]" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="container-frontera py-20">
        <EmptyState
          title="Publicación no encontrada"
          description="Esta publicación puede haber sido eliminada o no existe."
          action={
            <Link to="/marketplace">
              <Button variant="outline">Volver al marketplace</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const cityLabel = CITY_LABELS[listing.city as BorderCity] ?? listing.city;

  return (
    <div className="container-frontera py-10 sm:py-14">
      <Link
        to="/marketplace"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-verde"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Volver al marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="overflow-hidden rounded-2xl bg-ink/5">
          <img
            src={listing.imageUrl || PLACEHOLDER_IMG}
            alt={listing.title}
            className="h-full w-full object-cover lg:aspect-auto lg:min-h-[500px]"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Badge tone="verde">
              {MARKETPLACE_CATEGORY_LABELS[listing.category]}
            </Badge>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {listing.title}
            </h1>
            <p className="mt-2 font-display text-3xl font-bold text-verde">
              {formatPrice(listing.price)}
            </p>
          </div>

          {listing.description && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Descripción
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 rounded-xl border border-ink/8 bg-white p-4">
            <div>
              <span className="text-xs font-medium text-ink-soft">Ciudad</span>
              <p className="mt-0.5 text-sm font-semibold text-ink">{cityLabel}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-ink-soft">Estado</span>
              <p className="mt-0.5 text-sm font-semibold text-ink">
                {listing.status === "ACTIVE" ? "Activo" : listing.status}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-ink-soft">Publicado</span>
              <p className="mt-0.5 text-sm font-semibold text-ink">
                {formatDate(listing.createdAt)}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-ink-soft">Categoría</span>
              <p className="mt-0.5 text-sm font-semibold text-ink">
                {MARKETPLACE_CATEGORY_LABELS[listing.category]}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-ink/8 bg-white p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Vendedor
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-sm font-bold text-verde-deep">
                {listing.seller.avatarUrl ? (
                  <img
                    src={listing.seller.avatarUrl}
                    alt={listing.seller.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  listing.seller.name.charAt(0).toUpperCase()
                )}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{listing.seller.name}</p>
                <p className="text-xs text-ink-soft">
                  {CITY_LABELS[listing.seller.city as BorderCity] ?? listing.seller.city}
                </p>
              </div>
            </div>
          </div>

          {(listing.contactName || listing.contactPhone || listing.contactWhatsapp || listing.contactEmail) && (
            <div className="rounded-xl border border-ink/8 bg-white p-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Datos de contacto
              </h2>
              <div className="mt-3 flex flex-col gap-2.5">
                {listing.contactName && (
                  <div className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-ink-soft">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-sm text-ink">{listing.contactName}</span>
                  </div>
                )}
                {listing.contactPhone && (
                  <div className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-ink-soft">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <a href={`tel:${listing.contactPhone}`} className="text-sm font-medium text-verde hover:text-verde-deep">
                      {listing.contactPhone}
                    </a>
                  </div>
                )}
                {listing.contactWhatsapp && (
                  <div className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-ink-soft">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    <a
                      href={`https://wa.me/${listing.contactWhatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-verde hover:text-verde-deep"
                    >
                      {listing.contactWhatsapp}
                    </a>
                  </div>
                )}
                {listing.contactEmail && (
                  <div className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-ink-soft">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <a href={`mailto:${listing.contactEmail}`} className="text-sm font-medium text-verde hover:text-verde-deep">
                      {listing.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
