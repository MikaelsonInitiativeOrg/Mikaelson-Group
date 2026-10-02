import { NextResponse, type NextRequest } from "next/server";
import {
  STUDIO_COOKIE,
  STUDIO_SESSION_SECONDS,
  checkPasskey,
  createSessionToken,
  isStudioRequest,
  studioConfigured,
} from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

/** Is this browser signed in? */
export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isStudioRequest(request), configured: studioConfigured() });
}

/** Sign in with the team passkey. */
export async function POST(request: NextRequest) {
  if (!studioConfigured()) {
    return NextResponse.json({ error: "The Studio is not set up yet: STUDIO_ADMIN_PASSKEY is missing." }, { status: 503 });
  }
  const body = (await request.json().catch(() => ({}))) as { passkey?: unknown };
  if (!checkPasskey(body.passkey)) {
    // A short, fixed delay makes guessing slower without a rate-limit store.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "That passkey is not correct." }, { status: 401 });
  }
  const res = NextResponse.json({ authenticated: true });
  res.cookies.set(STUDIO_COOKIE, createSessionToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: STUDIO_SESSION_SECONDS,
  });
  return res;
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(STUDIO_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
