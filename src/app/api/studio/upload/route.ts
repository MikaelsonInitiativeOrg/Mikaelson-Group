import { put } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { isStudioRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

/*
  Image upload to the public Vercel Blob store "mikaelson-group-blog"
  (BLOB_READ_WRITE_TOKEN). SVG is refused: a public SVG can carry script.
  4 MB keeps the request under Vercel's 4.5 MB function body limit.
*/
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!isStudioRequest(request)) {
    return NextResponse.json({ error: "Sign in to the Studio first." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Image storage is not set up: BLOB_READ_WRITE_TOKEN is missing." }, { status: 503 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });

  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF or AVIF image." }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That image is over 4 MB. Export a smaller version and try again." }, { status: 400 });
  }

  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "image";
  try {
    const blob = await put(`blog/${base}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "The upload failed. Try again in a moment." }, { status: 500 });
  }
}
