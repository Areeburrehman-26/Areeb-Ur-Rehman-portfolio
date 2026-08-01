"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import BracketNav from "./BracketNav";
import MobileNav from "./MobileNav";
import { site } from "@/lib/content";

const TICKS = Array.from({ length: 21 }, (_, i) => i); // 0…2000 in 100s

/**
 * Fixed IDE/terminal chrome: 1:1 scroll progress bar, logo chip, bracketed nav
 * (a hamburger below `lg`), a measuring ruler that fills with page progress,
 * and a scroll percentage badge.
 */
export default function TopChrome() {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setPct(Math.round(v * 100)),
  );

  return (
    <>
      {/* 5.3 - pinned progress bar, tied 1:1 to scroll with no smoothing */}
      <div className="fixed inset-x-0 top-0 z-[110] h-[3px] bg-transparent">
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="h-full w-full origin-left bg-gradient-to-r from-accent via-accent to-accent/10"
        />
      </div>

      <header className="fixed inset-x-0 top-[3px] z-[100] h-[41px] border-b border-line/80 bg-void lg:bg-void/85 lg:backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-3 sm:px-5">
          {/* logo chip */}
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2 rounded-sm border border-line bg-navy/80 px-2 py-1 font-mono text-[11px] text-ink transition-colors hover:border-accent/60"
          >
            <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-accent text-[9px] font-bold text-void">
              A
            </span>
            <span className="hidden sm:inline">portfolio.tsx</span>
          </a>

          <BracketNav className="hidden lg:flex" />

          {/* ruler */}
          <div className="relative hidden h-full flex-1 items-end overflow-hidden lg:flex">
            <div className="relative h-full w-full">
              <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-between">
                {TICKS.map((t) => (
                  <div key={t} className="flex flex-col items-center gap-0.5">
                    {t % 2 === 0 && (
                      <span className="font-mono text-[8px] leading-none text-muted/45">
                        {t * 100}
                      </span>
                    )}
                    <span
                      className={`w-px bg-line ${t % 2 === 0 ? "h-2.5" : "h-1.5"}`}
                    />
                  </div>
                ))}
              </div>
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-accent/70"
              />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="rounded-sm border border-line bg-navy/80 px-1.5 py-1 tabular-nums text-accent">
              {String(pct).padStart(2, "0")}%
            </span>
            <span className="hidden text-muted/60 xl:inline">{site.role}</span>
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}
