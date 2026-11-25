import { NextResponse } from "next/server";
import { API_URL, COOKIE_NAME, getToken } from "@/lib/auth";

export async function POST() {
  const token = await getToken();

  // Delete the token in Laravel too, so it cannot be reused
  if (token) {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    }).catch(() => {});
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}