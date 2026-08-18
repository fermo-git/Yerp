import { apiClient } from "@/services/api/client";

export type AdminBusinessStatus = "ACTIVE" | "ARCHIVED";

export interface AdminOwner {
  id: string;
  name: string;
  email: string;
}

export interface AdminBusiness {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: AdminBusinessStatus;
  featured: boolean;
  city: string;
  avgRating: number;
  reviewCount: number;
  coverImageUrl: string;
  createdAt: string;
  owner: AdminOwner | null;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null } | null;
  business: { id: string; slug: string; name: string } | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  city: string;
  role: "USER" | "BUSINESS_OWNER" | "ADMIN";
  isActive: boolean;
  businessCount: number;
  createdAt: string;
}

export interface AdminStats {
  users: { total: number; active: number };
  businesses: { total: number; ACTIVE: number; PENDING: number; ARCHIVED: number };
  reviews: { total: number };
  marketplace: { total: number };
  recentBusinesses: AdminBusiness[];
  recentReviews: AdminReview[];
  recentUsers: AdminRecentUser[];
}

export interface AdminRecentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  city: string;
  role: "USER" | "BUSINESS_OWNER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
}

export interface AdminBusinessFilters {
  city?: string;
  category?: string;
  status?: string;
  q?: string;
}

export interface AdminUserFilters {
  q?: string;
  role?: string;
  city?: string;
}

function buildQuery(params?: object): string {
  const p = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === "string" && v) p.set(k, v);
    }
  }
  const qs = p.toString();
  return qs ? `?${qs}` : "";
}

export function getAdminStats(): Promise<AdminStats> {
  return apiClient.get<AdminStats>("/admin/stats");
}

export function getAdminBusinesses(
  filters?: AdminBusinessFilters
): Promise<AdminBusiness[]> {
  return apiClient.get<AdminBusiness[]>(
    `/admin/businesses${buildQuery(filters)}`
  );
}

export function updateAdminBusiness(
  id: string,
  patch: Partial<{ status: AdminBusinessStatus; featured: boolean }>
): Promise<{ id: string; status: AdminBusinessStatus; featured: boolean }> {
  return apiClient.patch(`/admin/businesses/${id}`, patch);
}

export function deleteAdminBusiness(id: string): Promise<{ deleted: boolean }> {
  return apiClient.delete(`/admin/businesses/${id}`);
}

export function getAdminReviews(params?: { q?: string; rating?: string }): Promise<AdminReview[]> {
  return apiClient.get<AdminReview[]>(`/admin/reviews${buildQuery(params)}`);
}

export function deleteAdminReview(id: string): Promise<{ deleted: boolean }> {
  return apiClient.delete(`/admin/reviews/${id}`);
}

export function getAdminUsers(filters?: AdminUserFilters): Promise<AdminUser[]> {
  return apiClient.get<AdminUser[]>(`/admin/users${buildQuery(filters)}`);
}

export function updateAdminUser(
  id: string,
  patch: Partial<{ role: "USER" | "BUSINESS_OWNER"; isActive: boolean }>
): Promise<{ id: string; role: string; isActive: boolean }> {
  return apiClient.patch(`/admin/users/${id}`, patch);
}
