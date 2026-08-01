"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const SYMBOLS = "!<>-_\\/[]{}-=+*^?#";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

type Trigger = "view-once" | "view-always" | "immediate";

/**
 * Decode/scramble text. Each character cycles through 3-8 random glyphs at
 * 30-50ms per frame, then locks — staggered ~25ms apart left to right, so the
 * word resolves as a wave rather than settling all at once.
 */
export default function ScrambleText({
  text,
  className = "",
  trigger = "view-once",
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  trigger?: Trigger;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const reduced = usePrefersReducedMotion();
  const hostRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState<string[]>(() => text.split(""));
  const [locked, setLocked] = useState<boolean[]>(() =>
    text.split("").map(() => true),
  );
  const rafRef = useRef<number | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Reduced motion renders the resolved string straight from `text` below,
    // so there is no animation to start and no state to write here.
    if (reduced) return;

    const chars = text.split("");

    // Bias the scramble pool toward the string's own letters so it reads as a
    // decode of *this* word rather than generic noise.
    const ownAlphabet = Array.from(new Set(chars.filter((c) => c.trim()))).join("");
    const pool = (ownAlphabet + ownAlphabet + SYMBOLS).split("");

    const run = () => {
      const start = performance.now() + delay;
      // ~25ms between character locks, compressed for long strings so a
      // paragraph still resolves in well under a second.
      const perChar = Math.min(rand(20, 30), 700 / Math.max(1, chars.length));
      const plan = chars.map((c, i) => {
        if (!c.trim()) return { lockAt: 0, frameMs: 0 };
        const frames = randInt(3, 8);
        const frameMs = rand(30, 50);
        return { lockAt: i * perChar + frames * frameMs, frameMs };
      });

      const tick = (now: number) => {
        const t = now - start;
        if (t < 0) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const nextFrame: string[] = [];
        const nextLocked: boolean[] = [];
        let done = true;

        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          const { lockAt, frameMs } = plan[i];
          if (t >= lockAt) {
            nextFrame.push(c);
            nextLocked.push(true);
          } else {
            done = false;
            // Re-roll on a per-character frame cadence, not every rAF.
            const step = Math.floor(t / frameMs);
            const idx = (step * 7 + i * 13) % pool.length;
            nextFrame.push(pool[idx]);
            nextLocked.push(false);
          }
        }

        setFrame(nextFrame);
        setLocked(nextLocked);
        if (!done) rafRef.current = requestAnimationFrame(tick);
      };

      setLocked(chars.map((c) => !c.trim()));
      rafRef.current = requestAnimationFrame(tick);
    };

    if (trigger === "immediate") {
      run();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const el = hostRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (trigger === "view-once" && hasRunRef.current) return;
            hasRunRef.current = true;
            run();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, trigger, delay, reduced]);

  // Group characters into words. One span per character with span-wrapped
  // spaces leaves the line no legal break point, so it overflows its column
  // instead of wrapping. Inline-block words separated by real space text nodes
  // wrap normally and never break mid-word.
  const source = reduced ? text.split("") : frame;
  const words: { char: string; index: number }[][] = [];
  let current: { char: string; index: number }[] = [];
  source.forEach((char, index) => {
    if (text[index] === " ") {
      words.push(current);
      current = [];
    } else {
      current.push({ char, index });
    }
  });
  words.push(current);

  return (
    <Tag
      ref={hostRef as never}
      // Block, so the words lay out against this element's own width.
      className={`block ${className}`}
      aria-label={text}
      suppressHydrationWarning
    >
      <span aria-hidden>
        {words.map((word, wi) => (
          <span key={wi}>
            {wi > 0 ? " " : null}
            <span className="inline-block">
              {word.map(({ char, index }) => (
                <span
                  key={index}
                  className={
                    reduced || locked[index]
                      ? "transition-colors duration-75"
                      : "text-muted/70 transition-colors duration-75"
                  }
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
