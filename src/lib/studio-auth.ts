import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/*
  Studio sign-in: one shared team passkey (STUDIO_ADMIN_PASSKEY), as on the
  Mikaelson Initiative site. The session cookie is "<expiry>.<signature>",
  where the signature is an HMAC of the expiry keyed by the passkey, so
  sessions expire on their own and changing the passkey signs everyone out.
  With no passkey set, the Studio stays locked.
*/

export const STUDIO_COOKIE = "mg_studio_session";
export const STUDIO_SESSION_SECONDS = 14 * 24 * 60 * 60;

function passkey() {
  const v = process.env.STUDIO_ADMIN_PASSKEY?.trim();
  return v || null;
}

export function studioConfigured() {
  return passkey() !== null;
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function sign(key: string, expiry: number) {
  return createHmac("sha256", key).update(`mikaelson-group-studio:v1:${expiry}`).digest("hex");
}

export function checkPasskey(attempt: unknown) {
  const key = passkey();
  return Boolean(key) && typeof attempt === "string" && safeEqual(attempt.trim(), key!);
}

/** A fresh session token, or null when the Studio is not configured. */
export function createSessionToken() {
  const key = passkey();
  if (!key) return null;
  const expiry = Math.floor(Date.now() / 1000) + STUDIO_SESSION_SECONDS;
  return `${expiry}.${sign(key, expiry)}`;
}

export function isValidSession(token: string | undefined) {
  const key = passkey();
  if (!key || !token) return false;
  const [exp, sig] = token.split(".");
  const expiry = Number(exp);
  if (!Number.isInteger(expiry) || expiry < Date.now() / 1000 || !sig) return false;
  return safeEqual(sig, sign(key, expiry));
}

export function isStudioRequest(request: NextRequest) {
  return isValidSession(request.cookies.get(STUDIO_COOKIE)?.value);
}
