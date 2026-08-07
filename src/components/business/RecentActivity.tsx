import { useRecentActivity } from "@/hooks/useBusinesses";
import { ActivityCard } from "@/components/business/ActivityCard";
import { ActivityCardSkeleton } from "@/components/ui/Skeleton";

export function RecentActivity() {
  const { data, isLoading } = useRecentActivity();

  return (
    <section className="container-frontera py-10">
      <h2 className="font-display text-2xl font-semibold text-carbon">Actividad reciente</h2>
      <p className="mt-1 text-sm text-carbon/55">Lo que la comunidad está reseñando ahora mismo.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <ActivityCardSkeleton key={i} />)
          : data?.map((item) => <ActivityCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
