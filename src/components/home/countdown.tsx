"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number } | null;

function partsUntil(target: number): Parts {
  const sec = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return { days: Math.floor(sec / 86400), hours: Math.floor((sec % 86400) / 3600) };
}

export function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState<Parts>(null);
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
    const timer = window.setInterval(tick, 30_000);
    tick();
    return () => window.clearInterval(timer);
  }, [target]);

  if (done) {
    return <p className="countdown-done">Today&rsquo;s the day</p>;
  }

  const units = [
    { value: parts?.days, label: parts?.days === 1 ? "Day" : "Days" },
    { value: parts?.hours, label: parts?.hours === 1 ? "Hour" : "Hours" },
  ];

  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding">
      {units.map((unit) => (
        <div className="time-part" key={unit.label}>
          <span className="value">{unit.value ?? "—"}</span>
          <span className="label">{unit.label}</span>
        </div>
      ))}
      <span className="countdown-suffix">to go</span>
    </div>
  );
}
