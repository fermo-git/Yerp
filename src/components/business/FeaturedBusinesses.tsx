import { useFeaturedBusinesses } from "@/hooks/useBusinesses";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function FeaturedBusinesses() {
  const { data, isLoading, isError } = useFeaturedBusinesses();

  return (
    <section className="container-frontera py-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-carbon">
            Destacados cerca de ti
          </h2>
          <p className="mt-1 text-sm text-carbon/55">
            Los lugares mejor calificados esta semana.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
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
