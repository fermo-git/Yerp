import type { CreateReviewInput, Review } from "@/types/business";
import { apiClient } from "@/services/api/client";

export async function getReviews(businessId: string): Promise<Review[]> {
  return apiClient.get<Review[]>(`/businesses/${businessId}/reviews`);
}

export async function createReview(businessId: string, input: CreateReviewInput): Promise<Review> {
  return apiClient.post<Review>(`/businesses/${businessId}/reviews`, {
    rating: input.rating,
    comment: input.comment,
  });
}
