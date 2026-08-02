"use client";

import Reveal, { RevealItem } from "./Reveal";
import ParticleHeadline from "./ParticleHeadline";
import { CursorZone } from "./CursorTag";
import { hero, site } from "@/lib/content";

export default function Hero() {
  return (
    <CursorZone label="scroll ↓" as="section" className="relative">
      <div
        id="top"
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1200px] flex-col items-center justify-center px-5 pb-20 pt-[calc(var(--chrome-h)+56px)] text-center sm:px-8 sm:pb-24"
      >
        <Reveal stagger={0.1} className="flex w-full flex-col items-center">
          <RevealItem>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent sm:text-[11px] sm:tracking-[0.28em]">
              {hero.eyebrow}
            </p>
          </RevealItem>

          <RevealItem className="mt-8 w-full">
            <ParticleHeadline text={hero.headline} />
          </RevealItem>

          <RevealItem>
            <p className="mx-auto mt-5 max-w-[58ch] text-sm leading-relaxed text-muted sm:mt-8 sm:text-lg">
              {hero.sub}
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
              {hero.ctas.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className={
                    c.primary
                      ? "inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-void transition-transform duration-200 hover:-translate-y-0.5"
                      : "inline-flex items-center gap-2 rounded-sm border border-line px-5 py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:border-accent/60 hover:text-accent"
                  }
                >
                  [·{c.label.replace(/ /g, "·")}·]
                </a>
              ))}
            </div>
          </RevealItem>

          {/* The human counterpoint to the machine chrome. Serif italic, the
              same accent the other hand-written notes use. */}
          <RevealItem className="w-full">
            <figure className="mx-auto mt-7 max-w-[44ch] sm:mt-12">
              <blockquote className="font-serif text-base italic leading-relaxed text-muted sm:text-lg">
                {hero.manifesto.lead}{" "}
                <span className="text-accent-2">{hero.manifesto.turn}</span>
              </blockquote>
            </figure>
          </RevealItem>

          <RevealItem className="w-full">
            <dl className="mx-auto mt-10 hidden max-w-3xl grid-cols-2 sm:mt-14 sm:grid gap-x-8 gap-y-5 border-t border-line pt-8 font-mono text-[11px] sm:grid-cols-4">
              {hero.facts.map((f) => (
                <div key={f.k}>
                  <dt className="uppercase tracking-[0.2em] text-muted/60">{f.k}</dt>
                  <dd className="mt-1.5 text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </RevealItem>
        </Reveal>
      </div>

      {/* scroll hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/70">
        {site.name.toLowerCase()} · scroll to build ↓
      </div>
    </CursorZone>
  );
}
