import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/services/api/auth";
import type {
  AuthResponse,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  UpdateMeInput,
  User,
} from "@/types/user";
import type { BusinessCategory } from "@/types/business";
import { queryClient } from "@/lib/queryClient";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<AuthResponse>;
  register: (input: RegisterInput) => Promise<AuthResponse>;
  loginWithGoogle: (input: GoogleLoginInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateMe: (input: UpdateMeInput) => Promise<void>;
  setInterests: (categories: BusinessCategory[]) => Promise<void>;
  upgradeToOwner: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let active = true;
    authApi.getMe().then((u) => {
      if (!active) return;
      setUser(u);
      setStatus(u ? "authenticated" : "unauthenticated");
    });
    return () => {
      active = false;
    };
  }, []);

 const apply = useCallback((res: AuthResponse) => {
    queryClient.clear();
    setUser(res.user);
    setStatus("authenticated");
    return res;
  }, []);

  const login = useCallback(
    async (input: LoginInput) => apply(await authApi.login(input)),
    [apply]
  );

  const register = useCallback(
    async (input: RegisterInput) => apply(await authApi.register(input)),
    [apply]
  );

  const loginWithGoogle = useCallback(
    async (input: GoogleLoginInput) => apply(await authApi.loginWithGoogle(input)),
    [apply]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    queryClient.clear();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const updateMe = useCallback(async (input: UpdateMeInput) => {
    const u = await authApi.updateMe(input);
    if (u) setUser(u);
  }, []);

  const setInterests = useCallback(async (categories: BusinessCategory[]) => {
    await authApi.setMyInterests(categories);
    setUser((prev) => (prev ? { ...prev, interests: categories } : prev));
  }, []);

  const upgradeToOwner = useCallback(async () => {
    const u = await authApi.upgradeToOwner();
    if (u) setUser(u);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      register,
      loginWithGoogle,
      logout,
      updateMe,
      setInterests,
      upgradeToOwner,
    }),
    [user, status, login, register, loginWithGoogle, logout, updateMe, setInterests, upgradeToOwner]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
