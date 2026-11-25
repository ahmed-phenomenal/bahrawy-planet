import { API_URL, getToken } from "@/lib/auth";

type Init = Omit<RequestInit, "headers"> & { headers?: Record<string, string> };

// Server-side fetch to Laravel. Adds the token from the cookie automatically.
export async function apiFetch(path: string, init: Init = {}) {
  const token = await getToken();
  const isJsonBody = init.body !== undefined && !(init.body instanceof FormData);

  return fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      Accept: "application/json",
      ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
}