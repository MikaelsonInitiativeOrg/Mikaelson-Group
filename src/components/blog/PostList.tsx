import Link from "next/link";
import { CoverImage } from "@/components/blog/CoverImage";
import { formatDate, readingMinutes } from "@/lib/article";
import type { BlogPost } from "@/lib/types";

function Meta({ post }: { post: BlogPost }) {
  return (
    <p className="meta">
      <span className="text-accent">{post.category}</span>
      <span className="mx-2 text-rule-strong">·</span>
      <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
      <span className="mx-2 text-rule-strong">·</span>
      {readingMinutes(post.body)} min read
    </p>
  );
}

/** The newest post, given room. */
export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden border border-rule bg-surface md:grid-cols-12"
      data-reveal
    >
      {post.coverImage && (
        <div className="relative aspect-[16/10] border-b border-rule md:col-span-7 md:aspect-auto md:min-h-[380px] md:border-b-0 md:border-r">
          <CoverImage src={post.coverImage} alt={post.coverAlt ?? ""} sizes="(min-width: 768px) 60vw, 100vw" priority />
        </div>
      )}
      <div className={`flex flex-col p-6 md:p-10 ${post.coverImage ? "md:col-span-5" : "md:col-span-12"}`}>
        <p className="meta mb-4">Latest</p>
        <Meta post={post} />
        <h2 className="mt-4 text-[1.875rem] leading-[1.12] tracking-[-0.015em] transition-colors duration-150 group-hover:text-accent md:text-[2.25rem]">
          {post.title}
        </h2>
        {post.excerpt && <p className="mt-4 max-w-[56ch]">{post.excerpt}</p>}
        <p className="meta mt-auto pt-8 text-heading">
          {post.authorName}
          {post.authorRole && <span className="text-faint"> · {post.authorRole}</span>}
        </p>
      </div>
    </Link>
  );
}

/** Catalogue rows for every other post. */
export function PostRows({ posts }: { posts: BlogPost[] }) {
  return (
    <ol className="border-t border-rule">
      {posts.map((post, i) => (
        <li key={post.id} className="border-b border-rule" data-reveal style={{ "--i": i } as React.CSSProperties}>
          <Link href={`/blog/${post.slug}`} className="group grid gap-4 py-7 sm:grid-cols-12 sm:gap-8">
            {post.coverImage && (
              <div className="relative aspect-[16/10] overflow-hidden border border-rule sm:col-span-4">
                <CoverImage src={post.coverImage} alt={post.coverAlt ?? ""} sizes="(min-width: 640px) 30vw, 100vw" />
              </div>
            )}
            <div className={post.coverImage ? "sm:col-span-8" : "sm:col-span-12"}>
              <Meta post={post} />
              <h3 className="mt-3 text-[1.5rem] leading-tight transition-colors duration-150 group-hover:text-accent md:text-[1.75rem]">
                {post.title}
              </h3>
              {post.excerpt && <p className="mt-3 max-w-[64ch] text-[0.9375rem]">{post.excerpt}</p>}
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
