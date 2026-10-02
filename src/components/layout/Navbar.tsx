"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { NAV } from "@/lib/content";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // "Research" is an anchor inside /initiative, so only exact page links show as current.
  const isCurrent = (href: string) => !href.includes("#") && pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-ink/85 backdrop-blur-md supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 md:h-[72px] md:px-8">
        <Link href="/" className="press -mx-1 rounded px-1 py-1" aria-label="Mikaelson Group, home">
          <Logo size={30} />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`press relative block rounded px-3 py-2 text-[0.9375rem] ${
                      current ? "text-parchment" : "text-muted hover:text-parchment"
                    }`}
                  >
                    {item.label}
                    {current && (
                      <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-px bg-turquoise md:-bottom-[17px]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="press -mr-2 flex h-11 w-11 items-center justify-center rounded md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-parchment transition-transform duration-200 ease-out ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-5 bg-parchment transition-transform duration-200 ease-out ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`grid border-rule transition-[grid-template-rows] duration-300 ease-[var(--ease-out-strong)] md:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <nav aria-label="Primary" className="overflow-hidden" inert={!open}>
          <ul className="px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-rule last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="flex items-center justify-between py-4 font-serif text-[1.375rem] text-parchment"
                >
                  {item.label}
                  <span aria-hidden className="meta">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
