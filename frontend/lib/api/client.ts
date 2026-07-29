import { clearAuthSession, getAccessToken } from "@/lib/auth/session";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL não configurado");
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = getAccessToken();
    if (!token) {
      clearAuthSession();
      throw new ApiError("Não autorizado", 401);
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 401) {
    clearAuthSession();
    throw new ApiError("Não autorizado", 401);
  }

  if (!response.ok) {
    let message = "Erro na requisição";
    try {
      const data = await response.json();
      message = data.error || data.message || message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
