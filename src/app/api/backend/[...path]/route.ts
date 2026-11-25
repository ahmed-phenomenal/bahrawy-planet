import { NextResponse } from "next/server";
import { API_URL, getToken } from "@/lib/auth";

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(req: Request, ctx: Ctx) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  }

  const { path } = await ctx.params;
  if (path.some((p) => p === ".." || p === "." || p.includes("/"))) {
    return NextResponse.json({ message: "Bad path" }, { status: 400 });
  }

  const search = new URL(req.url).search;
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "DELETE") {
    const type = req.headers.get("content-type") ?? "";
    if (type.includes("multipart/form-data")) {
      body = await req.formData(); // fetch sets the boundary itself
    } else {
      body = await req.text();
      headers["Content-Type"] = "application/json";
    }
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/${path.join("/")}${search}`, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the server. Please try again." },
      { status: 502 }
    );
  }

  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE };