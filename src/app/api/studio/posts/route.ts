import { NextResponse, type NextRequest } from "next/server";
import { BlogInputError, createPost, getAllPostsForStudio, parsePostInput } from "@/lib/blog";
import { isStudioRequest } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Sign in to the Studio first." }, { status: 401 });

/** Every post, drafts included. */
export async function GET(request: NextRequest) {
  if (!isStudioRequest(request)) return unauthorized();
  try {
    return NextResponse.json({ posts: await getAllPostsForStudio() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not load posts from the database." }, { status: 500 });
  }
}

/** Create a post. */
export async function POST(request: NextRequest) {
  if (!isStudioRequest(request)) return unauthorized();
  try {
    const post = await createPost(parsePostInput(await request.json()));
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    if (err instanceof BlogInputError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Could not save the post." }, { status: 500 });
  }
}
