import "server-only";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getDb } from "./db";
import type { BlogPost, BlogPostInput, PostStatus } from "./types";

/*
  Blog storage on Neon. Same shape as the Mikaelson Initiative's Studio
  (runtime CREATE TABLE IF NOT EXISTS, one statement per call because the
  HTTP driver runs one at a time), with three differences:
  - public reads only ever return published posts;
  - an update sets every editable field, so a cover can be removed;
  - published_at is set the first time a post is published.
*/

type Row = Record<string, unknown>;

let schemaReady: Promise<void> | null = null;

function ensureSchema() {
  const sql = getDb();
  if (!sql) return Promise.resolve();
  schemaReady ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'Essay',
        cover_image TEXT,
        cover_alt TEXT,
        author_name TEXT NOT NULL DEFAULT 'Mikaelson Group',
        author_role TEXT,
        body TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        published_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        seo_title TEXT,
        seo_description TEXT
      )`;
    await sql`CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (status, published_at DESC)`;
  })().catch((err) => {
    schemaReady = null; // retry on the next call
    throw err;
  });
  return schemaReady;
}

function iso(v: unknown): string | null {
  if (!v) return null;
  return v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString();
}

function toPost(r: Row): BlogPost {
  return {
    id: String(r.id),
    slug: String(r.slug),
    title: String(r.title),
    excerpt: String(r.excerpt ?? ""),
    category: String(r.category ?? "Essay"),
    coverImage: (r.cover_image as string | null) ?? null,
    coverAlt: (r.cover_alt as string | null) ?? null,
    authorName: String(r.author_name ?? "Mikaelson Group"),
    authorRole: (r.author_role as string | null) ?? null,
    body: String(r.body ?? ""),
    status: r.status === "published" ? "published" : "draft",
    publishedAt: iso(r.published_at),
    updatedAt: iso(r.updated_at) ?? new Date().toISOString(),
    seoTitle: (r.seo_title as string | null) ?? null,
    seoDescription: (r.seo_description as string | null) ?? null,
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Thrown for problems the editor can fix (bad input, duplicate slug). */
export class BlogInputError extends Error {}

function requireDb() {
  const sql = getDb();
  if (!sql) throw new Error("No database configured: set DATABASE_URL.");
  return sql;
}

/* ── Public reads (published only; never throw, so pages still render) ── */

export async function getPublishedPosts(limit = 100): Promise<BlogPost[]> {
  const sql = getDb();
  if (!sql) return [];
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT * FROM blog_posts WHERE status = 'published'
      ORDER BY published_at DESC NULLS LAST LIMIT ${limit}`;
    return rows.map(toPost);
  } catch (err) {
    console.error("getPublishedPosts failed", err);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const sql = getDb();
  if (!sql) return null;
  try {
    await ensureSchema();
    const rows = await sql`
      SELECT * FROM blog_posts WHERE slug = ${slug.toLowerCase()} AND status = 'published' LIMIT 1`;
    return rows[0] ? toPost(rows[0]) : null;
  } catch (err) {
    console.error("getPublishedPost failed", err);
    return null;
  }
}

/* ── Studio (editors only; callers must check the session) ── */

export async function getAllPostsForStudio(): Promise<BlogPost[]> {
  const sql = requireDb();
  await ensureSchema();
  const rows = await sql`SELECT * FROM blog_posts ORDER BY COALESCE(published_at, updated_at) DESC`;
  return rows.map(toPost);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const sql = requireDb();
  await ensureSchema();
  const rows = await sql`SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1`;
  return rows[0] ? toPost(rows[0]) : null;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const opt = (v: unknown, max: number) => str(v, max) || null;

/** Validates and normalises editor input. */
export function parsePostInput(raw: unknown): BlogPostInput {
  const d = (raw ?? {}) as Record<string, unknown>;
  const title = str(d.title, 200);
  if (!title) throw new BlogInputError("Give the post a title.");
  const slug = slugify(str(d.slug, 120) || title);
  if (!slug) throw new BlogInputError("The slug must contain letters or numbers.");
  const status: PostStatus = d.status === "published" ? "published" : "draft";
  const coverImage = opt(d.coverImage, 1000);
  if (coverImage && !/^https:\/\//.test(coverImage)) {
    throw new BlogInputError("The cover image must be an https:// address.");
  }
  return {
    title,
    slug,
    status,
    excerpt: str(d.excerpt, 400),
    category: str(d.category, 60) || "Essay",
    coverImage,
    coverAlt: opt(d.coverAlt, 300),
    authorName: str(d.authorName, 120) || "Mikaelson Group",
    authorRole: opt(d.authorRole, 120),
    body: typeof d.body === "string" ? d.body.slice(0, 200_000) : "",
    seoTitle: opt(d.seoTitle, 200),
    seoDescription: opt(d.seoDescription, 320),
  };
}

function isUniqueViolation(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}

function revalidateBlog(...slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const s of slugs) revalidatePath(`/blog/${s}`);
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const sql = requireDb();
  await ensureSchema();
  const id = `post_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
  try {
    const rows = await sql`
      INSERT INTO blog_posts (id, slug, title, excerpt, category, cover_image, cover_alt, author_name,
        author_role, body, status, published_at, seo_title, seo_description)
      VALUES (${id}, ${input.slug}, ${input.title}, ${input.excerpt}, ${input.category}, ${input.coverImage},
        ${input.coverAlt}, ${input.authorName}, ${input.authorRole}, ${input.body}, ${input.status},
        ${input.status === "published" ? new Date().toISOString() : null}, ${input.seoTitle}, ${input.seoDescription})
      RETURNING *`;
    const post = toPost(rows[0]);
    revalidateBlog(post.slug);
    return post;
  } catch (err) {
    if (isUniqueViolation(err)) throw new BlogInputError(`Another post already uses the slug “${input.slug}”.`);
    throw err;
  }
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogPost | null> {
  const sql = requireDb();
  await ensureSchema();
  const before = await getPostById(id);
  if (!before) return null;
  try {
    const rows = await sql`
      UPDATE blog_posts SET
        slug = ${input.slug}, title = ${input.title}, excerpt = ${input.excerpt}, category = ${input.category},
        cover_image = ${input.coverImage}, cover_alt = ${input.coverAlt}, author_name = ${input.authorName},
        author_role = ${input.authorRole}, body = ${input.body}, status = ${input.status},
        published_at = CASE WHEN ${input.status} = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END,
        seo_title = ${input.seoTitle}, seo_description = ${input.seoDescription}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *`;
    const post = toPost(rows[0]);
    revalidateBlog(before.slug, post.slug);
    return post;
  } catch (err) {
    if (isUniqueViolation(err)) throw new BlogInputError(`Another post already uses the slug “${input.slug}”.`);
    throw err;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  const sql = requireDb();
  await ensureSchema();
  const rows = await sql`DELETE FROM blog_posts WHERE id = ${id} RETURNING slug`;
  if (!rows[0]) return false;
  revalidateBlog(String(rows[0].slug));
  return true;
}

