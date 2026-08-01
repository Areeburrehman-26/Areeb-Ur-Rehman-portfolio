"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal, { RevealItem } from "./Reveal";
import { CursorZone } from "./CursorTag";
import StepVisual from "./visuals/StepVisual";
import { processCards } from "@/lib/content";
import { useIsNarrow, useMounted, usePrefersReducedMotion } from "@/lib/hooks";

/** Fan angles by depth in the stack — alternating so it reads as a hand of cards. */
const ROT = [0, -4, 3, -2];
const N = processCards.length;
/** Vertical scroll spent per step while the section is pinned. */
const SCROLL_PER_STEP = 70;

function StepCard({
  card,
  depth,
}: {
  card: (typeof processCards)[number];
  /**
   * 0 = front. Positive = already passed, sitting behind in the fan.
   * Negative = not reached yet, waiting below the frame.
   */
  depth: number;
}) {
  const pending = depth < 0;
  const isFront = depth === 0;
  const k = Math.min(Math.max(depth, 0), ROT.length - 1);

  return (
    <article
      aria-hidden={pending}
      className={`absolute inset-0 rounded-md border p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)] transition-all duration-[420ms] ${
        isFront ? "border-accent/40 bg-void text-ink" : "border-line bg-navy text-muted"
      }`}
      style={{
        // Cards rise into the front slot as their step arrives, then settle
        // back into the fan as the next one takes over.
        transform: pending
          ? "translate3d(0, 90px, 0) scale(0.96) rotate(0deg)"
          : `translate3d(${k * 8}px, ${k * 10}px, 0) scale(${isFront ? 1.02 : 1}) rotate(${ROT[k]}deg)`,
        opacity: pending ? 0 : Math.max(0.35, 1 - k * 0.2),
        zIndex: 40 - k,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.24em] ${
          isFront ? "text-accent" : "text-muted/50"
        }`}
      >
        step {card.step}
      </p>
      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.01em]">{card.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-muted">{card.body}</p>

      {/* the animated illustration fills the card's lower half */}
      <div className="pointer-events-none absolute inset-x-6 bottom-12 top-[58%]">
        <StepVisual id={card.id} />
      </div>

      <span className="absolute bottom-6 right-7 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/40">
        {card.step}/{String(N).padStart(2, "0")}
      </span>
    </article>
  );
}

function Copy() {
  return (
    <Reveal>
      <RevealItem>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          [·how·i·work·]
        </p>
      </RevealItem>
      <RevealItem>
        <div className="relative mt-10">
          <span className="absolute -top-7 left-1 -rotate-6 font-serif text-xl italic text-accent-2/90">
            four steps, no theatre
          </span>
          <h2 className="max-w-[14ch] text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1] tracking-[-0.03em] text-ink">
            Small engagements and long builds run the same way.
          </h2>
        </div>
      </RevealItem>
      <RevealItem>
        <p className="mt-6 max-w-[52ch] leading-relaxed text-muted">
          You always know what exists, what it cost, and what happens next. No
          status theatre, no surprise invoices, no lock-in.
        </p>
      </RevealItem>
    </Reveal>
  );
}

/* ── Desktop: pinned, scroll steps 01 → 04 ───────────────────────────── */

function ScrubStack() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: `+=${N * SCROLL_PER_STEP}%`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) =>
          setActive(Math.min(N - 1, Math.floor(self.progress * N))),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <CursorZone label="scroll ↓" className="contents">
      <div ref={rootRef} className="relative h-[100svh] w-full overflow-hidden">
        <div className="mx-auto grid h-full max-w-[1200px] grid-cols-1 items-center gap-8 px-5 pt-[calc(var(--chrome-h)+18px)] sm:px-8 lg:grid-cols-2 xl:gap-12">
          <Copy />

          <div>
            <div className="relative mx-auto h-[min(60vh,440px)] w-full max-w-[440px]">
              {processCards.map((card, i) => (
                <StepCard key={card.id} card={card} depth={active - i} />
              ))}
            </div>

            {/* step ticks - a read-out of scroll position, not a control */}
            <div className="mx-auto mt-8 flex max-w-[440px] gap-2">
              {processCards.map((card, i) => (
                <span
                  key={card.id}
                  className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                  style={{
                    background:
                      i <= active ? "var(--color-accent)" : "var(--color-line)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </CursorZone>
  );
}

/* ── Narrow / reduced motion: plain stacked list ─────────────────────── */

function ListStack() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-start">
      <Copy />
      <div className="grid gap-4">
        {processCards.map((card) => (
          <article key={card.id} className="relative border border-line bg-void/70 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              step {card.step}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-ink">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
            <div className="pointer-events-none mt-4 h-24">
              <StepVisual id={card.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function ProcessStack() {
  const reduced = usePrefersReducedMotion();
  const narrow = useIsNarrow();
  const mounted = useMounted();
  const scrub = mounted && !reduced && !narrow;

  return (
    <section className="relative z-10 bg-navy">
      {scrub ? <ScrubStack /> : <ListStack />}
    </section>
  );
}
