import Link from "next/link";

/*
  The Mikaelson School Club buttons (club.mikaelsoninitiative.org,
  app/lib/tw.ts), ported so the family of sites shares them:
  - primary: turquoise pill on a solid "step" that presses down on hover
    and further on press;
  - ghost: outlined pill that lifts on hover.
*/

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-[9px] whitespace-nowrap rounded-full px-[26px] py-[14px] font-sans text-[15px] font-semibold leading-none no-underline transition-[transform,box-shadow,border-color,color] duration-200 [&_.arr]:transition-transform [&_.arr]:duration-200 hover:[&_.arr]:translate-x-[3px]";

const VARIANTS = {
  primary:
    "mb-2.5 bg-btn-face font-bold text-btn-ink shadow-[0_12px_0_-2px_var(--btn-step)] hover:translate-y-[2px] hover:shadow-[0_8px_0_-2px_var(--btn-step)] active:translate-y-[6px] active:shadow-[0_4px_0_-2px_var(--btn-step)]",
  ghost:
    "border-[1.5px] border-rule-strong bg-transparent text-heading hover:-translate-y-[2px] hover:border-accent hover:text-accent active:translate-y-0 active:scale-[0.97]",
} as const;

const SIZES = {
  md: "",
  lg: "px-8 py-4 text-[16px]",
} as const;

/** Class string for the club buttons, for use on a real <button>. */
export function buttonClass(variant: keyof typeof VARIANTS = "primary", size: keyof typeof SIZES = "md") {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} disabled:pointer-events-none disabled:opacity-50`;
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`arr ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  /** Trailing arrow that nudges right on hover. */
  arrow?: boolean;
  /** Off-site link: plain <a> with a ↗ marker. */
  external?: boolean;
  className?: string;
}) {
  const cls = `${buttonClass(variant, size)} ${className}`;
  const content = (
    <>
      {children}
      {external ? <span aria-hidden>↗</span> : arrow && <ArrowIcon />}
    </>
  );

  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls} rel={external ? "noopener" : undefined}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
