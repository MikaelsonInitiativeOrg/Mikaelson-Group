"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { ArticleBody, formatDate, readingMinutes } from "@/lib/article";
import type { BlogPost, BlogPostInput, PostStatus } from "@/lib/types";

/*
  The editorial Studio: sign in → list of posts → editor.
  Calm on purpose (an app area, not the public site): no decorative motion.
*/

const FIELD =
  "w-full rounded-md border border-rule-strong bg-ground px-3 py-2.5 text-[16px] leading-normal text-heading placeholder:text-faint focus:border-accent focus:outline-none";
const LABEL = "meta mb-1.5 block text-muted";
const CATEGORIES = ["Essay", "Dispatch", "Framework notes", "Research", "Notice"];

const EMPTY: BlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  category: "Essay",
  coverImage: null,
  coverAlt: null,
  authorName: "Mikaelson Group",
  authorRole: null,
  body: "",
  status: "draft",
  seoTitle: null,
  seoDescription: null,
};

/** Editable fields, in the same key order as EMPTY so the dirty check can compare JSON. */
function toInput(p: BlogPost): BlogPostInput {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: p.coverImage,
    coverAlt: p.coverAlt,
    authorName: p.authorName,
    authorRole: p.authorRole,
    body: p.body,
    status: p.status,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
  };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...init?.headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status}).`);
  return data as T;
}

async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { url } = await api<{ url: string }>("/api/studio/upload", { method: "POST", body: form });
  return url;
}

/* ───────────────────────────── Sign in ───────────────────────────── */

function SignIn({ configured, onSignedIn }: { configured: boolean; onSignedIn: () => void }) {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/studio/auth", { method: "POST", body: JSON.stringify({ passkey }) });
      onSignedIn();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-[420px] py-10">
      <p className="meta">
        <span className="text-accent">MG/ST</span>
        <span className="mx-2 text-rule-strong">/</span>
        Editorial Studio
      </p>
      <h1 className="mt-4 text-[2.25rem] leading-tight">Sign in to write.</h1>
      {!configured ? (
        <p className="mt-6 border border-dashed border-rule-strong p-4 text-[0.9375rem]">
          The Studio is locked because no passkey is set. Add <code className="font-mono text-heading">STUDIO_ADMIN_PASSKEY</code>{" "}
          to the project&apos;s environment variables and redeploy.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="passkey" className={LABEL}>
              Team passkey
            </label>
            <input
              id="passkey"
              type="password"
              autoComplete="current-password"
              required
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className={FIELD}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "passkey-error" : undefined}
            />
            {error && (
              <p id="passkey-error" role="alert" className="mt-2 text-[0.875rem] text-accent">
                {error}
              </p>
            )}
          </div>
          <button type="submit" disabled={busy || !passkey} className={buttonClass("primary")}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}

/* ───────────────────────────── Post list ───────────────────────────── */

function StatusPill({ status }: { status: PostStatus }) {
  return status === "published" ? (
    <span className="meta inline-flex items-center gap-1.5 text-accent">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      Published
    </span>
  ) : (
    <span className="meta inline-flex items-center gap-1.5">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full border border-faint" />
      Draft
    </span>
  );
}

function PostIndex({
  posts,
  loading,
  error,
  onNew,
  onEdit,
  onSignOut,
}: {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  onNew: () => void;
  onEdit: (p: BlogPost) => void;
  onSignOut: () => void;
}) {
  const published = posts.filter((p) => p.status === "published").length;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-6">
        <div>
          <p className="meta">
            <span className="text-accent">MG/ST</span>
            <span className="mx-2 text-rule-strong">/</span>
            Editorial Studio
          </p>
          <h1 className="mt-3 text-[2.25rem] leading-tight">Posts</h1>
          <p className="meta mt-2">
            {posts.length} total · {published} published · {posts.length - published} drafts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onSignOut} className={buttonClass("ghost")}>
            Sign out
          </button>
          <button type="button" onClick={onNew} className={`${buttonClass("primary")} mb-0`}>
            New post
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 border border-dashed border-rule-strong p-4 text-[0.9375rem]">
          {error}
        </p>
      )}

      {loading ? (
        <p className="meta mt-10">Loading posts…</p>
      ) : posts.length === 0 && !error ? (
        <div className="mt-10 border border-dashed border-rule-strong px-5 py-12 text-center">
          <p className="font-serif text-[1.375rem] text-heading">No posts yet.</p>
          <p className="mt-2 text-[0.9375rem]">Start the first one; it stays a draft until you publish it.</p>
        </div>
      ) : (
        <ul className="mt-2">
          {posts.map((p) => (
            <li key={p.id} className="border-b border-rule">
              <button
                type="button"
                onClick={() => onEdit(p)}
                className="grid w-full gap-2 py-5 text-left hover:bg-surface sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:px-3"
              >
                <span className="sm:col-span-7">
                  <span className="block font-serif text-[1.25rem] leading-snug text-heading">{p.title}</span>
                  <span className="meta mt-1 block">/blog/{p.slug}</span>
                </span>
                <span className="meta sm:col-span-2">{p.category}</span>
                <span className="sm:col-span-3 sm:text-right">
                  <StatusPill status={p.status} />
                  <span className="meta block">{p.status === "published" ? formatDate(p.publishedAt) : `Edited ${formatDate(p.updatedAt)}`}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────────────────────── Editor ───────────────────────────── */

type View = "write" | "preview" | "split";

function Editor({
  post,
  onClose,
  onSaved,
  onDeleted,
}: {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: (p: BlogPost) => void;
  onDeleted: (id: string) => void;
}) {
  const [draft, setDraft] = useState<BlogPostInput>(post ? toInput(post) : EMPTY);
  const [saved, setSaved] = useState<BlogPost | null>(post);
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [view, setView] = useState<View>("write");
  const [busy, setBusy] = useState<null | "save" | "upload" | "delete">(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const inlineInput = useRef<HTMLInputElement>(null);

  const baseline = useMemo(() => JSON.stringify(saved ? toInput(saved) : EMPTY), [saved]);
  const dirty = JSON.stringify(draft) !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function setTitle(title: string) {
    setDraft((d) => ({ ...d, title, slug: slugTouched ? d.slug : slugify(title) }));
  }

  /** Wraps the selection in the body (or inserts a template at the cursor). */
  function format(before: string, after = "", placeholder = "") {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    set("body", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  }

  /** Starts a block (heading, quote, list) on its own paragraph. */
  function block(prefix: string, placeholder: string) {
    const el = bodyRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const lead = s > 0 && !el.value.slice(0, s).endsWith("\n\n") ? (el.value.slice(0, s).endsWith("\n") ? "\n" : "\n\n") : "";
    format(`${lead}${prefix}`, "", placeholder);
  }

  async function onUpload(file: File | undefined, target: "cover" | "inline") {
    if (!file) return;
    setBusy("upload");
    setNotice(null);
    try {
      const url = await uploadImage(file);
      if (target === "cover") {
        set("coverImage", url);
      } else {
        block(`![Describe the image](${url})`, "");
      }
      setNotice({ kind: "ok", text: "Image uploaded." });
    } catch (err) {
      setNotice({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function save(status: PostStatus) {
    setBusy("save");
    setNotice(null);
    const payload = { ...draft, status };
    try {
      const { post: result } = saved
        ? await api<{ post: BlogPost }>(`/api/studio/posts/${saved.id}`, { method: "PUT", body: JSON.stringify(payload) })
        : await api<{ post: BlogPost }>("/api/studio/posts", { method: "POST", body: JSON.stringify(payload) });
      setSaved(result);
      setDraft(toInput(result));
      setSlugTouched(true);
      onSaved(result);
      setNotice({
        kind: "ok",
        text:
          status === "published"
            ? saved?.status === "published"
              ? "Changes published."
              : "Published. It is now live on the blog."
            : saved?.status === "published"
              ? "Unpublished. It is now a draft and hidden from the blog."
              : "Draft saved.",
      });
    } catch (err) {
      setNotice({ kind: "error", text: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!saved || !window.confirm(`Delete “${saved.title}”? This cannot be undone.`)) return;
    setBusy("delete");
    try {
      await api(`/api/studio/posts/${saved.id}`, { method: "DELETE" });
      onDeleted(saved.id);
    } catch (err) {
      setNotice({ kind: "error", text: (err as Error).message });
      setBusy(null);
    }
  }

  function close() {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    onClose();
  }

  const isPublished = saved?.status === "published";
  const tool = "press rounded border border-rule px-2.5 py-1.5 font-mono text-[0.8125rem] text-muted hover:border-accent hover:text-heading";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-5">
        <button type="button" onClick={close} className="meta press text-muted hover:text-heading">
          ← All posts
        </button>
        <div className="flex items-center gap-4">
          {saved && <StatusPill status={saved.status} />}
          <span className="meta">{dirty ? "Unsaved changes" : saved ? "All changes saved" : "New post"}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-8">
          <div>
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              id="title"
              value={draft.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full border-0 border-b border-rule bg-transparent pb-3 font-serif text-[2rem] leading-tight text-heading placeholder:text-faint focus:border-accent focus:outline-none md:text-[2.5rem]"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className={LABEL}>
              Excerpt · shown in lists and search results
            </label>
            <textarea
              id="excerpt"
              rows={2}
              value={draft.excerpt}
              maxLength={400}
              onChange={(e) => set("excerpt", e.target.value)}
              className={FIELD}
            />
          </div>

          {/* Body */}
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Formatting">
                <button type="button" className={tool} onClick={() => block("## ", "Heading")}>H2</button>
                <button type="button" className={tool} onClick={() => block("### ", "Subheading")}>H3</button>
                <button type="button" className={tool} onClick={() => format("**", "**", "bold text")}>B</button>
                <button type="button" className={`${tool} italic`} onClick={() => format("*", "*", "italic text")}>I</button>
                <button type="button" className={tool} onClick={() => format("[", "](https://)", "link text")}>Link</button>
                <button type="button" className={tool} onClick={() => block("> ", "Quotation")}>Quote</button>
                <button type="button" className={tool} onClick={() => block("- ", "List item")}>List</button>
                <button type="button" className={tool} onClick={() => block("---\n\n", "")}>Rule</button>
                <button
                  type="button"
                  className={tool}
                  disabled={busy === "upload"}
                  onClick={() => inlineInput.current?.click()}
                >
                  {busy === "upload" ? "Uploading…" : "Image"}
                </button>
                <input
                  ref={inlineInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    void onUpload(e.target.files?.[0], "inline");
                    e.target.value = "";
                  }}
                />
              </div>
              <div className="flex rounded border border-rule p-0.5" role="tablist" aria-label="Editor view">
                {(["write", "preview", "split"] as View[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="tab"
                    aria-selected={view === v}
                    onClick={() => setView(v)}
                    className={`meta rounded px-2.5 py-1 capitalize ${v === "split" ? "hidden lg:block" : ""} ${
                      view === v ? "bg-surface-2 text-heading" : "hover:text-heading"
                    }`}
                  >
                    {v === "split" ? "Side by side" : v}
                  </button>
                ))}
              </div>
            </div>

            <div className={view === "split" ? "grid gap-4 lg:grid-cols-2" : ""}>
              {view !== "preview" && (
                <textarea
                  ref={bodyRef}
                  id="body"
                  aria-label="Body"
                  value={draft.body}
                  onChange={(e) => set("body", e.target.value)}
                  placeholder={"Write the post. Leave a blank line between paragraphs.\n\n## A heading\n\nA paragraph with **bold**, *italic* and a [link](https://example.com)."}
                  className={`${FIELD} min-h-[480px] font-mono text-[15px] leading-relaxed`}
                />
              )}
              {view !== "write" && (
                <div className="min-h-[480px] rounded-md border border-rule bg-surface p-5 md:p-8">
                  {draft.body.trim() ? <ArticleBody body={draft.body} /> : <p className="meta">Nothing to preview yet.</p>}
                </div>
              )}
            </div>
            <p className="meta mt-2">
              {draft.body.trim().split(/\s+/).filter(Boolean).length} words · {readingMinutes(draft.body)} min read
            </p>
          </div>
        </div>

        {/* Side column */}
        <aside className="space-y-6 lg:col-span-4">
          {/* Actions */}
          <div className="space-y-3 rounded-md border border-rule bg-surface p-5">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy !== null || !draft.title.trim()}
                onClick={() => save("published")}
                className={buttonClass("primary")}
              >
                {busy === "save" ? "Saving…" : isPublished ? "Update post" : "Publish"}
              </button>
              <button
                type="button"
                disabled={busy !== null || !draft.title.trim()}
                onClick={() => save("draft")}
                className={buttonClass("ghost")}
              >
                {isPublished ? "Unpublish" : "Save draft"}
              </button>
            </div>
            {notice && (
              <p role="status" className={`text-[0.875rem] ${notice.kind === "error" ? "text-accent" : "text-heading"}`}>
                {notice.text}
              </p>
            )}
            {isPublished && saved && (
              <a href={`/blog/${saved.slug}`} target="_blank" rel="noopener" className="meta block text-accent hover:underline">
                View on the blog ↗
              </a>
            )}
          </div>

          <div>
            <label htmlFor="slug" className={LABEL}>
              Address · /blog/…
            </label>
            <input
              id="slug"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className={`${FIELD} font-mono text-[15px]`}
            />
            {isPublished && saved && draft.slug !== saved.slug && (
              <p className="meta mt-1.5 text-accent">Changing a published address breaks links already shared.</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className={LABEL}>
              Category
            </label>
            <input id="category" list="categories" value={draft.category} onChange={(e) => set("category", e.target.value)} className={FIELD} />
            <datalist id="categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="author" className={LABEL}>
                Author
              </label>
              <input id="author" value={draft.authorName} onChange={(e) => set("authorName", e.target.value)} className={FIELD} />
            </div>
            <div>
              <label htmlFor="role" className={LABEL}>
                Role
              </label>
              <input
                id="role"
                value={draft.authorRole ?? ""}
                onChange={(e) => set("authorRole", e.target.value || null)}
                placeholder="Optional"
                className={FIELD}
              />
            </div>
          </div>

          {/* Cover */}
          <div>
            <p className={LABEL}>Cover image</p>
            {draft.coverImage ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.coverImage}
                  alt=""
                  className="mx-auto block h-auto max-h-[420px] w-auto max-w-full rounded-md border border-rule"
                />
                <label htmlFor="cover-alt" className={LABEL}>
                  Description (alt text and caption)
                </label>
                <input
                  id="cover-alt"
                  value={draft.coverAlt ?? ""}
                  onChange={(e) => set("coverAlt", e.target.value || null)}
                  className={FIELD}
                />
                <div className="flex gap-3">
                  <button type="button" className={buttonClass("ghost")} onClick={() => coverInput.current?.click()}>
                    Replace
                  </button>
                  <button type="button" className={buttonClass("ghost")} onClick={() => set("coverImage", null)}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={busy === "upload"}
                onClick={() => coverInput.current?.click()}
                className="press flex aspect-[16/9] w-full items-center justify-center rounded-md border border-dashed border-rule-strong text-[0.9375rem] text-muted hover:border-accent hover:text-heading"
              >
                {busy === "upload" ? "Uploading…" : "Upload a cover · JPEG, PNG, WebP · up to 4 MB"}
              </button>
            )}
            <input
              ref={coverInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
              onChange={(e) => {
                void onUpload(e.target.files?.[0], "cover");
                e.target.value = "";
              }}
            />
          </div>

          <details className="rounded-md border border-rule p-4">
            <summary className="meta cursor-pointer text-muted">Search appearance (optional)</summary>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="seo-title" className={LABEL}>
                  Search title
                </label>
                <input
                  id="seo-title"
                  value={draft.seoTitle ?? ""}
                  onChange={(e) => set("seoTitle", e.target.value || null)}
                  placeholder={draft.title}
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="seo-desc" className={LABEL}>
                  Search description
                </label>
                <textarea
                  id="seo-desc"
                  rows={3}
                  value={draft.seoDescription ?? ""}
                  onChange={(e) => set("seoDescription", e.target.value || null)}
                  placeholder={draft.excerpt}
                  className={FIELD}
                />
              </div>
            </div>
          </details>

          {saved && (
            <button
              type="button"
              onClick={remove}
              disabled={busy !== null}
              className="meta press text-faint underline-offset-4 hover:text-accent hover:underline"
            >
              {busy === "delete" ? "Deleting…" : "Delete this post"}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ───────────────────────────── Shell ───────────────────────────── */

export function StudioClient({ initialAuthenticated, configured }: { initialAuthenticated: boolean; configured: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<BlogPost | null | undefined>(undefined); // undefined = list

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts } = await api<{ posts: BlogPost[] }>("/api/studio/posts");
      setPosts(posts);
    } catch (err) {
      const message = (err as Error).message;
      if (message.startsWith("Sign in")) setAuthenticated(false);
      else setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) void load();
  }, [authenticated, load]);

  async function signOut() {
    await api("/api/studio/auth", { method: "DELETE" }).catch(() => {});
    setAuthenticated(false);
    setPosts([]);
  }

  if (!authenticated) return <SignIn configured={configured} onSignedIn={() => setAuthenticated(true)} />;

  if (editing !== undefined) {
    return (
      <Editor
        key={editing?.id ?? "new"}
        post={editing}
        onClose={() => setEditing(undefined)}
        onSaved={(p) => setPosts((all) => [p, ...all.filter((x) => x.id !== p.id)])}
        onDeleted={(id) => {
          setPosts((all) => all.filter((x) => x.id !== id));
          setEditing(undefined);
        }}
      />
    );
  }

  return (
    <PostIndex
      posts={posts}
      loading={loading}
      error={error}
      onNew={() => setEditing(null)}
      onEdit={(p) => setEditing(p)}
      onSignOut={signOut}
    />
  );
}
