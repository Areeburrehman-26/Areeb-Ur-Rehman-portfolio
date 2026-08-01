"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion, useIsCoarsePointer } from "@/lib/hooks";
import { site } from "@/lib/content";

/* ── Label context ──────────────────────────────────────────────────── */

type CursorCtx = {
  setLabel: (label: string | null) => void;
  resetLabel: () => void;
};

const Ctx = createContext<CursorCtx>({
  setLabel: () => {},
  resetLabel: () => {},
});

/**
 * Wrap any region to change the trailing cursor tag while the pointer is
 * inside it. `label={null}` hides the tag entirely (used by the footer).
 */
export function CursorZone({
  label,
  children,
  className,
  as: Tag = "div",
}: {
  label: string | null;
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "footer";
}) {
  const { setLabel, resetLabel } = useContext(Ctx);
  return (
    <Tag
      className={className}
      onMouseEnter={() => setLabel(label)}
      onMouseLeave={resetLabel}
    >
      {children}
    </Tag>
  );
}

/* ── The tag itself ─────────────────────────────────────────────────── */

const DEFAULT_LABEL = site.name.toLowerCase();

export function CursorTagProvider({ children }: { children: ReactNode }) {
  const [label, setLabelState] = useState<string | null>(DEFAULT_LABEL);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const appearTimer = useRef<number | null>(null);

  const setLabel = useCallback((next: string | null) => setLabelState(next), []);
  const resetLabel = useCallback(() => setLabelState(DEFAULT_LABEL), []);

  // Raw pointer position, then a spring so the tag trails rather than tracks 1:1.
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, { stiffness: 300, damping: 30, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 300, damping: 30, mass: 0.5 });

  const enabled = !coarse && !reduced;

  useEffect(() => {
    // `shown` below already gates on `enabled`, so there is nothing to reset.
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // +18/+18 keeps the pill clear of the pointer tip.
      rawX.set(e.clientX + 18);
      rawY.set(e.clientY + 18);
      if (appearTimer.current === null) {
        appearTimer.current = window.setTimeout(() => setVisible(true), 150);
      }
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      if (appearTimer.current !== null) window.clearTimeout(appearTimer.current);
      appearTimer.current = null;
    };
  }, [enabled, rawX, rawY]);

  const shown = enabled && visible && label !== null;

  return (
    <Ctx.Provider value={{ setLabel, resetLabel }}>
      {children}
      <AnimatePresence>
        {shown && (
          <motion.div
            key="cursor-tag"
            aria-hidden
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ x, y }}
            className="pointer-events-none fixed left-0 top-0 z-[120] select-none"
          >
            <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.075 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
