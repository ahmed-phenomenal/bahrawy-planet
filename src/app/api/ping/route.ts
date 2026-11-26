import { NextResponse } from "next/server";
import { API_URL } from "@/lib/auth";

export const dynamic = "force-dynamic";

// TEMPORARY: shows why the server cannot reach Laravel. Delete this file afterwards.
export async function GET() {
  const target = `${API_URL}/categories`;
  try {
    const res = await fetch(target, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    return NextResponse.json({ target, status: res.status, ok: res.ok });
  } catch (e) {
    const err = e as Error & { cause?: { code?: string; message?: string } };
    return NextResponse.json(
      {
        target,
        error: err.message,
        code: err.cause?.code,
        cause: err.cause?.message,
      },
      { status: 502 }
    );
  }
}