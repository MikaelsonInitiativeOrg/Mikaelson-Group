import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/blog/CoverImage";
import { Button } from "@/components/ui/Button";
import { ArticleBody, formatDate, readingMinutes } from "@/lib/article";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog";
import { LOGO_URL, OG_BASE, SITE_URL } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

/** Pre-render the published posts; any newer slug renders on first request. */
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  if (!post) return { title: "Post not found" };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  const path = `/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...OG_BASE,
      type: "article",
      url: path,
      title: `${title} · Mikaelson Group`,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      ...(post.coverImage ? { images: [{ url: post.coverImage, alt: post.coverAlt ?? title }] } : {}),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: "Mikaelson Group", logo: { "@type": "ImageObject", url: LOGO_URL } },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="mx-auto max-w-[1240px] px-4 pb-12 pt-14 md:px-8 md:pb-16 md:pt-24">
        <p className="meta">
          <Link href="/blog" className="text-accent hover:underline">
            MG/BL
          </Link>
          <span className="mx-2 text-rule-strong">/</span>
          {post.category}
        </p>
        <h1 className="mt-6 max-w-[22ch] text-[2.25rem] leading-[1.08] tracking-[-0.025em] sm:text-[3rem] lg:text-[3.75rem]">
          {post.title}
        </h1>
        {post.excerpt && <p className="prose-body mt-6 text-[1.1875rem]">{post.excerpt}</p>}
        <div className="meta mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-5">
          <span className="text-heading">
            {post.authorName}
            {post.authorRole && <span className="text-faint"> · {post.authorRole}</span>}
          </span>
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          <span>{readingMinutes(post.body)} min read</span>
        </div>
      </header>

      {post.coverImage && (
        <figure className="mx-auto mb-14 max-w-[1240px] px-4 md:px-8">
          <div className="relative aspect-[16/9] overflow-hidden border border-rule">
            <CoverImage src={post.coverImage} alt={post.coverAlt ?? ""} sizes="(min-width: 1240px) 1176px, 100vw" priority />
          </div>
          {post.coverAlt && <figcaption className="meta mt-3">{post.coverAlt}</figcaption>}
        </figure>
      )}

      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        <div className="mx-auto max-w-[68ch]">
          <ArticleBody body={post.body} />

          <footer className="mt-16 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:flex-wrap">
            <Button href="/blog" variant="ghost">
              ← All posts
            </Button>
            <Button href="/contact" arrow>
              Write to the editorial desk
            </Button>
          </footer>
        </div>
      </div>
    </article>
  );
}
