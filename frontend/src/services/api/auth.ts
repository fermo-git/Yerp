import type { BusinessCategory } from "@/types/business";
import type {
  AuthResponse,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  UpdateMeInput,
  User,
} from "@/types/user";
import {
  apiClient,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./client";

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/register", input);
  setAccessToken(res.accessToken);
  return res;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>("/auth/login", input);
  setAccessToken(res.accessToken);
  return res;
}

export async function loginWithGoogle(_input: GoogleLoginInput): Promise<AuthResponse> {
  throw new Error("Google OAuth no disponible aún");
}

export async function logout(): Promise<void> {
  clearAccessToken();
}

export async function getMe(): Promise<User | null> {
  if (!getAccessToken()) return null;
  try {
    const { user } = await apiClient.get<{ user: User }>("/auth/me");
    return user;
  } catch {
    clearAccessToken();
    return null;
  }
}

export async function updateMe(input: UpdateMeInput): Promise<User | null> {
  const { user } = await apiClient.patch<{ user: User }>("/users/me", input);
  return user;
}

/** Promueve USER → BUSINESS_OWNER. El backend nunca permite ADMIN desde aquí. */
export async function upgradeToOwner(): Promise<User | null> {
  const { user } = await apiClient.post<{ user: User }>("/users/me/upgrade-to-owner", {});
  return user;
}

/**
 * Sube la foto de perfil (multipart, campo "avatar") y devuelve la URL pública.
 * La URL se persiste después con updateMe({ avatarUrl: url }).
 */
export async function uploadAvatarImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("avatar", file, file.name);
  const { url } = await apiClient.upload<{ url: string }>("/users/me/avatar", form);
  return url;
}

export async function setMyInterests(
  categories: BusinessCategory[]
): Promise<BusinessCategory[]> {
  const { interests } = await apiClient.put<{ interests: BusinessCategory[] }>(
    "/users/me/interests",
    { categories }
  );
  return interests;
}

export async function getMyInterests(): Promise<BusinessCategory[]> {
  const { interests } = await apiClient.get<{ interests: BusinessCategory[] }>(
    "/users/me/interests"
  );
  return interests;
}
