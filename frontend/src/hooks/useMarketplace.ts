import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMarketplaceListing,
  getMarketplaceListing,
  getMarketplaceListings,
} from "@/services/api/marketplace";
import type {
  CreateListingInput,
  MarketplaceFilters,
} from "@/types/marketplace";

export function useMarketplaceListings(filters?: MarketplaceFilters) {
  return useQuery({
    queryKey: ["marketplace", "list", filters],
    queryFn: () => getMarketplaceListings(filters),
  });
}

export function useMarketplaceListing(id: string) {
  return useQuery({
    queryKey: ["marketplace", "detail", id],
    queryFn: () => getMarketplaceListing(id),
    enabled: Boolean(id),
  });
}

export function useCreateMarketplaceListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateListingInput) => createMarketplaceListing(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
}
