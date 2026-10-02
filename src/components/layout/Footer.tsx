import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ORG, REGISTRATION_LABEL } from "@/lib/content";

const COLUMNS = [
  {
    title: "Mikaelson Group",
    links: [
      { href: "/", label: "Thesis" },
      { href: "/frameworks", label: "The four frameworks" },
      { href: "/contact", label: "Correspondence" },
    ],
  },
  {
    title: "The Initiative",
    links: [
      { href: "/initiative#governance", label: "Governance" },
      { href: "/initiative#archive", label: "Research archive" },
      { href: "/initiative#clubs", label: "School clubs" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { href: ORG.instituteUrl, label: "Mikaelson Institute for African Studies" },
      { href: ORG.clubsUrl, label: "Mikaelson School Club" },
      { href: ORG.initiativeUrl, label: "mikaelsoninitiative.org" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-rule bg-surface">
      <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo size={40} />
            <p className="mt-5 max-w-[34ch] text-[0.9375rem]">
              An informational record of how human capability is developed, and of the public-interest work that
              tests it.
            </p>
            <a href={`mailto:${ORG.email}`} className="ink-link mt-5 inline-block font-mono text-[0.8125rem]">
              {ORG.email}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 md:col-span-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="meta mb-4 font-sans text-[0.75rem] font-normal">{col.title}</h2>
              <ul className="space-y-3 text-[0.9375rem]">
                {col.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.href}>
                      {external ? (
                        <a href={link.href} className="text-muted hover:text-parchment" rel="noopener">
                          {link.label}
                          <span aria-hidden className="ml-1 text-faint">↗</span>
                        </a>
                      ) : (
                        <Link href={link.href} className="text-muted hover:text-parchment">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          </div>
        </div>

        {/* Legal disclosure (CAMA 2020, Part F) */}
        <section
          aria-labelledby="legal-disclosure"
          className="mt-16 grid gap-6 border-t border-rule pt-8 md:grid-cols-12 md:gap-8"
        >
          <div className="flex items-start gap-3 md:col-span-3">
            <span
              aria-hidden
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 font-mono text-[0.625rem] text-gold"
            >
              F
            </span>
            <h2 id="legal-disclosure" className="meta font-sans font-normal text-parchment">
              Legal disclosure
              <span className="block text-faint">CAMA 2020 · Part F</span>
            </h2>
          </div>
          <div className="space-y-3 text-[0.875rem] leading-relaxed md:col-span-9">
            <p>
              <strong className="font-medium text-parchment">{ORG.initiative}</strong> is the public name of{" "}
              {ORG.registeredName}, a non-profit body registered with the Corporate Affairs Commission of Nigeria as
              Incorporated Trustees under Part F of the Companies and Allied Matters Act 2020. Registration no.{" "}
              <span className="font-mono text-[0.8125rem] text-parchment">{REGISTRATION_LABEL}</span>. Its income and
              property are applied solely to its charitable objects.
            </p>
            <p>
              {ORG.group} is the parent brand under which the frameworks and editorial work on this site are
              published. This website is informational only: it offers no programmes for sale and takes no
              enrolments or payments.
            </p>
          </div>
        </section>

        <div className="meta mt-10 flex flex-col gap-2 border-t border-rule pt-6 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {ORG.group}. {ORG.seat}.</p>
          <p>Catalogue refs: MG = Mikaelson Group · MI = Mikaelson Initiative</p>
        </div>
      </div>
    </footer>
  );
}
