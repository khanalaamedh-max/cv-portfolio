import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content-store";
import { requireAdmin } from "@/lib/auth";
import type { SiteContent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export async function PUT(request: Request) {
  if (!requireAdmin(request.headers.get("authorization"))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const content = (await request.json()) as SiteContent;
  const saved = await saveContent(content);
  return NextResponse.json(saved);
}
