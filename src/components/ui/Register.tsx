import type { Dispatch, Monograph } from "@/lib/types";

const STATUS_LABEL: Record<Monograph["status"], string> = {
  published: "Published",
  "in-preparation": "In preparation",
  forthcoming: "Forthcoming",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** A catalogue list of monographs and dispatches, with an honest empty state. */
export function Register({
  monographs,
  dispatches,
  emptyNote,
}: {
  monographs: Monograph[];
  dispatches: Dispatch[];
  emptyNote: string;
}) {
  const rows = [
    ...monographs.map((m) => ({
      ref: m.ref,
      kind: "Monograph",
      title: m.title,
      byline: m.authors.map((a) => a.name).join(", "),
      date: m.publishedOn ? formatDate(m.publishedOn) : STATUS_LABEL[m.status],
      href: m.href,
    })),
    ...dispatches.map((d) => ({
      ref: d.ref,
      kind: "Dispatch",
      title: d.title,
      byline: d.summary,
      date: formatDate(d.issuedOn),
      href: d.href,
    })),
  ];

  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-rule-strong px-5 py-8 md:px-8">
        <p className="meta">Register · 0 entries</p>
        <p className="mt-3 max-w-[56ch] text-parchment">{emptyNote}</p>
      </div>
    );
  }

  return (
    <ol className="border-t border-rule">
      {rows.map((row) => {
        const body = (
          <>
            <span className="meta md:col-span-2">{row.ref}</span>
            <span className="md:col-span-7">
              <span className="block font-serif text-[1.25rem] leading-snug text-parchment">{row.title}</span>
              <span className="mt-1 block text-[0.9375rem]">{row.byline}</span>
            </span>
            <span className="meta md:col-span-3 md:text-right">
              {row.kind} · {row.date}
            </span>
          </>
        );
        return (
          <li key={row.ref} className="border-b border-rule">
            {row.href ? (
              <a href={row.href} className="grid gap-2 py-5 hover:bg-surface md:grid-cols-12 md:gap-6">
                {body}
              </a>
            ) : (
              <div className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
