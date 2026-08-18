import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminBusiness,
  deleteAdminReview,
  getAdminBusinesses,
  getAdminReviews,
  getAdminStats,
  getAdminUsers,
  updateAdminBusiness,
  updateAdminUser,
  type AdminBusinessFilters,
  type AdminUserFilters,
} from "@/services/api/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  });
}

export function useAdminBusinesses(filters: AdminBusinessFilters) {
  return useQuery({
    queryKey: ["admin", "businesses", filters],
    queryFn: () => getAdminBusinesses(filters),
    placeholderData: (prev) => prev,
  });
}

export function useAdminBusinessActions() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    void queryClient.invalidateQueries({ queryKey: ["businesses"] });
  };

  const update = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Parameters<typeof updateAdminBusiness>[1];
    }) => updateAdminBusiness(id, patch),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAdminBusiness(id),
    onSuccess: invalidate,
  });

  return { update, remove };
}

export function useAdminReviews(params: { q?: string; rating?: string }) {
  return useQuery({
    queryKey: ["admin", "reviews", params],
    queryFn: () => getAdminReviews(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminReviewActions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminReview(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      void queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });
}

export function useAdminUsers(filters: AdminUserFilters) {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => getAdminUsers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useAdminUserActions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Parameters<typeof updateAdminUser>[1];
    }) => updateAdminUser(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
