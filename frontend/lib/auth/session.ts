const AUTH_STORAGE_KEY = "monitoramento.auth";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthSession = {
  accessToken: string;
  expiresAt: number;
  user: AuthUser;
};

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session.accessToken || !session.expiresAt || !session.user?.id) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthSessionValid(session: AuthSession | null) {
  if (!session) return false;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return session.expiresAt - nowInSeconds > 30;
}

export function getAccessToken() {
  const session = getAuthSession();
  if (!isAuthSessionValid(session)) return null;
  return session!.accessToken;
}
