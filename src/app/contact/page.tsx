import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHead } from "@/components/ui/SectionHead";
import { DESKS, ORG, mailto } from "@/lib/content";

export const metadata: Metadata = {
  title: "Correspondence",
  description:
    "A directory for institutional, academic, editorial, school and press correspondence with Mikaelson Group and the Mikaelson Initiative.",
};

const ENGINE_LABEL = {
  group: "Mikaelson Group",
  initiative: "The Initiative",
  both: "Both engines",
} as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        refCode="MG/CD"
        kicker="Correspondence directory"
        title={
          <>
            Write to the <em className="text-accent">right desk.</em>
          </>
        }
        lede="All correspondence is received by a single secretariat and routed by its subject line. Choose the desk that matches your enquiry; the link opens a letter with the subject already marked."
      />

      <div className="mx-auto max-w-[1240px] space-y-28 px-4 md:px-8">
        <section aria-labelledby="desks">
          <SectionHead number="01" label="Desks" id="desks" title="Correspondence desks." />
          <ol className="mt-10 border-t border-rule md:ml-[25%]">
            {DESKS.map((desk, i) => (
              <li
                key={desk.ref}
                className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-8"
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="md:col-span-4">
                  <p className="meta">
                    <span className="text-accent">{desk.ref}</span>
                    <span className="mx-2 text-rule-strong">/</span>
                    {ENGINE_LABEL[desk.engine]}
                  </p>
                  <h3 className="mt-3 text-[1.5rem] leading-tight">{desk.title}</h3>
                </div>
                <div className="md:col-span-5">
                  <p className="text-[0.9375rem] text-heading">{desk.forWhom}</p>
                  <ul className="mt-3 space-y-1 text-[0.9375rem]">
                    {desk.handles.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span aria-hidden className="text-faint">—</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <p className="meta">Subject line</p>
                  <p className="mt-1 font-mono text-[0.875rem] text-heading">[{desk.subjectPrefix}] …</p>
                  <Button href={mailto(desk)} variant="ghost" arrow className="mt-4">
                    Compose letter
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="particulars">
          <SectionHead number="02" label="Particulars" id="particulars" title="Address and conventions." />
          <div className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule md:ml-[25%] md:grid-cols-3">
            <div className="bg-ground p-6" data-reveal>
              <p className="meta">Secretariat</p>
              <a href={`mailto:${ORG.email}`} className="ink-link mt-3 inline-block break-all font-mono text-[0.9375rem]">
                {ORG.email}
              </a>
            </div>
            <div className="bg-ground p-6" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <p className="meta">Seat</p>
              <p className="mt-3 text-heading">{ORG.seat}</p>
              <p className="meta mt-2">Postal address to be published.</p>
            </div>
            <div className="bg-ground p-6" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <p className="meta">Language</p>
              <p className="mt-3 text-heading">English</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:ml-[25%] md:grid-cols-2" data-reveal>
            <div className="border border-dashed border-rule-strong p-5 md:p-6">
              <p className="meta">Papers for the research archive</p>
              <p className="mt-2 text-[0.9375rem]">
                Scholarly papers are received through the{" "}
                <a href={ORG.instituteUrl} className="ink-link" rel="noopener">
                  Mikaelson Institute for African Studies
                </a>
                , not by letter.
              </p>
            </div>
            <div className="border border-dashed border-rule-strong p-5 md:p-6">
              <p className="meta">What this directory is not</p>
              <p className="mt-2 text-[0.9375rem]">
                This site is informational. It takes no enrolments, applications or payments, and nothing here is
                offered for sale.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
