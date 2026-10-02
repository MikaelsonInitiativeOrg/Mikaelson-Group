import Link from "next/link";
import { EngineDiagram } from "@/components/home/EngineDiagram";
import { Button } from "@/components/ui/Button";
import { Register } from "@/components/ui/Register";
import { SectionHead } from "@/components/ui/SectionHead";
import { DISPATCHES, FRAMEWORKS, MONOGRAPHS, ORG, RESEARCH_SERIES } from "@/lib/content";

const THESES = [
  "A society’s prospects are set less by its resources than by what its people can understand, do and originate.",
  "That capacity is not a fixed trait. It is developed, under conditions that can be named, studied and deliberately built.",
  "The conditions compound. Agency makes infrastructure possible; infrastructure makes capability reliable; capability makes generation possible.",
  "Work on human capability must be tested in public, with real communities, and its results recorded honestly.",
];

const ROMAN = ["I", "II", "III", "IV"];

export default function HomePage() {
  return (
    <>
      {/* Hero: statement of thesis */}
      <section className="mx-auto max-w-[1240px] px-4 pb-20 pt-14 md:px-8 md:pb-28 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="meta">
              <span className="text-accent">MG/00</span>
              <span className="mx-2 text-rule-strong">/</span>
              Statement of thesis
            </p>
            <h1 className="mt-6 text-[2.5rem] leading-[1.06] tracking-[-0.025em] sm:text-[3.25rem] lg:text-[4.25rem]">
              Human capability is infrastructure.{" "}
              <em className="text-accent">It can be studied, built and handed on.</em>
            </h1>
            <p className="prose-body mt-8 text-[1.125rem]">
              Mikaelson Group articulates how people come to think for themselves, how communities build the
              institutions that let thought accumulate, and how both become the capacity to make what did not exist
              before. Its non-profit wing, the Mikaelson Initiative, carries that work into historical research and
              into secondary schools.
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:gap-4">
              <Button href="/frameworks" size="lg" arrow>
                Read the four frameworks
              </Button>
              <Button href="/initiative" variant="ghost" size="lg">
                The Mikaelson Initiative
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[520px] lg:col-span-5">
            <EngineDiagram />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] space-y-28 px-4 md:space-y-36 md:px-8">
        {/* § 01 Theses */}
        <section aria-labelledby="theses">
          <SectionHead
            number="01"
            label="Core thesis"
            id="theses"
            title="Four propositions the institution is built on."
          />
          <ol className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule md:ml-[25%] md:grid-cols-2">
            {THESES.map((t, i) => (
              <li
                key={t}
                className="bg-ground p-6 md:p-8"
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="font-serif text-[1.5rem] italic text-accent">{ROMAN[i]}.</span>
                <p className="mt-3 font-serif text-[1.25rem] leading-[1.45] text-heading">{t}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* § 02 Dual-engine architecture */}
        <section aria-labelledby="architecture">
          <SectionHead
            number="02"
            label="Architecture"
            id="architecture"
            title="Two engines, one question."
            lede="The institution is organised as two distinct bodies that answer the same question in different ways. One articulates; the other tests in public. Frameworks inform practice, and practice corrects the frameworks."
          />
          <div className="mt-10 grid gap-6 md:ml-[25%] md:grid-cols-2">
            <article className="flex flex-col border border-rule bg-surface p-6 md:p-8" data-reveal>
              <p className="meta">
                Engine I <span className="mx-1 text-rule-strong">·</span> Parent brand
              </p>
              <h3 className="mt-4 text-[1.75rem] leading-tight">{ORG.group}</h3>
              <p className="mt-4">
                Develops and publishes the conceptual frameworks: what human capability is, how it grows, and how it
                can be recognised. Its output is editorial.
              </p>
              <ul className="mt-6 space-y-2 border-t border-rule pt-5 text-[0.9375rem] text-heading">
                <li>The four frameworks</li>
                <li>Monographs</li>
                <li>Dispatches</li>
              </ul>
              <Button href="/frameworks" variant="ghost" arrow className="mt-8 self-start">
                The frameworks dossier
              </Button>
            </article>

            <article
              className="flex flex-col border border-accent/30 bg-band/25 p-6 md:p-8"
              data-reveal
              style={{ "--i": 1 } as React.CSSProperties}
            >
              <p className="meta">
                Engine II <span className="mx-1 text-rule-strong">·</span> Non-profit wing
              </p>
              <h3 className="mt-4 text-[1.75rem] leading-tight">{ORG.initiative}</h3>
              <p className="mt-4">
                A registered Incorporated Trustees body under Part F of the Companies and Allied Matters Act 2020. It
                carries the work into the public interest, where it can be tested.
              </p>
              <ul className="mt-6 space-y-2 border-t border-accent/20 pt-5 text-[0.9375rem] text-heading">
                <li>Pre-colonial and post-colonial African historical research</li>
                <li>The Mikaelson Institute for African Studies</li>
                <li>Mikaelson School Clubs</li>
              </ul>
              <Button href="/initiative" arrow className="mt-8 self-start">
                Governance, archive and clubs
              </Button>
            </article>
          </div>
        </section>

        {/* § 03 Frameworks index */}
        <section aria-labelledby="frameworks-index">
          <SectionHead
            number="03"
            label="Frameworks"
            id="frameworks-index"
            title="The four frameworks, in sequence."
            lede="Each framework presupposes the one before it. Read together, they describe how a capable person becomes a capable society."
          />
          <ol className="mt-10 border-t border-rule md:ml-[25%]">
            {FRAMEWORKS.map((fw, i) => (
              <li key={fw.slug} className="border-b border-rule" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={`/frameworks#${fw.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-1 py-6 md:gap-x-8"
                >
                  <span className="meta">{fw.ref}</span>
                  <span>
                    <span className="block font-serif text-[1.5rem] leading-tight text-heading transition-colors duration-150 group-hover:text-accent md:text-[1.875rem]">
                      {fw.title}
                    </span>
                    <span className="mt-2 block max-w-[56ch] text-[0.9375rem]">{fw.summary}</span>
                  </span>
                  <span
                    aria-hidden
                    className="text-faint transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1 group-hover:text-accent"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* § 04 Research and records */}
        <section aria-labelledby="research">
          <SectionHead
            number="04"
            label="Research & records"
            id="research"
            title="The research archive and the register."
            lede="The Initiative’s historical research is organised into four series and carried out through the Mikaelson Institute for African Studies. Publications from both engines are entered in a single register."
          />
          <div className="mt-10 grid gap-10 md:ml-[25%] md:grid-cols-2">
            <div data-reveal>
              <h3 className="meta mb-4 font-sans font-normal">Research series</h3>
              <ul className="border-t border-rule">
                {RESEARCH_SERIES.map((s) => (
                  <li key={s.ref} className="flex items-baseline gap-4 border-b border-rule py-3">
                    <span className="meta w-[4.5rem] shrink-0">{s.ref}</span>
                    <span className="text-heading">{s.title}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/initiative#archive" variant="ghost" arrow>
                  The research archive
                </Button>
                <Button href={ORG.instituteUrl} variant="ghost" external>
                  The Institute
                </Button>
              </div>
            </div>
            <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <h3 className="meta mb-4 font-sans font-normal">Register of monographs and dispatches</h3>
              <Register
                monographs={MONOGRAPHS}
                dispatches={DISPATCHES}
                emptyNote="No monographs or dispatches have been issued yet. Each will be entered here, with its catalogue reference, on publication."
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
