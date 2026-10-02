import { cookies } from "next/headers";
import { STUDIO_COOKIE, isValidSession, studioConfigured } from "@/lib/studio-auth";
import { StudioClient } from "./studio-client";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const token = (await cookies()).get(STUDIO_COOKIE)?.value;
  return <StudioClient initialAuthenticated={isValidSession(token)} configured={studioConfigured()} />;
}
