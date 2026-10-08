"use client";

import { useEffect, useState } from "react";

const icons = {
  itinerary: "M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 10V7h-2v7h6v-2h-4Z",
  venue:
    "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5Z",
  menu: "M7 2c-.55 0-1 .45-1 1v6a2 2 0 1 0 2 0V3c0-.55-.45-1-1-1Zm10.5 1a2.5 2.5 0 0 0-2.5 2.5V12a2 2 0 0 0 4 0V5.5A2.5 2.5 0 0 0 17.5 3ZM11 2h2v8h-2z",
};

export type JumpTarget = { id: keyof typeof icons; label: string };

export function QuickJump({ targets }: { targets: JumpTarget[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    targets.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [targets]);

  const jump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  };

  const links = (variant: "pill" | "rail") =>
    targets.map(({ id, label }) => (
      <a
        key={id}
        href={`#${id}`}
        aria-current={active === id ? "location" : undefined}
        aria-label={variant === "rail" ? `Go to ${label}` : undefined}
        title={variant === "rail" ? label : undefined}
        onClick={(event) => jump(event, id)}
      >
        {variant === "pill" ? (
          <span className="dot" aria-hidden="true" />
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d={icons[id]} />
          </svg>
        )}
        {variant === "pill" && label}
      </a>
    ));

  return (
    <>
      <nav className="quickjump quickjump--pill" aria-label="Jump to section">
        {links("pill")}
      </nav>
      <nav className="quickjump quickjump--rail" aria-label="Jump to section">
        {links("rail")}
      </nav>
    </>
  );
}
