"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/content";

/**
 * `[·label·]` links with an accent fill on the section currently in view.
 *
 * Scroll position, not IntersectionObserver: GSAP pins two of these sections
 * behind tall pin-spacers, and an observer only reports sections whose
 * visibility *changed*, so a later section entering the trigger band would win
 * over the pinned one still occupying it.
 */
export default function BracketNav({ className = "" }: { className?: string }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    let frame = 0;

    const measure = () => {
      frame = 0;
      // The section owning the viewport midpoint wins.
      const mid = window.innerHeight / 2;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= mid && bottom > mid) {
          current = id;
          break;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    // Section offsets move as the boot loader clears, fonts land and GSAP adds
    // its pin-spacers, and none of that fires a scroll event.
    const settle = [400, 1200, 2500].map((ms) => window.setTimeout(measure, ms));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      settle.forEach(window.clearTimeout);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
    };
  }, []);

  return (
    <nav
      className={`flex items-center gap-1 whitespace-nowrap font-mono text-[11px] ${className}`}
    >
      {nav.map((item) => {
        const isActive = active === item.href.slice(1);
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-sm px-1.5 py-1 uppercase tracking-[0.08em] transition-colors duration-200 ${
              isActive ? "bg-accent text-void" : "text-muted hover:text-ink"
            }`}
          >
            [·{item.label.replace(/ /g, "·")}·]
          </a>
        );
      })}
    </nav>
  );
}
