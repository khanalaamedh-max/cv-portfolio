import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content-store";
import { requireAdmin } from "@/lib/auth";
import { defaultContent } from "@/lib/default-content";
import type { SiteContent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent().catch((error) => {
    console.error("Failed to load content:", error);
    return defaultContent;
  });

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

  try {
    const content = (await request.json()) as SiteContent;
    const saved = await saveContent(content);
    return NextResponse.json(saved);
  } catch (error) {
    let message = "Could not save. Try a smaller image, or check the Vercel server logs.";

    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      message =
        "MongoDB is not connected on Vercel. Add MONGODB_URI in Environment Variables, then redeploy.";
    }

    if (error instanceof Error && error.message.includes("MongoDB connection failed")) {
      message =
        "MongoDB connection failed. Check the Vercel MONGODB_URI value, rotate/update the database password, and allow 0.0.0.0/0 in MongoDB Atlas Network Access.";
    }

    console.error(error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
