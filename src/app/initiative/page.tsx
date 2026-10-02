import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Register } from "@/components/ui/Register";
import { SectionHead } from "@/components/ui/SectionHead";
import {
  ARCHIVE_PERIODS,
  DISPATCHES,
  FRAMEWORKS,
  GOVERNANCE,
  LEGAL_RECORD,
  MONOGRAPHS,
  ORG,
  RESEARCH_SERIES,
  SCHOOL_CLUBS,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "The Mikaelson Initiative",
  description:
    "The non-profit wing of Mikaelson Group: a registered Incorporated Trustees body (CAMA 2020, Part F) housing African historical research and the Mikaelson School Clubs.",
};

export default function InitiativePage() {
  const clubFrameworks = FRAMEWORKS.filter((f) => SCHOOL_CLUBS.frameworks.includes(f.slug));

  return (
    <>
      <PageHeader
        refCode="MI"
        kicker="Non-profit wing"
        title={
          <>
            The Mikaelson <em className="text-accent">Initiative.</em>
          </>
        }
        lede="The Initiative is where the work is carried into the public interest. It is a registered Incorporated Trustees body, and it houses two programmes: research into Africa’s pre-colonial and post-colonial history, and student-led clubs in secondary schools."
      >
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-5">
          {[
            ["§ 01", "Legal standing", "#standing"],
            ["§ 02", "Governance", "#governance"],
            ["§ 03", "Research archive", "#archive"],
            ["§ 04", "School clubs", "#clubs"],
          ].map(([n, label, href]) => (
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
        {/* § 01 Legal standing */}
        <section aria-labelledby="standing">
          <SectionHead
            number="01"
            label="Legal standing"
            id="standing"
            title="A registered Incorporated Trustees body."
            lede="Under Part F of the Companies and Allied Matters Act 2020, the trustees of an association established for a religious, educational, literary, scientific, social, development, cultural, sporting or charitable purpose may be registered as a body corporate. The Initiative is registered on that basis."
          />
          <div className="mt-10 md:ml-[25%]" data-reveal>
            <div className="relative border border-rule bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-rule px-5 py-3 md:px-6">
                <p className="meta whitespace-nowrap">Record of registration</p>
                <span className="meta flex items-center gap-2 whitespace-nowrap text-seal">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-seal" />
                  CAMA 2020 · Part F
                </span>
              </div>
              <dl>
                {LEGAL_RECORD.map((row) => (
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

        {/* § 02 Governance */}
        <section aria-labelledby="governance">
          <SectionHead
            number="02"
            label="Governance"
            id="governance"
            title="How the Initiative is governed."
            lede="Authority rests with the Board of Trustees, within the limits of the Initiative’s constitution and the law."
          />
          <ol className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule md:ml-[25%] md:grid-cols-2">
            {GOVERNANCE.map((g, i) => (
              <li key={g.title} className="bg-ground p-6 md:p-8" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <p className="meta">MI/GV-{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-[1.375rem]">{g.title}</h3>
                <p className="mt-3 text-[0.9375rem]">{g.body}</p>
              </li>
            ))}
          </ol>
          <p className="meta mt-6 md:ml-[25%]">
            The names of the trustees are recorded with the Corporate Affairs Commission and will be published here once
            confirmed.
          </p>
        </section>

        {/* § 03 Research archive */}
        <section aria-labelledby="archive">
          <SectionHead
            number="03"
            label="Research archive"
            id="archive"
            title="African history, from the pre-colonial to the present."
            lede="The Initiative’s research is carried out through the Mikaelson Institute for African Studies, a pan-African research institute. Its work is organised into four series and read against a single chronology."
          />

          {/* Chronology */}
          <div className="mt-12 md:ml-[25%]" data-reveal>
            <h3 className="meta mb-5 font-sans font-normal">Chronological framework</h3>
            <ol className="relative grid gap-6 sm:grid-cols-5 sm:gap-3">
              <span aria-hidden className="absolute left-[5px] top-0 h-full w-px bg-rule-strong sm:left-0 sm:top-[5px] sm:h-px sm:w-full" />
              {ARCHIVE_PERIODS.map((p, i) => (
                <li key={p.label} className="relative pl-7 sm:pl-0 sm:pt-7">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border sm:top-0 ${
                      i === 0 || i === ARCHIVE_PERIODS.length - 1
                        ? "border-accent bg-accent"
                        : "border-accent bg-ground"
                    }`}
                  />
                  <p className="font-serif text-[1.125rem] text-heading">{p.label}</p>
                  <p className="mt-1 text-[0.875rem]">{p.description}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Series */}
          <div className="mt-14 grid gap-px overflow-hidden border border-rule bg-rule md:ml-[25%] md:grid-cols-2">
            {RESEARCH_SERIES.map((s, i) => (
              <article key={s.ref} className="bg-surface p-6 md:p-8" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <p className="meta text-accent">{s.ref}</p>
                <h3 className="mt-3 text-[1.5rem]">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem]">{s.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 md:ml-[25%]" data-reveal>
            <h3 className="meta mb-4 font-sans font-normal">Monograph series</h3>
            <Register
              monographs={MONOGRAPHS.filter((m) => m.engine === "initiative")}
              dispatches={DISPATCHES.filter((d) => d.engine === "initiative")}
              emptyNote="The first monographs in the series are in preparation. Papers for consideration are received by the Mikaelson Institute for African Studies."
            />
            <Button href={ORG.instituteUrl} variant="ghost" external className="mt-6">
              Visit the Institute
            </Button>
          </div>
        </section>

        {/* § 04 School clubs */}
        <section aria-labelledby="clubs">
          <SectionHead
            number="04"
            label="School clubs"
            id="clubs"
            title={SCHOOL_CLUBS.name}
            lede="The clubs are where the frameworks meet young people. They are run by students, inside their own secondary schools, and give members a standing place to build habits, argue well and lead."
          />
          <div className="mt-10 grid gap-6 md:ml-[25%] md:grid-cols-12">
            <dl className="border border-rule bg-surface md:col-span-7" data-reveal>
              {[
                ["Who", SCHOOL_CLUBS.constituency],
                ["Format", SCHOOL_CLUBS.format],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 border-b border-rule px-5 py-4 sm:grid-cols-12 sm:gap-6 md:px-6">
                  <dt className="meta sm:col-span-3">{k}</dt>
                  <dd className="text-heading sm:col-span-9">{v}</dd>
                </div>
              ))}
              <div className="grid gap-1 px-5 py-4 sm:grid-cols-12 sm:gap-6 md:px-6">
                <dt className="meta sm:col-span-3">Concerns</dt>
                <dd className="sm:col-span-9">
                  <ul className="space-y-2 text-heading">
                    {SCHOOL_CLUBS.focus.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span aria-hidden className="text-accent">—</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="flex flex-col border border-accent/30 bg-band/25 p-6 md:col-span-5" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <p className="meta">Frameworks in practice</p>
              <ul className="mt-4 space-y-4">
                {clubFrameworks.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/frameworks#${f.slug}`} className="group block">
                      <span className="meta">{f.ref}</span>
                      <span className="block font-serif text-[1.25rem] text-heading group-hover:text-accent">
                        {f.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button href={SCHOOL_CLUBS.href} external>
                  Visit the School Club
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
