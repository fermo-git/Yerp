import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMarketplaceListing,
  deleteMarketplaceListing,
  getMarketplaceListing,
  getMarketplaceListings,
  getMyMarketplaceListings,
  updateMarketplaceListingStatus,
  updateMarketplaceListing,
  uploadMarketplaceImage,
} from "@/services/api/marketplace";
import type {
  CreateListingInput,
  MarketplaceFilters,
  MarketplaceStatus,
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

export function useMyMarketplaceListings() {
  return useQuery({
    queryKey: ["marketplace", "mine"],
    queryFn: () => getMyMarketplaceListings(),
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

export function useUpdateMarketplaceListingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MarketplaceStatus }) =>
      updateMarketplaceListingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
}

export function useDeleteMarketplaceListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMarketplaceListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
}

export function useUpdateMarketplaceListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateListingInput> }) =>
      updateMarketplaceListing(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
}

// No invalida queries: la subida no modifica el anuncio por sí sola; la URL
// devuelta se persiste con create/update, que sí invalidan ["marketplace"].
export function useUploadMarketplaceImage() {
  return useMutation({
    mutationFn: (file: File) => uploadMarketplaceImage(file),
  });
}