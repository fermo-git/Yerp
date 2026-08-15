import type { Business } from "@/types/business";
import { RestaurantCard } from "@/components/business/RestaurantCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface RestaurantGridProps {
  restaurants: Business[];
  isLoading: boolean;
  isError: boolean;
  favoriteSlugs: Set<string>;
  onToggleFavorite: (slug: string) => void;
}

export function RestaurantGrid({
  restaurants,
  isLoading,
  isError,
  favoriteSlugs,
  onToggleFavorite,
}: RestaurantGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="No pudimos cargar los restaurantes"
        description="Intenta de nuevo en unos segundos."
      />
    );
  }

  if (restaurants.length === 0) {
    return (
      <EmptyState
        title="No encontramos restaurantes"
        description="Ajusta los filtros o busca otra cosa."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isFavorite={favoriteSlugs.has(restaurant.slug)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
