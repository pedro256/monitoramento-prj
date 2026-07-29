"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AuthSession,
  AuthUser,
  clearAuthSession,
  getAuthSession,
  isAuthSessionValid,
  setAuthSession,
} from "@/lib/auth/session";
import { login as loginRequest, register as registerRequest } from "@/lib/api/auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = getAuthSession();
    if (isAuthSessionValid(stored)) {
      setSession(stored);
    } else {
      clearAuthSession();
      setSession(null);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await loginRequest(email, password);
    setAuthSession(nextSession);
    setSession(nextSession);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const nextSession = await registerRequest(name, email, password);
    setAuthSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
    router.push("/auth");
  }, [router]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      loading,
      login,
      register,
      logout,
    }),
    [session, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
