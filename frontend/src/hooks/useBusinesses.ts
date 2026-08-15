import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFeaturedBusinesses,
  getBusinesses,
  getBusinessBySlug,
  getRecentActivity,
  getBorderWidgets,
  createBusiness,
  uploadBusinessGallery,
  uploadBusinessMenu,
} from "@/services/api/businesses";
import type { CreateBusinessInput, BusinessDTO } from "@/types/business";

export function useFeaturedBusinesses() {
  return useQuery({
    queryKey: ["businesses", "featured"],
    queryFn: getFeaturedBusinesses,
  });
}

export function useBusinesses(params?: { city?: string; category?: string; q?: string }) {
  return useQuery({
    queryKey: ["businesses", "list", params],
    queryFn: () => getBusinesses(params),
  });
}

export function useBusinessBySlug(slug: string) {
  return useQuery({
    queryKey: ["businesses", "detail", slug],
    queryFn: () => getBusinessBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["activity", "recent"],
    queryFn: getRecentActivity,
  });
}

export function useBorderWidgets() {
  return useQuery({
    queryKey: ["widgets", "border"],
    queryFn: getBorderWidgets,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5, // refresca cada 5 min, como haría el widget real
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBusinessInput) => createBusiness(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useUploadGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, files }: { businessId: string; files: File[] }) =>
      uploadBusinessGallery(businessId, files),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["businesses", "detail", variables.businessId],
      });
      void queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useUploadMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, file }: { businessId: string; file: File }) =>
      uploadBusinessMenu(businessId, file),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["businesses", "detail", variables.businessId],
      });
    },
  });
}

export type CreateBusinessResult = BusinessDTO;
