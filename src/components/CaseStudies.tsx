"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "./ScrambleText";
import Reveal, { RevealItem } from "./Reveal";
import { CursorZone } from "./CursorTag";
import ProjectVisual from "./visuals/ProjectVisual";
import { projects, type Project } from "@/lib/content";
import { useIsNarrow, useMounted, usePrefersReducedMotion } from "@/lib/hooks";

const EASE_MECH = "cubic-bezier(0.65, 0, 0.35, 1)";
const N = projects.length;
/** Vertical scroll spent per project while the section is pinned. */
const SCROLL_PER_CARD = 75;

/**
 * Generated stand-in artwork. Replace by setting `image` on the project in
 * src/lib/content.ts once real screenshots exist in /public/projects/.
 */
function MockArt({ p, live }: { p: Project; live: boolean }) {
  const c = (l: number, a = 1) => `hsla(${p.hue}, 70%, ${l}%, ${a})`;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(150deg, ${c(16)} 0%, #06070c 55%, ${c(11)} 100%)`,
        }}
      />
      <div className="grid-paper absolute inset-0 opacity-70" />
      <div
        className="absolute -right-10 -top-10 h-56 w-56 rounded-full blur-3xl"
        style={{ background: c(55, 0.35) }}
      />

      {/* fake app chrome */}
      <div className="absolute inset-x-5 top-5 flex items-center gap-1.5">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="h-2 w-2 rounded-full"
            style={{ background: c(60, d === 0 ? 0.9 : 0.35) }}
          />
        ))}
        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">
          {p.id}.app
        </span>
      </div>

      {/* animated illustration of what this project actually does */}
      {live && <ProjectVisual id={p.id} hue={p.hue} />}

      <span className="absolute bottom-2 left-5 font-mono text-[8px] uppercase tracking-[0.2em] text-ink/25">
        [· img: /projects/{p.id}.png ·]
      </span>
    </div>
  );
}

/**
 * `offset` is the card's signed distance from the active position and may be
 * fractional — while pinned it tracks scroll continuously, so the deck slides
 * sideways rather than snapping between slots.
 */
function Card({
  p,
  offset,
  flat,
  scrubbed,
  onClick,
}: {
  p: Project;
  offset: number;
  flat: boolean;
  scrubbed: boolean;
  onClick: () => void;
}) {
  const abs = Math.abs(offset);
  const hidden = abs > 3.1;
  const near = abs < 0.5;

  const transform = flat
    ? `translateX(${offset * 8}%) scale(${near ? 1 : 0.94})`
    : `translateX(${offset * 58}%) translateZ(${-Math.min(abs, 3) * 165}px) rotateY(${
        gsap.utils.clamp(-26, 26, offset * -12)
      }deg)`;

  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={near ? 0 : -1}
      aria-hidden={!near}
      // No Tailwind translate utilities here: v4 emits them as the `translate`
      // property, which would stack on top of this inline transform.
      // Sized by width on phones (a height-derived card is wider than the
      // screen), by height from `sm` up so it fits the pinned viewport.
      className="absolute left-1/2 top-1/2 aspect-[16/11] w-[82vw] overflow-hidden rounded-md border border-line text-left sm:h-[min(34vh,300px)] sm:w-auto"
      style={{
        transform: `translate(-50%, -50%) ${transform}`,
        opacity: hidden ? 0 : Math.max(0, 1 - abs * 0.34),
        pointerEvents: hidden || !near ? "none" : "auto",
        zIndex: Math.round(100 - abs * 10),
        // Scroll drives the transform directly while pinned; a CSS transition
        // there would lag behind the scrubber.
        transition: scrubbed
          ? `opacity 200ms linear`
          : `transform 500ms ${EASE_MECH}, opacity 500ms ${EASE_MECH}`,
        boxShadow: near ? "0 30px 90px -30px rgba(0,0,0,0.9)" : "none",
      }}
    >
      {p.image ? (
        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="560px" />
      ) : (
        <MockArt p={p} live={abs < 1.2} />
      )}
      {!near && <span className="absolute inset-0 bg-void/45" />}
    </button>
  );
}

function Deck({
  pos,
  flat,
  scrubbed,
  onPick,
}: {
  pos: number;
  flat: boolean;
  scrubbed: boolean;
  onPick: (i: number) => void;
}) {
  return (
    <div
      className={`preserve-3d absolute inset-0 overflow-hidden ${flat ? "" : "scene"}`}
    >
      {projects.map((proj, i) => (
        <Card
          key={proj.id}
          p={proj}
          offset={i - pos}
          flat={flat}
          scrubbed={scrubbed}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}

/**
 * Shows the interaction itself: vertical scroll on the left driving horizontal
 * travel on the right. Cheaper to read than a sentence explaining it.
 */
function ScrollCue() {
  return (
    <div className="viz mt-4 flex items-center gap-3" aria-hidden>
      <span className="relative block h-8 w-4 rounded-full border border-line">
        <span
          className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent"
          style={{ animation: "cue-down 1.8s ease-in-out infinite" }}
        />
      </span>
      <span className="text-[10px] text-muted/50">→</span>
      <span className="relative block h-4 flex-1 overflow-hidden rounded-full border border-line">
        <span
          className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-2"
          style={{ animation: "cue-right 1.8s ease-in-out infinite" }}
        />
      </span>
    </div>
  );
}

function ProjectIndex({
  active,
  onPick,
  hint,
  cue,
}: {
  active: number;
  onPick: (i: number) => void;
  hint: string[];
  cue: "scroll" | "none";
}) {
  return (
    <div>
      <ul className="space-y-1 border-l border-line pl-4">
        {projects.map((proj, i) => (
          <li key={proj.id}>
            <button
              type="button"
              onClick={() => onPick(i)}
              // State indicator, not decoration: it flips the instant the
              // transition starts rather than when it lands.
              className={`w-full text-left font-mono text-[11px] uppercase leading-tight tracking-[0.1em] transition-colors ${
                i === active ? "font-bold text-accent" : "text-muted hover:text-ink"
              }`}
            >
              <span className="mr-2 text-muted/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              {proj.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 hidden border border-line p-4 [@media(min-height:760px)]:block">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          [· how to explore ·]
        </p>

        {cue === "scroll" && <ScrollCue />}

        <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          {hint.map((h) => (
            // Bullet in its own cell so wrapped lines stay hanging-indented.
            <li key={h} className="flex gap-2">
              <span className="text-accent/60">·</span>
              <span className="flex-1 leading-[1.6]">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Decode panel — re-scrambles whenever the active project changes. */
function ProjectPanel({ p, compact }: { p: Project; compact: boolean }) {
  return (
    <div className={compact ? "border-t border-line pt-5" : "border-t border-line pt-8"}>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent-2">
        [·{p.tag}·]
      </p>
      <ScrambleText
        key={`${p.id}-name`}
        as="h3"
        trigger="immediate"
        text={p.name}
        className={`mt-2 block font-semibold tracking-[-0.02em] text-ink ${
          compact ? "text-xl" : "text-2xl sm:text-3xl"
        }`}
      />
      <dl className={`grid gap-5 sm:grid-cols-3 ${compact ? "mt-4" : "mt-6"}`}>
        {(
          [
            ["problem", p.problem, "text-muted"],
            ["build", p.build, "text-muted"],
            ["outcome", p.outcome, "text-ink"],
          ] as const
        ).map(([label, value, tone]) => (
          <div key={label}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted/50">
              {label}
            </dt>
            <dd
              className={`mt-2 leading-relaxed ${tone} ${
                compact ? "line-clamp-4 text-[13px] leading-snug" : "text-sm"
              }`}
            >
              {label === "problem" ? (
                <ScrambleText
                  key={`${p.id}-problem`}
                  trigger="immediate"
                  text={p.problem}
                />
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>
      {!compact && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <li
              key={s}
              className="rounded-sm border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SectionHeader({ compact }: { compact: boolean }) {
  return (
    <Reveal className={compact ? "shrink-0" : "mb-12"}>
      <RevealItem>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          [·selected·work·]
        </p>
      </RevealItem>
      <RevealItem>
        <h2
          className={`mt-3 max-w-[18ch] font-semibold leading-[0.98] tracking-[-0.03em] text-ink ${
            compact
              ? "text-[clamp(1.8rem,3.4vw,3rem)]"
              : "text-[clamp(2.1rem,5.4vw,4.4rem)]"
          }`}
        >
          Problem. Build. Outcome.
        </h2>
      </RevealItem>
    </Reveal>
  );
}

/* ── Desktop: pinned, scroll drives the deck sideways ────────────────── */

function ScrubCarousel() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [pos, setPos] = useState(0);
  const active = Math.min(N - 1, Math.max(0, Math.round(pos)));

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: `+=${N * SCROLL_PER_CARD}%`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Progress maps straight onto the deck position, so vertical scroll
        // reads as horizontal travel through the projects.
        onUpdate: (self) => setPos(self.progress * (N - 1)),
      });
    }, rootRef);

    return () => {
      stRef.current = null;
      ctx.revert();
    };
  }, []);

  /** Jumping to a project means scrolling to its slice of the pinned range. */
  const jumpTo = useCallback((i: number) => {
    const st = stRef.current;
    if (!st) return;
    const target = st.start + (i / (N - 1)) * (st.end - st.start);
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = stRef.current;
      if (!st || st.progress <= 0 || st.progress >= 1) return;
      if (e.key === "ArrowRight") jumpTo(Math.min(N - 1, active + 1));
      if (e.key === "ArrowLeft") jumpTo(Math.max(0, active - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, jumpTo]);

  return (
    <CursorZone label="scroll ↓" className="contents">
      <div
        ref={rootRef}
        className="relative flex h-[100svh] w-full flex-col overflow-hidden"
      >
        {/* deck-local progress bar */}
        <div className="absolute inset-x-0 top-0 z-30 h-[2px] bg-line/60">
          <div
            className="h-full origin-left bg-accent-2"
            style={{ transform: `scaleX(${N > 1 ? pos / (N - 1) : 1})` }}
          />
        </div>

        <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col px-6 pb-6 pt-[calc(var(--chrome-h)+18px)] lg:px-14">
          <SectionHeader compact />

          <div className="mt-4 grid min-h-0 flex-1 gap-6 lg:grid-cols-[230px_minmax(0,1fr)] xl:gap-10">
            <ProjectIndex
              active={active}
              onPick={jumpTo}
              cue="scroll"
              hint={[
                "scroll down - the deck moves sideways",
                "click a title to jump to it",
                "← → to step one at a time",
              ]}
            />

            <div className="flex min-h-0 flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <Deck pos={pos} flat={false} scrubbed onPick={jumpTo} />
              </div>
              <ProjectPanel p={projects[active]} compact />
            </div>
          </div>
        </div>
      </div>
    </CursorZone>
  );
}

/* ── Narrow / reduced motion: stepped, no pinning ────────────────────── */

function SteppedCarousel({ flat }: { flat: boolean }) {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + N) % N),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-14">
      <SectionHeader compact={false} />

      <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div className="order-2 lg:order-1">
          <ProjectIndex
            active={active}
            onPick={setActive}
            cue="none"
            hint={["click a card or title", "← → arrow keys", "swipe on touch"]}
          />
        </div>

        <div className="order-1 lg:order-2">
          <div
            className="relative h-[42vh] min-h-[300px] w-full overflow-hidden"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Deck pos={active} flat={flat} scrubbed={false} onPick={setActive} />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous project"
              className="rounded-sm border border-line px-3 py-2 font-mono text-[11px] text-ink transition-colors hover:border-accent/60 hover:text-accent"
            >
              [·back·]
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next project"
              className="rounded-sm border border-line px-3 py-2 font-mono text-[11px] text-ink transition-colors hover:border-accent/60 hover:text-accent"
            >
              [·next·]
            </button>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-8">
            <ProjectPanel p={projects[active]} compact={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const reduced = usePrefersReducedMotion();
  const narrow = useIsNarrow();
  const mounted = useMounted();

  // SSR and low-motion / narrow clients get the plain stepped deck; capable
  // desktop clients upgrade to the pinned scrub after mount.
  const scrub = mounted && !reduced && !narrow;

  return (
    <section id="work" className="relative z-10 bg-plum">
      {scrub ? <ScrubCarousel /> : <SteppedCarousel flat={reduced} />}
    </section>
  );
}
