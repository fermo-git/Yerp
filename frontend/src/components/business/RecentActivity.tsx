import { useRecentActivity } from "@/hooks/useBusinesses";
import { ActivityCard } from "@/components/business/ActivityCard";
import { ActivityCardSkeleton } from "@/components/ui/Skeleton";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function RecentActivity() {
  const { data, isLoading } = useRecentActivity();

  return (
    <section className="container-frontera py-14">
      <Eyebrow>En la frontera ahora</Eyebrow>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Actividad reciente
      </h2>

      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <ActivityCardSkeleton key={i} />)
          : data?.map((item) => <ActivityCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
