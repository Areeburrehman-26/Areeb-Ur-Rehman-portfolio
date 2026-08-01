"use client";

import { CursorZone } from "./CursorTag";
import { site } from "@/lib/content";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    // Tag hides here so the giant wordmark gets the last word.
    <CursorZone label={null} as="footer" className="relative z-10 overflow-hidden bg-void">
      {/* editor tab strip */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1500px] items-stretch gap-px px-5 font-mono text-[11px] sm:px-8">
          <span className="flex items-center gap-2 border-x border-line bg-navy px-4 py-2.5 text-ink">
            <span className="h-2 w-2 rounded-full bg-accent" />
            portfolio.tsx
          </span>
          <span className="hidden items-center gap-2 border-r border-line px-4 py-2.5 text-muted/60 sm:flex">
            contact.ts
          </span>
          <span className="ml-auto hidden items-center gap-2 px-4 py-2.5 text-muted/60 sm:flex">
            1 visitor online · utf-8 · ln {year}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 pt-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="max-w-[40ch] text-lg leading-relaxed text-muted">
              Building the system, then the intelligence on top of it.
              Available for new work.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 inline-block font-mono text-sm text-accent underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] sm:flex-col sm:items-end">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  [·{s.label}·]
                </a>
              </li>
            ))}
            <li className="text-muted/40">© {year}</li>
          </ul>
        </div>

        {/* giant wordmark, deliberately cut off at the bottom edge */}
        <div
          aria-hidden
          className="pointer-events-none mt-14 -mb-[6vw] select-none"
        >
          {site.wordmark.map((line) => (
            <span
              key={line}
              className="block whitespace-nowrap text-[15.5vw] font-bold leading-[0.8] tracking-[-0.05em] text-ink/[0.09]"
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </CursorZone>
  );
}
