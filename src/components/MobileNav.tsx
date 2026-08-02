"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Hamburger for viewports below `lg`, where the bracketed nav does not fit.
 * Opens a full-screen sheet rather than a dropdown so the links stay large
 * enough to hit on a phone.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Lock the page behind the sheet, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        // The sheet is a sibling inside the header's stacking context, so the
        // button needs its own layer above it to stay tappable when open.
        className="relative z-[100] flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded-sm border border-line bg-navy/80"
      >
        <span
          className={`block h-px w-4 bg-ink transition-transform duration-200 ${
            open ? "translate-y-[3px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-4 bg-ink transition-transform duration-200 ${
            open ? "-translate-y-[3px] -rotate-45" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.12 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[95] bg-void"
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-[calc(var(--chrome-h)+32px)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted/50">
                [· menu ·]
              </p>

              <nav className="mt-8 flex flex-col gap-1">
                {nav.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: reduced ? 0 : 0.04 + i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-line/70 py-4 font-mono text-2xl uppercase tracking-[0.08em] text-ink"
                  >
                    <span className="text-accent">[·</span>
                    {item.label}
                    <span className="text-accent">·]</span>
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto space-y-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                <a
                  href={site.resumeUrl}
                  download
                  onClick={() => setOpen(false)}
                  className="block rounded-sm bg-accent px-4 py-3 text-center text-void"
                >
                  [·download·resume·]
                </a>
                <a href={`mailto:${site.email}`} className="block text-accent">
                  {site.email}
                </a>
                <div className="flex gap-4 text-muted">
                  {site.socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                      [·{s.label}·]
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
