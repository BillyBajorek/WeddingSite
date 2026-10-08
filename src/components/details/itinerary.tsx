"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mapUrl, type ItineraryItem } from "@/content/details";

const MIN_THUMB = 64;

export function Itinerary({ items }: { items: ItineraryItem[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const trackRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const metrics = useCallback(() => {
    const track = trackRef.current!;
    const railWidth = railRef.current!.clientWidth;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const thumbWidth = Math.min(
      railWidth,
      Math.max(MIN_THUMB, (track.clientWidth / track.scrollWidth) * railWidth),
    );
    return { track, maxScroll, maxLeft: Math.max(0, railWidth - thumbWidth), thumbWidth };
  }, []);

  // Positions the thumb straight from scroll events instead of re-rendering on every frame.
  const sync = useCallback(() => {
    const thumb = thumbRef.current;
    if (!thumb || !railRef.current || !trackRef.current) return;
    const { track, maxScroll, maxLeft, thumbWidth } = metrics();
    const ratio = maxScroll ? track.scrollLeft / maxScroll : 0;
    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translate(${ratio * maxLeft}px, -50%)`;
    thumb.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
    railRef.current.parentElement!.hidden = maxScroll === 0;
  }, [metrics]);

  useEffect(() => {
    const track = trackRef.current!;
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    track.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", sync);
    };
  }, [sync]);

  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!items.some((item) => item.id === id)) return;
      setOpen((current) => new Set(current).add(id));
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [items]);

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const scrollToRatio = (ratio: number) => {
    const { track, maxScroll } = metrics();
    track.scrollTo({ left: ratio * maxScroll, behavior: "smooth" });
  };

  const onRailClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === thumbRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    scrollToRatio(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const { track, maxScroll, maxLeft } = metrics();
    drag.current = { x: event.clientX, left: maxScroll ? (track.scrollLeft / maxScroll) * maxLeft : 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const { track, maxScroll, maxLeft } = metrics();
    const left = Math.min(maxLeft, Math.max(0, drag.current.left + event.clientX - drag.current.x));
    track.scrollLeft = maxLeft ? (left / maxLeft) * maxScroll : 0;
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { track, maxScroll } = metrics();
    const page = Math.max(280, track.clientWidth * 0.6);
    const moves: Record<string, number> = {
      ArrowRight: track.scrollLeft + page,
      PageDown: track.scrollLeft + page,
      ArrowLeft: track.scrollLeft - page,
      PageUp: track.scrollLeft - page,
      Home: 0,
      End: maxScroll,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    track.scrollTo({ left: moves[event.key], behavior: "smooth" });
  };

  return (
    <>
      <ol className="timeline" id="itinerary-track" ref={trackRef} aria-label="Wedding day schedule">
        {items.map((item) => {
          const isOpen = open.has(item.id);
          const rows = [
            ["Location", item.location],
            ["Duration", item.duration],
            ["Notes", item.notes],
            ["Accessibility", item.accessibility],
          ].filter(([, value]) => value);
          return (
            <li key={item.id} id={item.id} className={`node${isOpen ? " is-open" : ""}`}>
              <span className="node-dot" aria-hidden="true" />
              <div className="node-body">
                <h3 className="node-title">{item.title}</h3>
                <p className="node-time">{item.time}</p>
                <button
                  type="button"
                  className="text-link"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-details`}
                  onClick={() => toggle(item.id)}
                >
                  {isOpen ? "Hide details ↑" : "View details →"}
                </button>
                <div className="node-details" id={`${item.id}-details`} inert={!isOpen}>
                  <div>
                    <p className="node-brief">{item.brief}</p>
                    <dl className="node-meta">
                      {rows.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                      {item.showMap && (
                        <div>
                          <dt>Map</dt>
                          <dd>
                            <a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">
                              Open in Google Maps
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="scrollbar">
        <div className="scrollbar-rail" ref={railRef} onClick={onRailClick}>
          <div
            className="scrollbar-thumb"
            ref={thumbRef}
            role="scrollbar"
            tabIndex={0}
            aria-label="Scroll the schedule"
            aria-controls="itinerary-track"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </>
  );
}
