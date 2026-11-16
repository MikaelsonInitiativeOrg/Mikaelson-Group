import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHead } from "@/components/ui/SectionHead";
import { CONFERENCE, ORG } from "@/lib/content";
import { OG_BASE } from "@/lib/site";

const description =
  "The Mikaelson Institute Research Conference 2027 brings researchers, scientists, students, doctors, engineers, religious leaders and politicians into one room. The call for research is open.";

export const metadata: Metadata = {
  title: "Research Conference 2027",
  description,
  alternates: { canonical: "/conference" },
  openGraph: { ...OG_BASE, url: "/conference", title: "Research Conference 2027 · Mikaelson Group", description },
};

const SECTIONS = [
  ["§ 01", "The record", "#record"],
  ["§ 02", "Who it convenes", "#convenes"],
  ["§ 03", "Tracks", "#tracks"],
  ["§ 04", "Ways to present", "#formats"],
];

export default function ConferencePage() {
  return (
    <>
      <PageHeader
        refCode="MI"
        kicker="Research conference"
        title={
          <>
            Research Conference <em className="text-accent">2027.</em>
          </>
        }
        lede="The Mikaelson Institute for African Studies is convening a research conference in 2027. It brings people from different callings into one room to present work on the same questions, and its call for research is open."
      >
        <div className="mt-10">
          <Button href={ORG.conferenceUrl} size="lg" external>
            Visit the conference
          </Button>
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-5">
          {SECTIONS.map(([n, label, href]) => (
            <li key={href}>
              <a href={href} className="press inline-flex items-baseline gap-2 text-[0.9375rem] text-muted hover:text-heading">
                <span className="meta text-accent">{n}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </PageHeader>

      <div className="mx-auto max-w-[1240px] space-y-28 px-4 md:space-y-36 md:px-8">
        {/* § 01 The record */}
        <section aria-labelledby="record">
          <SectionHead
            number="01"
            label="The record"
            id="record"
            title="What has been decided, and what has not."
            lede="The conference has a convenor, a year and an open call. Its dates and venue are still being set, and are marked as pending until they are announced."
          />
          <div className="mt-10 md:ml-[25%]" data-reveal>
            <div className="border border-rule bg-surface">
              <div className="border-b border-rule px-5 py-3 md:px-6">
                <p className="meta">Conference record</p>
              </div>
              <dl>
                {CONFERENCE.record.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-1 border-b border-rule px-5 py-4 last:border-b-0 sm:grid-cols-12 sm:gap-6 md:px-6"
                  >
                    <dt className="meta sm:col-span-4">{row.label}</dt>
                    <dd className={`sm:col-span-8 ${row.pending ? "font-mono text-[0.875rem] text-faint" : "text-heading"}`}>
                      {row.value}
                      {row.pending && (
                        <span className="ml-2 inline-block border border-rule-strong px-1.5 py-0.5 align-middle text-[0.6875rem] uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* § 02 Who it convenes */}
        <section aria-labelledby="convenes">
          <SectionHead
            number="02"
            label="Who it convenes"
            id="convenes"
            title="One room, many callings."
            lede="A surgeon, a bishop and a first-year student can study the same question and see different things. Each person submits in the capacity they hold, and the work is read with that in mind."
          />
          <ul className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 md:ml-[25%] lg:grid-cols-4">
            {CONFERENCE.capacities.map((c, i) => (
              <li key={c} className="bg-ground p-5 md:p-6" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <p className="meta">MI/RC-{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-serif text-[1.25rem] leading-tight text-heading">{c}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* § 03 Tracks */}
        <section aria-labelledby="tracks">
          <SectionHead
            number="03"
            label="Tracks"
            id="tracks"
            title="Seven tracks of work."
            lede="Five follow the Institute’s own research areas. Two more give clinical and engineering work a home."
          />
          <ol className="mt-10 border border-rule bg-surface md:ml-[25%]" data-reveal>
            {CONFERENCE.tracks.map((t, i) => (
              <li key={t.title} className="grid gap-1 border-b border-rule px-5 py-4 last:border-b-0 sm:grid-cols-12 sm:gap-6 md:px-6">
                <p className="meta sm:col-span-2">T-{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-serif text-[1.25rem] leading-tight sm:col-span-5">{t.title}</h3>
                <p className="text-[0.9375rem] sm:col-span-5">{t.summary}</p>
              </li>
            ))}
          </ol>
          <p className="meta mt-6 md:ml-[25%]">The track list is provisional and may change before the programme is published.</p>
        </section>

        {/* § 04 Ways to present */}
        <section aria-labelledby="formats">
          <SectionHead
            number="04"
            label="Ways to present"
            id="formats"
            title="Five ways to present."
            lede={`A submission begins as an abstract of up to ${CONFERENCE.abstractWordLimit} words, sent in one of five forms.`}
          />
          <ol className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule md:ml-[25%] md:grid-cols-2">
            {CONFERENCE.formats.map((f, i) => (
              <li
                key={f.title}
                className="bg-ground p-6 last:md:col-span-2 md:p-8"
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
              >
                <p className="meta">F-{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[1.375rem]">{f.title}</h3>
                <p className="mt-3 text-[0.9375rem]">{f.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 border border-accent/30 bg-band/25 p-6 md:ml-[25%] md:p-8" data-reveal>
            <p className="max-w-[52ch] text-heading">
              Submissions, the programme, speakers and partners are all handled on the conference’s own site.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button href={ORG.conferenceUrl} external>
                Visit the conference
              </Button>
              <Button href={ORG.instituteUrl} variant="ghost" external>
                Visit the Institute
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
