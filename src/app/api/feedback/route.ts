import { NextResponse } from "next/server";
import { API_URL } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  let res: Response;
  try {
    res = await fetch(`${API_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: body.name,
        rating: body.rating,
        message: body.message,
      }),
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
    const firstError = data?.errors
      ? (Object.values(data.errors) as string[][])[0]?.[0]
      : null;
    const message =
      res.status === 429
        ? "Too many messages. Please wait a minute."
        : firstError ?? data?.message ?? "Something went wrong.";
    return NextResponse.json({ error: message }, { status: res.status });
  }

  return NextResponse.json({ ok: true, message: data?.message });
}