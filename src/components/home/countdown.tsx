"use client";

import { useEffect, useState } from "react";

type Parts = { days: string; hours: string; mins: string; secs: string };

const EMPTY: Parts = { days: "—", hours: "—", mins: "—", secs: "—" };
const pad = (n: number) => String(n).padStart(2, "0");

function partsUntil(target: number): Parts {
  const sec = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return {
    days: String(Math.floor(sec / 86400)),
    hours: pad(Math.floor((sec % 86400) / 3600)),
    mins: pad(Math.floor((sec % 3600) / 60)),
    secs: pad(sec % 60),
  };
}

export function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState<Parts>(EMPTY);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      setParts(partsUntil(t));
      if (Date.now() >= t) {
        setDone(true);
        window.clearInterval(timer);
      }
    };
    const timer = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(timer);
  }, [target]);

  if (done) {
    return <p className="countdown-done">Today&rsquo;s the day!</p>;
  }

  const units: [keyof Parts, string][] = [
    ["days", "Days"],
    ["hours", "Hours"],
    ["mins", "Minutes"],
    ["secs", "Seconds"],
  ];

  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding">
      {units.map(([key, label]) => (
        <div className="time-part" key={key}>
          <span className="value">{parts[key]}</span>
          <span className="label">{label}</span>
        </div>
      ))}
    </div>
  );
}
