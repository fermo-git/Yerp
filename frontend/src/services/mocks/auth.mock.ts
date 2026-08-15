import type { AuthTokens, User } from "@/types/user";

const SESSION_KEY = "la-frontera:session";

export interface StoredSession {
  user: User;
  tokens: AuthTokens;
}

export const MOCK_GOOGLE_PROFILE = {
  name: "María López",
  email: "maria.lopez@gmail.com",
  avatarUrl: "https://i.pravatar.cc/150?img=47",
};

const makeId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: makeId("usr"),
    email: "",
    name: "",
    role: "USER",
    isActive: true,
    city: "TIJUANA",
    interests: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function makeTokens(): AuthTokens {
  return {
    accessToken: `at_${makeId("")}`,
    refreshToken: `rt_${makeId("")}`,
  };
}

export function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
