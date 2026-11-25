import { cache } from "react";
import { cookies } from "next/headers";

export const COOKIE_NAME = "token";
export const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000/api";

export type Session = {
  role: "admin" | "employee";
  id: string;
  name: string;
  email: string | null;
  loginId: string | null;
  jobTitle: string | null;
};

export async function getToken() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

// Asks Laravel who the token belongs to. Cached per request, so calling it
// from the layout and the page costs only one API call.
export const getSession = cache(async (): Promise<Session | null> => {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null; // expired or revoked token

    const { user } = await res.json();
    if (user?.role !== "admin" && user?.role !== "employee") return null;

    return {
      role: user.role,
      id: String(user.id),
      name: user.name,
      email: user.email ?? null,
      loginId: user.login_id ?? null,
      jobTitle: user.job_title ?? null,
    };
  } catch {
    return null; // backend unreachable
  }
});

export async function isAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}