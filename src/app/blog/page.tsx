import type { Metadata } from "next";
import { FeaturedPost, PostRows } from "@/components/blog/PostList";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedPosts } from "@/lib/blog";
import { OG_BASE } from "@/lib/site";

// Rebuilt at most every 5 minutes, and immediately when the Studio saves.
export const revalidate = 300;

const description =
  "Essays, notes and dispatches from Mikaelson Group and the Mikaelson Initiative: on human capability, the four frameworks and pre-colonial African history.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { ...OG_BASE, url: "/blog", title: "Blog · Mikaelson Group", description },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [latest, ...rest] = posts;

  return (
    <>
      <PageHeader
        refCode="MG/BL"
        kicker="Blog"
        title={
          <>
            Essays, notes and <em className="text-accent">dispatches.</em>
          </>
        }
        lede="Writing from both engines of the institution: arguments about human capability, notes on the four frameworks, and work from the research archive."
      />

      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        {latest ? (
          <div className="space-y-16">
            <FeaturedPost post={latest} />
            {rest.length > 0 && (
              <section aria-labelledby="all-posts">
                <h2 id="all-posts" className="meta mb-2 font-sans font-normal">
                  All posts · {posts.length}
                </h2>
                <PostRows posts={rest} />
              </section>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-rule-strong px-5 py-12 text-center md:px-8">
            <p className="meta">Blog · 0 posts</p>
            <p className="mx-auto mt-3 max-w-[48ch] font-serif text-[1.375rem] leading-snug text-heading">
              The first posts are being written. They will appear here when they are published.
            </p>
            <div className="mt-8">
              <Button href="/frameworks" variant="ghost" arrow>
                Read the four frameworks
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
