"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ENTERED_KEY } from "@/lib/splash";

const INTRO_MS = 1900;

// A short monogram intro on the first home visit of a session. It plays on its own
// in CSS; this only records that it was seen and retires it once it has finished.
export function Splash() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.entered) return;
    try {
      sessionStorage.setItem(ENTERED_KEY, "1");
    } catch {}
    const timer = window.setTimeout(() => {
      root.dataset.entered = "seen";
    }, INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <Image
        src="/images/monogram.png"
        alt=""
        width={632}
        height={468}
        priority
        className="intro-mark"
      />
    </div>
  );
}
