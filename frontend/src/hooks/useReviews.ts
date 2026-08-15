import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, getReviews } from "@/services/api/reviews";
import type { CreateReviewInput } from "@/types/business";

export function useReviews(businessId: string) {
  return useQuery({
    queryKey: ["reviews", "list", businessId],
    queryFn: () => getReviews(businessId),
    enabled: Boolean(businessId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ businessId, input }: { businessId: string; input: CreateReviewInput }) =>
      createReview(businessId, input),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "list", vars.businessId] });
    },
  });
}
