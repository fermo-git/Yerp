import type { CreateReviewInput, Review } from "@/types/business";
import { MOCK_REVIEWS } from "@/services/mocks/reviews.mock";
import { mockDelay } from "@/services/api/client";

const reviews: Review[] = [...MOCK_REVIEWS];

export async function getReviews(businessId: string): Promise<Review[]> {
  await mockDelay();
  return reviews.filter((r) => r.businessId === businessId);
}

export async function createReview(businessId: string, input: CreateReviewInput): Promise<Review> {
  await mockDelay(400);
  const now = new Date().toISOString();
  const review: Review = {
    id: `rev_${Math.random().toString(36).slice(2, 10)}`,
    businessId,
    rating: input.rating,
    comment: input.comment,
    createdAt: now,
    updatedAt: now,
    user: { id: input.author.id, name: input.author.name, avatarUrl: input.author.avatarUrl },
  };
  reviews.unshift(review);
  return review;
}
