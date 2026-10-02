import { NextResponse, type NextRequest } from "next/server";
import { BlogInputError, deletePost, getPostById, parsePostInput, updatePost } from "@/lib/blog";
import { isStudioRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const unauthorized = () => NextResponse.json({ error: "Sign in to the Studio first." }, { status: 401 });
const notFound = () => NextResponse.json({ error: "That post no longer exists." }, { status: 404 });

export async function GET(request: NextRequest, { params }: Ctx) {
  if (!isStudioRequest(request)) return unauthorized();
  const post = await getPostById((await params).id);
  return post ? NextResponse.json({ post }) : notFound();
}

/** Replace a post's editable fields. */
export async function PUT(request: NextRequest, { params }: Ctx) {
  if (!isStudioRequest(request)) return unauthorized();
  try {
    const post = await updatePost((await params).id, parsePostInput(await request.json()));
    return post ? NextResponse.json({ post }) : notFound();
  } catch (err) {
    if (err instanceof BlogInputError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Could not save the post." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  if (!isStudioRequest(request)) return unauthorized();
  try {
    return (await deletePost((await params).id)) ? NextResponse.json({ ok: true }) : notFound();
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete the post." }, { status: 500 });
  }
}
