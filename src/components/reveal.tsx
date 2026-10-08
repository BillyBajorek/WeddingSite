"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fades in every [data-reveal] element on the page as it scrolls into view. The hidden
// starting state is CSS gated on html[data-js], so content stays visible without JS.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    document
      .querySelectorAll("[data-reveal]:not(.is-revealed)")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
