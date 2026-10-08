"use client";

import { useEffect, useState } from "react";
import { mapUrl, type ItineraryItem } from "@/content/details";

// Matches the breakpoint where the timeline stacks vertically in globals.css.
const isStacked = () => window.matchMedia("(max-width: 900px)").matches;

export function Itinerary({ items }: { items: ItineraryItem[] }) {
  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null);
  const selectedIndex = items.findIndex((item) => item.id === selected);

  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!items.some((item) => item.id === id)) return;
      setSelected(id);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [items]);

  // Side by side, one stop is always shown; stacked, tapping an open stop closes it.
  const choose = (id: string) => setSelected(id === selected && isStacked() ? null : id);

  return (
    <ol
      className="timeline"
      aria-label="Wedding day schedule"
      style={{ "--count": items.length } as React.CSSProperties}
    >
      {items.map((item, index) => {
        const isOpen = selected === item.id;
        const rows = [
          ["Location", item.location],
          ["Duration", item.duration],
          ["Notes", item.notes],
          ["Accessibility", item.accessibility],
        ].filter(([, value]) => value);
        return (
          <li
            key={item.id}
            id={item.id}
            className="node"
            data-open={isOpen || undefined}
            data-passed={index < selectedIndex || undefined}
          >
            <button
              type="button"
              className="node-head"
              aria-expanded={isOpen}
              aria-controls={`${item.id}-details`}
              onClick={() => choose(item.id)}
            >
              <span className="node-dot" aria-hidden="true" />
              <span className="node-time">{item.time}</span>
              <span className="node-title">{item.title}</span>
            </button>
            <div className="node-details" id={`${item.id}-details`} inert={!isOpen}>
              <div className="node-panel">
                <div className="node-summary">
                  <p className="node-panel-time">{item.time}</p>
                  <h3 className="node-panel-title">{item.title}</h3>
                  <p className="node-brief">{item.brief}</p>
                </div>
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
          </li>
        );
      })}
    </ol>
  );
}
