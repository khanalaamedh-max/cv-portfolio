import { NextResponse } from "next/server";
import { adminCredentials, createToken, safeCompare } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: string; password?: string };
  const credentials = adminCredentials();

  if (
    !safeCompare(body.id || "", credentials.id) ||
    !safeCompare(body.password || "", credentials.password)
  ) {
    return NextResponse.json(
      { message: "Invalid admin ID or password." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token: createToken({ sub: credentials.id, role: "admin" })
  });
}
