import { NextResponse } from "next/server";
import { API_URL, COOKIE_NAME } from "@/lib/auth";

// Removes spaces and invisible characters that copy-paste or autofill can add
function clean(value: unknown) {
  return typeof value === "string"
    ? value
        .normalize("NFKC")
        .replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF\u00A0]/g, "")
        .trim()
    : "";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const identifier = clean(body.identifier);
  const password = clean(body.password);

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Enter your ID and password" },
      { status: 422 }
    );
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ identifier, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the server. Please try again." },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      res.status === 429
        ? "Too many attempts. Wait a minute and try again."
        : data?.message ?? "Invalid ID or password";
    return NextResponse.json({ error: message }, { status: res.status });
  }

  const out = NextResponse.json({ ok: true, role: data.user.role });
  out.cookies.set(COOKIE_NAME, data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // same 8 hours as the Laravel token
  });
  return out;
}