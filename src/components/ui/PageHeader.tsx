/** Inner-page masthead: catalogue line, h1, lede, optional record strip. */
export function PageHeader({
  refCode,
  kicker,
  title,
  lede,
  children,
}: {
  refCode: string;
  kicker: string;
  title: React.ReactNode;
  lede: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-[1240px] px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-24">
      <p className="meta">
        <span className="text-turquoise">{refCode}</span>
        <span className="mx-2 text-rule-strong">/</span>
        {kicker}
      </p>
      <h1 className="mt-6 max-w-[18ch] text-[2.5rem] leading-[1.06] tracking-[-0.025em] sm:text-[3.25rem] lg:text-[4rem]">
        {title}
      </h1>
      <p className="prose-body mt-8 text-[1.125rem]">{lede}</p>
      {children}
    </header>
  );
}
