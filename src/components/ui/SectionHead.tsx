/**
 * Dossier-style section heading: a § number and catalogue label in the
 * margin column, the title and lede in the body column.
 */
export function SectionHead({
  number,
  label,
  title,
  lede,
  id,
}: {
  number: string;
  label: string;
  title: string;
  lede?: string;
  id?: string;
}) {
  return (
    <header className="grid gap-4 border-t border-rule pt-6 md:grid-cols-12 md:gap-8" data-reveal>
      <p className="meta md:col-span-3">
        <span className="text-accent">§ {number}</span>
        <span className="mx-2 text-rule-strong">/</span>
        {label}
      </p>
      <div className="md:col-span-9">
        <h2 id={id} className="scroll-mt-28 text-[1.875rem] leading-[1.15] tracking-[-0.015em] md:text-[2.5rem]">
          {title}
        </h2>
        {lede && <p className="prose-body mt-4 text-muted">{lede}</p>}
      </div>
    </header>
  );
}
