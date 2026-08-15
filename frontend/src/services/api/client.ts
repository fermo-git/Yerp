/**
 * Cliente base de API. Lee VITE_API_URL, adjunta el access token almacenado
 * y desenvuelve el campo `data` del envelope REST del backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

const TOKEN_KEY = "la-frontera:token";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Error ${res.status} al llamar ${path}`);
  }

  const json = await res.json();
  return json.data as T;
}

// Variante para multipart/form-data: no fija Content-Type (el navegador fija el
// boundary) y no serializa el cuerpo. Se usa para subida de archivos.
async function requestForm<T>(path: string, body: FormData): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error?.message ?? `Error ${res.status} al llamar ${path}`);
  }

  const json = await res.json();
  return json.data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, form: FormData) => requestForm<T>(path, form),
};

/** Simula latencia de red para los servicios que aún leen mocks. */
export const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
