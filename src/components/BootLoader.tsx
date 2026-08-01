"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { site } from "@/lib/content";

/* Deterministic PRNG so server and client draw identical circuit traces. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** How long the counter takes to walk 0 to 100. */
const BUDGET = 1800;

const HUES = ["#ff6a1a", "#2dd4bf", "#a78bfa", "#e9edf6"];

const TRACES = (() => {
  const r = seeded(20260801);
  return Array.from({ length: 10 }, (_, i) => {
    // Each trace is an orthogonal "circuit" polyline: horizontal then vertical legs.
    let x = r() * 100;
    let y = r() * 100;
    const pts: string[] = [`${x.toFixed(1)},${y.toFixed(1)}`];
    const legs = 3 + Math.floor(r() * 3);
    for (let l = 0; l < legs; l++) {
      if (l % 2 === 0) x = Math.max(2, Math.min(98, x + (r() - 0.5) * 46));
      else y = Math.max(2, Math.min(98, y + (r() - 0.5) * 46));
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return {
      points: pts.join(" "),
      color: HUES[i % HUES.length],
      opacity: 0.15 + r() * 0.15,
      delay: r() * 0.4,
      duration: 1.5 + r() * 1.0,
      width: 1 + r() * 0.5,
    };
  });
})();

export default function BootLoader() {
  const reduced = usePrefersReducedMotion();
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const finish = useCallback(() => {
    setPct(100);
    setDone(true);
  }, []);

  useEffect(() => {
    // The sequence runs on every load. It is short and skippable, and a
    // once-per-session skip meant a reload jumped straight past the counter.
    if (reduced) {
      const t = window.setTimeout(finish, 300);
      return () => window.clearTimeout(t);
    }

    startRef.current = performance.now();
    let value = 0;

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      // Irregular jumps, but never further ahead than the elapsed fraction of
      // the budget. Without that ceiling the counter dumps its whole
      // range in the first few ticks and reads as a jump from 0 to 100.
      const ceiling = Math.min(99, (elapsed / BUDGET) * 100);
      const next = Math.min(value + 3 + Math.random() * 12, ceiling);

      if (elapsed >= BUDGET) {
        setPct(100);
        timerRef.current = window.setTimeout(() => setDone(true), 140);
        return;
      }
      value = Math.max(value, next);
      setPct(value);
      timerRef.current = window.setTimeout(tick, 60 + Math.random() * 60);
    };
    // No initial delay: the counter should move on the first frame after
    // hydration, not sit on its server-rendered value.
    tick();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [reduced, finish]);

  // Lock scroll while the loader is up.
  useEffect(() => {
    if (done) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const shown = Math.min(100, Math.round(pct));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          onClick={finish}
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center bg-void"
        >
          {/* circuit traces */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {TRACES.map((t, i) => (
              <motion.polyline
                key={i}
                points={t.points}
                fill="none"
                stroke={t.color}
                strokeWidth={t.width}
                strokeOpacity={t.opacity}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: t.duration,
                  delay: t.delay,
                  ease: [0.4, 0.0, 0.2, 1],
                }}
              />
            ))}
          </svg>

          {/* scanline bars */}
          <div
            className="scanbar pointer-events-none absolute inset-x-0 top-0 h-20 opacity-50"
            style={{ ["--scan-dir" as string]: "to top" }}
          />
          <div
            className="scanbar pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-50"
            style={{ ["--scan-dir" as string]: "to bottom" }}
          />

          <div className="relative flex flex-col items-center gap-5 font-mono">
            <span className="text-xs uppercase tracking-[0.5em] text-accent">
              [·loading·]
            </span>
            <span className="text-6xl font-light tabular-nums text-ink sm:text-7xl">
              {String(shown).padStart(3, "0")}
              <span className="text-2xl text-muted">%</span>
            </span>
            <span className="h-px w-56 bg-line">
              <span
                className="block h-px bg-accent transition-[width] duration-100"
                style={{ width: `${shown}%` }}
              />
            </span>
            <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
              {site.name} · {site.role}
            </span>
            <span className="mt-4 text-[10px] uppercase tracking-[0.28em] text-muted/60">
              [ click | to&nbsp;skip ]
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
