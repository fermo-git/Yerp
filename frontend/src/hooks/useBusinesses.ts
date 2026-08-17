import { useMemo } from "react";
import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { useAuth } from "@/hooks/useAuth";
import type {
  BorderCity,
  Business,
  BusinessCategory,
  BusinessQueryParams,
  CreateBusinessInput,
  BusinessDTO,
} from "@/types/business";

export function useFeaturedBusinesses(city?: BorderCity) {
  return useQuery({
    queryKey: ["businesses", "featured", city],
    queryFn: () => getFeaturedBusinesses(city),
  });
}

export function useBusinesses(params?: BusinessQueryParams) {
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

export function useBusinessSuggestions(q: string, city?: BorderCity) {
  const trimmed = q.trim();
  return useQuery({
    queryKey: ["businesses", "suggestions", { q: trimmed, city }],
    queryFn: () => getBusinesses({ q: trimmed, city, limit: 6 }),
    enabled: trimmed.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useRecommendations() {
  const { user, status } = useAuth();
  const city = user?.city;
  const categories: BusinessCategory[] = (user?.interests ?? []).slice(0, 3);
  const enabled = status !== "loading" && categories.length > 0;

  const results = useQueries({
    queries: categories.map((category) => ({
      queryKey: ["businesses", "interest", category, city],
      queryFn: () => getBusinesses({ category, city, limit: 4 }),
      enabled,
    })),
  });

  const data = useMemo(() => {
    const lists = categories.map((_, i) => results[i]?.data ?? []);
    const max = lists.reduce((acc, l) => Math.max(acc, l.length), 0);
    const out: Business[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < max; i += 1) {
      for (const list of lists) {
        const b = list[i];
        if (b && !seen.has(b.id)) {
          seen.add(b.id);
          out.push(b);
        }
      }
    }
    return out;
  }, [categories, results]);

  return {
    data,
    categories,
    enabled,
    isLoading: enabled && results.some((r) => r.isLoading),
    isError: enabled && results.every((r) => r.isError),
  };
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
