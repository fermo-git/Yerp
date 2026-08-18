import type { BorderCity, BusinessCategory } from "./business";

export type UserRole = "USER" | "BUSINESS_OWNER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  city: BorderCity;
  role: UserRole;
  isActive: boolean;
  favoriteCrossingId?: string;
  interests: BusinessCategory[];
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  phone?: string;
  city: BorderCity;
  // El registro solo permite elegir entre USER y BUSINESS_OWNER (nunca ADMIN).
  role?: "USER" | "BUSINESS_OWNER";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleLoginInput {
  idToken: string;
}

export interface UpdateMeInput {
  name?: string;
  phone?: string | null;
  city?: BorderCity;
  avatarUrl?: string | null;
  favoriteCrossingId?: string | null;
}
