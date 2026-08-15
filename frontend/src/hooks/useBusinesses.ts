import { useQuery } from "@tanstack/react-query";
import {
  getFeaturedBusinesses,
  getBusinesses,
  getBusinessBySlug,
  getRecentActivity,
  getBorderWidgets,
} from "@/services/api/businesses";

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
