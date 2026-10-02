"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Marks every [data-reveal] element with [data-shown] the first time it
 * enters the viewport. One observer for the whole page; fires once.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
