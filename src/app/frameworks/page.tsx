import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { FRAMEWORKS } from "@/lib/content";
import { OG_BASE } from "@/lib/site";

const description =
  "An informational dossier on the four Mikaelson frameworks: Epistemic Agency, Intellectual Infrastructure, Applied Human Capability and Generative Capacity.";

export const metadata: Metadata = {
  title: "Frameworks",
  description,
  alternates: { canonical: "/frameworks" },
  openGraph: { ...OG_BASE, url: "/frameworks", title: "Frameworks · Mikaelson Group", description },
};

export default function FrameworksPage() {
  return (
    <>
      <PageHeader
        refCode="MG/FW"
        kicker="Dossier"
        title={
          <>
            Four frameworks for <em className="text-accent">human capability.</em>
          </>
        }
        lede="Each framework names one condition under which human capability develops, the question it answers, and the parts it is made of. They are read in sequence: each presupposes the one before it."
      >
        {/* The sequence, as a ruled strip */}
        <ol className="mt-14 grid grid-cols-2 border-l border-t border-rule md:grid-cols-4">
          {FRAMEWORKS.map((fw) => (
            <li key={fw.slug} className="border-b border-r border-rule">
              <a href={`#${fw.slug}`} className="press group block h-full p-4 hover:bg-surface md:p-5">
                <span className="meta">
                  {String(fw.order).padStart(2, "0")} · {fw.unitOfAnalysis}
                </span>
                <span className="mt-3 block font-serif text-[1.125rem] leading-snug text-heading group-hover:text-accent md:text-[1.25rem]">
                  {fw.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </PageHeader>

      <div className="mx-auto max-w-[1240px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Sticky index */}
          <nav aria-label="Frameworks" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="meta mb-4">Contents</p>
              <ol className="space-y-3 border-l border-rule">
                {FRAMEWORKS.map((fw) => (
                  <li key={fw.slug}>
                    <a href={`#${fw.slug}`} className="-ml-px block border-l border-transparent pl-4 text-[0.9375rem] text-muted hover:border-accent hover:text-heading">
                      <span className="meta mr-2">{fw.ref.split("-")[1]}</span>
                      {fw.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="space-y-28 lg:col-span-9">
            {FRAMEWORKS.map((fw, idx) => {
              const next = FRAMEWORKS[idx + 1];
              return (
                <article key={fw.slug} aria-labelledby={fw.slug} className="border-t border-rule pt-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-3" data-reveal>
                    <p className="meta">
                      <span className="text-accent">{fw.ref}</span>
                      <span className="mx-2 text-rule-strong">/</span>
                      Framework {fw.order} of 4
                    </p>
                    <p className="meta">Unit of analysis: {fw.unitOfAnalysis}</p>
                  </div>

                  <h2
                    id={fw.slug}
                    className="mt-6 scroll-mt-28 text-[2.25rem] leading-[1.08] tracking-[-0.02em] md:text-[3rem]"
                    data-reveal
                  >
                    {fw.title}
                  </h2>

                  <p className="prose-body mt-6 font-serif text-[1.3125rem] leading-[1.55] text-heading" data-reveal>
                    {fw.definition}
                  </p>

                  <blockquote className="mt-10 border-l-2 border-accent pl-5 md:pl-6" data-reveal>
                    <p className="meta">Governing question</p>
                    <p className="mt-2 font-serif text-[1.5rem] italic leading-snug text-heading md:text-[1.75rem]">
                      {fw.governingQuestion}
                    </p>
                  </blockquote>

                  <h3 className="meta mt-12 font-sans font-normal">Components</h3>
                  <dl className="mt-4 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
                    {fw.components.map((c, i) => (
                      <div
                        key={c.name}
                        className="bg-ground p-5 md:p-6"
                        data-reveal
                        style={{ "--i": i } as React.CSSProperties}
                      >
                        <dt className="flex items-baseline gap-3">
                          <span className="meta">
                            {fw.order}.{i + 1}
                          </span>
                          <span className="font-serif text-[1.1875rem] text-heading">{c.name}</span>
                        </dt>
                        <dd className="mt-2 text-[0.9375rem]">{c.description}</dd>
                      </div>
                    ))}
                  </dl>

                  <aside className="mt-8 grid gap-3 border border-dashed border-rule-strong p-5 md:grid-cols-12 md:gap-6 md:p-6" data-reveal>
                    <p className="meta md:col-span-3">Not to be confused with</p>
                    <p className="text-[0.9375rem] md:col-span-9">{fw.notToBeConfusedWith}</p>
                  </aside>

                  {next && (
                    <p className="meta mt-8">
                      Presupposed by{" "}
                      <a href={`#${next.slug}`} className="ink-link">
                        {next.ref} {next.title}
                      </a>
                    </p>
                  )}
                </article>
              );
            })}

            <section aria-labelledby="reading-note" className="border-t border-rule pt-8">
              <h2 id="reading-note" className="text-[1.75rem]">A note on use</h2>
              <p className="prose-body mt-4">
                The frameworks are descriptive instruments, not a curriculum or a product. They are published so that
                educators, researchers and institutions can examine, apply and criticise them. Questions and
                correspondence about the frameworks are received by the editorial desk.
              </p>
              <Button href="/contact" arrow className="mt-8">
                Write to the editorial desk
              </Button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
