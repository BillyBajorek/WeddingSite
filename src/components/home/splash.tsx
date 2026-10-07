"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ENTERED_KEY } from "@/lib/splash";

const ENTER_KEYS = new Set(["Enter", " ", "ArrowDown", "PageDown", "End"]);

export function Splash() {
  const ref = useRef<HTMLButtonElement>(null);

  const enter = useCallback(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (root.dataset.entered || !el) return;

    // Fly the splash logo onto the nav logo wherever the nav has laid it out.
    const target = document.querySelector(".nav-logo-link");
    if (target) {
      const from = el.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      el.style.setProperty("--dx", `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
      el.style.setProperty("--dy", `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
      el.style.setProperty("--s", String(to.width / from.width));
    }

    root.dataset.entered = "now";
    try {
      sessionStorage.setItem(ENTERED_KEY, "1");
    } catch {}

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.dataset.entered = "seen";
      document.getElementById("main")?.focus({ preventScroll: true });
    };
    el.addEventListener("transitionend", (e) => {
      if (e.propertyName === "transform") finish();
    });
    window.setTimeout(finish, 1100);
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.entered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target === ref.current) return;
      if (ENTER_KEYS.has(e.key)) {
        e.preventDefault();
        enter();
      }
    };
    const onScrollIntent = (e: WheelEvent | TouchEvent) => {
      if ("deltaY" in e && e.deltaY <= 0) return;
      enter();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchmove", onScrollIntent, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
    };
  }, [enter]);

  return (
    <button ref={ref} type="button" className="splash" onClick={enter} aria-label="Enter site">
      <Image
        src="/images/logo.png"
        alt=""
        width={640}
        height={592}
        priority
        className="splash-logo"
      />
      <span className="splash-hint" aria-hidden="true">
        Tap to enter
      </span>
    </button>
  );
}
