"use client";

import { useEffect, useRef, useState } from "react";

type Path = { d: string; width: number; height: number };

// Joins every [data-story-anchor] inside with a gently curving dotted line that
// draws itself in as the reader scrolls. Anchors are measured, so the curve follows
// whatever the layout is at the current screen size.
export function StoryPath({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const revealRef = useRef<SVGPathElement>(null);
  const [path, setPath] = useState<Path | null>(null);

  useEffect(() => {
    const root = ref.current!;
    const measure = () => {
      const box = root.getBoundingClientRect();
      const points = [...root.querySelectorAll<HTMLElement>("[data-story-anchor]")].map((el) => {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top };
      });
      if (points.length < 2) return setPath(null);
      const d = points
        .map((point, i) => {
          if (i === 0) return `M ${point.x} ${point.y}`;
          const prev = points[i - 1];
          const bend = (point.y - prev.y) / 2;
          return `C ${prev.x} ${prev.y + bend} ${point.x} ${point.y - bend} ${point.x} ${point.y}`;
        })
        .join(" ");
      setPath({ d, width: root.clientWidth, height: root.clientHeight });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reveal = revealRef.current;
    if (!path || !reveal) return;
    const length = reveal.getTotalLength();
    reveal.style.strokeDasharray = `${length}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal.style.strokeDashoffset = "0";
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = ref.current!.getBoundingClientRect();
      const drawnTo = window.innerHeight * 0.7 - rect.top;
      const progress = Math.min(1, Math.max(0, drawnTo / rect.height));
      reveal.style.strokeDashoffset = `${length * (1 - progress)}`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [path]);

  return (
    <div className="story" ref={ref}>
      {path && (
        <svg
          className="story-line"
          width={path.width}
          height={path.height}
          viewBox={`0 0 ${path.width} ${path.height}`}
          aria-hidden="true"
        >
          <defs>
            <mask id="story-line-reveal" maskUnits="userSpaceOnUse">
              <path ref={revealRef} d={path.d} stroke="#fff" strokeWidth="12" fill="none" />
            </mask>
          </defs>
          <path className="story-line-dots" d={path.d} mask="url(#story-line-reveal)" />
        </svg>
      )}
      {children}
    </div>
  );
}
