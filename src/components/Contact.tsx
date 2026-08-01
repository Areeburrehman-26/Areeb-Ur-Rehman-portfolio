"use client";

import { useState } from "react";
import Reveal, { RevealItem } from "./Reveal";
import ScrambleText from "./ScrambleText";
import { contact, site } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-sm border border-line bg-void px-3 py-3 font-mono text-sm text-ink outline-none transition-colors placeholder:text-muted/40 focus:border-accent";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    // Capture before awaiting — currentTarget is nulled out after the handler.
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="contact" className="relative z-10 bg-plum">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8">
        <Reveal className="mb-14">
          <RevealItem>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {contact.eyebrow}
            </p>
          </RevealItem>
          <RevealItem>
            <h2 className="mt-4 text-[clamp(2.2rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-ink">
              <ScrambleText text={contact.headline} />
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-5 max-w-[56ch] leading-relaxed text-muted">{contact.sub}</p>
          </RevealItem>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* form */}
          <Reveal className="border border-line bg-void/70 p-6 sm:p-8">
            <RevealItem>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted/50">
                [· send a brief ·]
              </p>
            </RevealItem>
            <RevealItem>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                      name
                    </span>
                    <input name="name" required className={field} placeholder="your name" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                      business
                    </span>
                    <input
                      name="business"
                      className={field}
                      placeholder="company / project"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                    email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    className={field}
                    placeholder="you@company.com"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                    what do you need help with?
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className={`${field} resize-none`}
                    placeholder="No system yet / the current one is fighting us / we need AI in it…"
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-sm bg-accent px-5 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-void transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {status === "sending"
                    ? "[·sending·]"
                    : status === "sent"
                      ? "[·received·]"
                      : "[·send·brief·]"}
                </button>

                <p
                  aria-live="polite"
                  className="min-h-[18px] font-mono text-[10px] uppercase tracking-[0.16em]"
                >
                  {status === "sent" && (
                    <span className="text-accent-2">
                      got it - reply usually within a day
                    </span>
                  )}
                  {status === "error" && <span className="text-accent">{error}</span>}
                </p>
              </form>
            </RevealItem>
          </Reveal>

          {/* call CTA - deliberately the same visual weight as the form */}
          <Reveal className="flex flex-col justify-between border border-line bg-void/70 p-6 sm:p-8">
            <RevealItem>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted/50">
                [· or talk it through ·]
              </p>
              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.02em] text-ink">
                {contact.callHeading}
              </h3>
              <p className="mt-4 max-w-[42ch] leading-relaxed text-muted">
                {contact.callBody}
              </p>
              <ul className="mt-8 space-y-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {contact.callPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="text-accent">·</span>
                    {point}
                  </li>
                ))}
              </ul>
            </RevealItem>

            <RevealItem className="mt-8">
              <a
                href={site.callUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-sm border border-accent px-5 py-3 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-void"
              >
                [·book·30·minutes·]
              </a>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 block text-center font-mono text-[11px] text-muted underline-offset-4 hover:text-ink hover:underline"
              >
                {site.email}
              </a>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
