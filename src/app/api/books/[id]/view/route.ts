import { NextResponse } from "next/server";
import { API_URL } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

// The browser tells us a book was opened for the first time: forward it to Laravel
export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ message: "Bad id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/books/${id}/view`, {
      method: "POST",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}