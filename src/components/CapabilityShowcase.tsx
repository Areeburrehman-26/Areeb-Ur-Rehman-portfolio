"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SystemObject from "./SystemObject";
import ScrambleText from "./ScrambleText";
import { CursorZone } from "./CursorTag";
import { capabilities } from "@/lib/content";
import { useIsNarrow, useMounted, usePrefersReducedMotion } from "@/lib/hooks";

const N = capabilities.length;

/* ── shared chrome ──────────────────────────────────────────────────── */

function CornerBrackets({ animate }: { animate: boolean }) {
  const base =
    "pointer-events-none absolute h-7 w-7 border-accent/70 " +
    (animate ? "bracket-pulse" : "opacity-70");
  return (
    <div aria-hidden>
      <span className={`${base} left-4 top-4 border-l border-t sm:left-8 sm:top-8`} />
      <span className={`${base} right-4 top-4 border-r border-t sm:right-8 sm:top-8`} />
      <span
        className={`${base} bottom-4 left-4 border-b border-l sm:bottom-8 sm:left-8`}
      />
      <span
        className={`${base} bottom-4 right-4 border-b border-r sm:bottom-8 sm:right-8`}
      />
    </div>
  );
}

function IconRail({
  active,
  onPick,
  layout = "rail",
}: {
  active: number;
  onPick?: (i: number) => void;
  /** "rail" pins to the right edge; "row" flows inline (mobile stepper). */
  layout?: "rail" | "row";
}) {
  return (
    <div
      className={
        layout === "rail"
          ? "absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 sm:right-6 sm:gap-3"
          : "relative z-20 mt-8 flex flex-wrap justify-center gap-2"
      }
    >
      {capabilities.map((c, i) => {
        const on = i === active;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick?.(i)}
            aria-label={c.chapter}
            aria-current={on ? "true" : undefined}
            className="grid h-9 w-9 place-items-center rounded-full border text-[13px] transition-all duration-200 sm:h-10 sm:w-10"
            style={{
              borderColor: on ? "var(--color-accent)" : "var(--color-line)",
              background: on ? "var(--color-accent)" : "transparent",
              color: on ? "var(--color-void)" : "var(--color-ink)",
              opacity: on ? 1 : 0.4,
              transform: on ? "scale(1.15)" : "scale(1)",
            }}
          >
            {c.icon}
          </button>
        );
      })}
    </div>
  );
}

function Callouts({ index }: { index: number }) {
  const cap = capabilities[index];
  return (
    <AnimatePresence mode="sync">
      {cap.callouts.map((co) => {
        // Anchors past the midline point leftward, otherwise the label runs off
        // the right edge and under the icon rail on narrower desktops.
        const flip = co.x > 48;
        return (
          <motion.div
            key={`${cap.id}-${co.text}`}
            initial={{ opacity: 0, x: flip ? 8 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: flip ? 8 : -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            // Hidden on narrow screens, where they would sit on top of the object.
            className={`pointer-events-none absolute z-20 hidden items-center gap-2 lg:flex ${
              flip ? "flex-row-reverse" : ""
            }`}
            style={{
              left: flip ? "auto" : `${co.x}%`,
              right: flip ? `${100 - co.x}%` : "auto",
              top: `${co.y}%`,
            }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
            <span className="h-px w-6 shrink-0 bg-accent-2/60" />
            <span className="whitespace-nowrap rounded-sm border border-accent-2/30 bg-void/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent-2 backdrop-blur-sm">
              {co.text}
            </span>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

function ChapterCopy({ index }: { index: number }) {
  const cap = capabilities[index];
  return (
    <div className="max-w-md">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        {cap.chapter}
      </p>
      <ScrambleText
        key={cap.id}
        as="h3"
        trigger="immediate"
        text={cap.headline}
        className="mt-4 block text-[clamp(1.6rem,3.4vw,2.9rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink"
      />
      <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
        {cap.body}
      </p>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted/50">
        {String(index + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
      </p>
    </div>
  );
}

/* ── Desktop: pinned + scrubbed ─────────────────────────────────────── */

function ScrubShowcase() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const rack = rootRef.current?.querySelector("[data-rack]");
      const light = rootRef.current?.querySelector("[data-light]");
      const slabs = gsap.utils.toArray<HTMLElement>("[data-slab]");
      if (!rack) return;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=450%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            setActive(Math.min(N - 1, Math.floor(self.progress * N)));
          },
        },
      });

      // Continuous Y rotation with a slow X wobble on the same timeline. The
      // sweep stays inside ±36° so the unit labels never turn edge-on.
      tl.to(rack, { rotationY: 36, duration: N }, 0)
        .to(rack, { rotationX: -4, duration: N / 2 }, 0)
        .to(rack, { rotationX: -20, duration: N / 2 }, N / 2);

      if (light) {
        tl.fromTo(
          light,
          { opacity: 0.35, x: -120, y: -60 },
          { opacity: 0.95, x: 140, y: 70, duration: N },
          0,
        );
      }

      // Each capability unit drops into the rack as its chapter arrives.
      slabs.forEach((slab, i) => {
        tl.fromTo(
          slab,
          { opacity: 0, y: -130, z: -90, rotationX: 24 },
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotationX: 0,
            duration: 0.75,
            ease: "power2.out",
          },
          Math.max(0, i - 0.4),
        );
      });

      // Label positions let anything else sync to the same clock.
      capabilities.forEach((c, i) => tl.addLabel(c.id, i));
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <CursorZone label="scroll to assemble" className="contents">
      <div
        ref={rootRef}
        className="relative flex h-[100svh] w-full flex-col overflow-hidden"
      >
        <CornerBrackets animate />

        {/* sequence-local progress bar */}
        <div className="absolute inset-x-0 top-0 z-30 h-[2px] bg-line/60">
          <div
            className="h-full origin-left bg-accent-2"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        {/* oversized ghost wordmark behind the object */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <span className="select-none whitespace-nowrap text-[18vw] font-bold leading-none tracking-tighter text-ink/[0.035]">
            {capabilities[active].id.toUpperCase()}
          </span>
        </div>

        <div className="relative z-10 mx-auto grid h-full w-full max-w-[1400px] grid-cols-1 items-center gap-6 px-6 pt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-16">
          <ChapterCopy index={active} />
          <div className="relative h-[46vh] w-full overflow-hidden lg:h-[70vh]">
            <Callouts index={active} />
            <SystemObject active={active} />
          </div>
        </div>

        <IconRail active={active} />
      </div>
    </CursorZone>
  );
}

/* ── Mobile / reduced motion: stepped sequence, no pinning ──────────── */

function SteppedShowcase({ autoRotate }: { autoRotate: boolean }) {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = (dir: number) =>
    setActive((i) => Math.max(0, Math.min(N - 1, i + dir)));

  return (
    <div
      className="relative w-full overflow-hidden py-16"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <CornerBrackets animate={false} />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div
          className={`relative mx-auto h-[42vh] max-h-[380px] w-full overflow-hidden ${
            autoRotate
              ? "[&_[data-rack]]:animate-[rack-spin_22s_ease-in-out_infinite]"
              : ""
          }`}
        >
          <Callouts index={active} />
          <SystemObject active={active} />
        </div>

        <div className="mt-10">
          <ChapterCopy index={active} />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={active === 0}
            aria-label="Previous capability"
            className="rounded-sm border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink disabled:opacity-30"
          >
            [·prev·]
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={active === N - 1}
            className="rounded-sm border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink disabled:opacity-30"
          >
            [·next·]
          </button>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
            swipe →
          </span>
        </div>

        <IconRail active={active} onPick={setActive} layout="row" />
      </div>
    </div>
  );
}

/* ── Entry point ────────────────────────────────────────────────────── */

export default function CapabilityShowcase() {
  const reduced = usePrefersReducedMotion();
  const narrow = useIsNarrow();
  const mounted = useMounted();

  // SSR and low-motion clients get the plain stepped sequence; capable desktop
  // clients upgrade to the pinned scrub after mount.
  const scrub = mounted && !reduced && !narrow;

  return (
    <section id="systems" className="relative z-10 bg-navy">
      <div className="border-y border-line/60">
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted/60">
            [·what·i·build·] - six systems, one stack
          </p>
        </div>
      </div>
      {scrub ? <ScrubShowcase /> : <SteppedShowcase autoRotate={mounted && !reduced} />}
    </section>
  );
}
