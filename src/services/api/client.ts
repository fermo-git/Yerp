/**
 * Cliente base de API. Hoy no se usa directamente (los services leen mocks),
 * pero queda listo para el día que el backend Express esté disponible:
 * basta con que cada función de services/api haga `apiClient.get(...)`
 * en vez de devolver el mock.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Error ${res.status} al llamar ${path}`);
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
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

/** Simula latencia de red para que los skeleton loaders sean visibles con mocks. */
export const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
