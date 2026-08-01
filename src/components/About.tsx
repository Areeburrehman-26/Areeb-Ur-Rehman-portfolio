"use client";

import Reveal, { RevealItem } from "./Reveal";
import ScrambleText from "./ScrambleText";
import { about, site } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="relative z-10 bg-void">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8">
        <Reveal className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <RevealItem>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                {about.eyebrow}
              </p>
            </RevealItem>

            <RevealItem>
              <div className="relative mt-6">
                {/* hand-written accent against the systematic UI chrome */}
                <span className="absolute -top-7 left-1 -rotate-6 font-serif text-xl italic text-accent-2/90">
                  {about.script}
                </span>
                <h2 className="max-w-[16ch] text-[clamp(2rem,5vw,3.8rem)] font-semibold leading-[1] tracking-[-0.03em] text-ink">
                  <ScrambleText text={about.headline} />
                </h2>
              </div>
            </RevealItem>

            {about.paragraphs.map((para) => (
              <RevealItem key={para.slice(0, 24)}>
                <p className="mt-6 max-w-[62ch] leading-relaxed text-muted">{para}</p>
              </RevealItem>
            ))}
          </div>

          <RevealItem className="lg:pt-24">
            <div className="border border-line bg-navy/40 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted/50">
                [· profile ·]
              </p>
              <dl className="mt-5 space-y-4">
                {about.facts.map((f) => (
                  <div key={f.k} className="border-b border-line/70 pb-4 last:border-0">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                      {f.k}
                    </dt>
                    <dd className="mt-1 text-sm text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="#contact"
                className="mt-6 inline-block rounded-sm border border-accent/50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-void"
              >
                [·work·with·{site.name.split(" ")[0].toLowerCase()}·]
              </a>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
