import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getMarketplaceListings,
  getMarketplaceListingBySlug,
} from "@/services/api/marketplace";
import type { MarketplaceQueryParams } from "@/types/marketplace";

export function useMarketplaceListings(params: MarketplaceQueryParams) {
  return useQuery({
    queryKey: ["marketplace", "list", params],
    queryFn: () => getMarketplaceListings(params),
    placeholderData: keepPreviousData,
  });
}

export function useMarketplaceListingBySlug(slug: string) {
  return useQuery({
    queryKey: ["marketplace", "detail", slug],
    queryFn: () => getMarketplaceListingBySlug(slug),
    enabled: Boolean(slug),
  });
}
