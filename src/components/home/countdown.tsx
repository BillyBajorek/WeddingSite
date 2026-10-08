"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; mins: number };

function partsUntil(target: number): Parts {
  const min = Math.max(0, Math.floor((target - Date.now()) / 60_000));
  return { days: Math.floor(min / 1440), hours: Math.floor((min % 1440) / 60), mins: min % 60 };
}

const plural = (n: number | undefined, unit: string) => (n === 1 ? unit : `${unit}s`);

export function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState<Parts | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => {
      const next = partsUntil(t);
      setParts((current) =>
        current && current.mins === next.mins && current.hours === next.hours && current.days === next.days
          ? current
          : next,
      );
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
    return <p className="countdown-done">Today&rsquo;s the day</p>;
  }

  const units = [
    { key: "days", value: parts?.days, label: plural(parts?.days, "Day") },
    { key: "hours", value: parts?.hours, label: plural(parts?.hours, "Hour") },
    { key: "mins", value: parts?.mins, label: plural(parts?.mins, "Minute") },
  ];

  return (
    <div className="countdown" role="timer" aria-label="Time until the wedding">
      {units.map((unit) => (
        <div className="time-part" key={unit.key}>
          <span className="value">{unit.value ?? "—"}</span>
          <span className="label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
