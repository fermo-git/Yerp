import { Link, useParams } from "react-router-dom";
import { useMarketplaceListingBySlug } from "@/hooks/useMarketplace";
import { MARKETPLACE_CATEGORY_LABELS, MARKETPLACE_STATUS_LABELS } from "@/types/marketplace";
import { CITY_LABELS } from "@/types/business";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function MarketplaceListingDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: listing, isLoading, isError } = useMarketplaceListingBySlug(slug);

  if (isLoading) {
    return (
      <div className="container-frontera flex flex-col gap-6 py-10">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="container-frontera py-20">
        <EmptyState
          title="No encontramos esta publicación"
          description="Puede que ya no esté disponible o que el enlace sea incorrecto."
          action={
            <Link to="/marketplace">
              <Button variant="outline" size="sm">
                Volver al marketplace
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const isSold = listing.status === "SOLD";
  const digitsOnly = (value?: string) => value?.replace(/[^\d+]/g, "");

  return (
    <div className="container-frontera py-10">
      <Link
        to="/marketplace"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-carbon/60 hover:text-carbon"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver al marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-carbon/5">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className={`h-full w-full object-cover ${isSold ? "grayscale" : ""}`}
          />
          {isSold && (
            <span className="absolute left-4 top-4 rounded-full bg-carbon/80 px-3 py-1.5 text-sm font-medium text-white shadow-soft">
              {MARKETPLACE_STATUS_LABELS.SOLD}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Badge tone="frontera" className="w-fit">
              {MARKETPLACE_CATEGORY_LABELS[listing.category]}
            </Badge>
            <h1 className="font-display text-2xl font-semibold text-carbon sm:text-3xl">
              {listing.title}
            </h1>
            <p className="font-display text-xl font-semibold text-cactus-dark">
              {formatCurrency(listing.price)}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-carbon/55">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.8 10.6c0 6.5-8.8 12-8.8 12s-8.8-5.5-8.8-12a8.8 8.8 0 1 1 17.6 0z" />
                <circle cx="12" cy="10.6" r="3" />
              </svg>
              {CITY_LABELS[listing.city]}
            </p>
          </div>

          <p className="whitespace-pre-line text-sm leading-relaxed text-carbon/75">
            {listing.description}
          </p>

          {isSold ? (
            <div className="rounded-2xl border border-dashed border-carbon/15 bg-white p-4 text-sm text-carbon/60">
              Esta publicación ya fue marcada como vendida.
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-2xl border border-carbon/8 bg-white p-5 shadow-soft">
              <p className="text-sm font-medium text-carbon">
                Contacto: <span className="text-carbon/70">{listing.contactName}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {listing.contactWhatsapp && (
                  <a
                    href={`https://wa.me/${digitsOnly(listing.contactWhatsapp)?.replace("+", "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="primary" size="sm">
                      WhatsApp
                    </Button>
                  </a>
                )}
                {listing.contactPhone && (
                  <a href={`tel:${digitsOnly(listing.contactPhone)}`}>
                    <Button variant="outline" size="sm">
                      Llamar
                    </Button>
                  </a>
                )}
                {listing.contactEmail && (
                  <a href={`mailto:${listing.contactEmail}`}>
                    <Button variant="outline" size="sm">
                      Enviar correo
                    </Button>
                  </a>
                )}
              </div>
              <p className="text-xs text-carbon/45">
                La Frontera solo conecta compradores y vendedores; el trato y el pago se
                acuerdan directamente entre ustedes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
