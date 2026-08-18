import { Link } from "react-router-dom";
import { useFeaturedBusinesses } from "@/hooks/useBusinesses";
import { useAuth } from "@/hooks/useAuth";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CITY_LABELS } from "@/types/business";

export function FeaturedBusinesses() {
  const { user } = useAuth();
  const city = user?.city;
  const { data, isLoading, isError } = useFeaturedBusinesses(city);

  const heading = city
    ? `Lo mejor de ${CITY_LABELS[city]}`
    : "Lo mejor de tu lado de la línea";

  return (
    <section className="container-frontera py-20">
      <header className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Destacados de la semana</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h2>
        </div>
        <Link
          to="/explorar"
          className="hidden items-center gap-1.5 text-sm font-semibold text-verde hover:text-verde-deep sm:flex"
        >
          Ver todo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <BusinessCardSkeleton key={i} />)}

        {!isLoading && isError && (
          <div className="col-span-full">
            <EmptyState
              title="No pudimos cargar los destacados"
              description="Intenta de nuevo en unos segundos."
            />
          </div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="Aún no hay negocios destacados en tu ciudad"
              description="Sé de los primeros en publicar tu negocio en La Frontera."
            />
          </div>
        )}

        {data?.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}
