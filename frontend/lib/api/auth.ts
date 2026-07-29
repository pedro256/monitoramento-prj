import { apiFetch } from "@/lib/api/client";
import type { AuthSession, AuthUser } from "@/lib/auth/session";

type LoginResponse = {
  accessToken: string;
  expiresAt: number;
  user: AuthUser;
};

type RegisterResponse = {
  message: string;
  accessToken: string;
  expiresAt: number;
  user: AuthUser;
};

export async function login(email: string, password: string): Promise<AuthSession> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password },
  });

  return {
    accessToken: data.accessToken,
    expiresAt: data.expiresAt,
    user: data.user,
  };
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthSession> {
  const data = await apiFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    auth: false,
    body: { name, email, password },
  });

  return {
    accessToken: data.accessToken,
    expiresAt: data.expiresAt,
    user: data.user,
  };
}

export async function fetchRealtimeToken(organizationId: string) {
  return apiFetch<{ token: string }>("/realtime-token", {
    method: "POST",
    body: organizationId,
  });
}
