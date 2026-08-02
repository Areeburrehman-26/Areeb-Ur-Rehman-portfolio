"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

type Particle = {
  hx: number; // home position
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

/** Pointer repulsion field. */
const RADIUS = 130;
const FORCE = 2.6;
/** Spring pulling each particle back to its letterform position. */
const RETURN = 0.055;
const DAMPING = 0.86;

/**
 * Colour does semantic work here rather than decoration. Each listed word gets
 * a gradient swept left to right, and its meaning picks the hue: synthetic is
 * violet, dead is grey, traded is teal, and the human payoff is the warm site
 * accent. Four hues drawn from the palette, deliberately not a spectrum.
 *
 * FUTURE appears twice and the two are opposites: the one being sold to us,
 * then the real one. They are coloured against each other on purpose.
 */
const WORD_COLORS: Record<string, [string, string]> = {
  AI: ["#c4b5fd", "#7c5cf0"],
  PAST: ["#8b95ad", "#4a5266"],
  SOLD: ["#3ee0cb", "#0f9e8e"],
  "FUTURE#1": ["#707a90", "#434b5d"],
  "FUTURE#2": ["#ff8a3d", "#ff6a1a"],
  HUMAN: ["#ff6a1a", "#ff9a4d"],
  CREATIVITY: ["#ff9a4d", "#ffd39b"],
};

/** Everything not called out above. */
const DEFAULT_COLOR: [string, string] = ["#e9edf6", "#9aa4b8"];

const normalize = (word: string) => word.replace(/[^A-Za-z]/g, "").toUpperCase();

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(
    g1 + (g2 - g1) * t,
  )},${Math.round(b1 + (b2 - b1) * t)})`;
}

/** Resolves a word to its gradient, counting repeats so FUTURE#1 != FUTURE#2. */
function makeResolver() {
  const seen = new Map<string, number>();
  return (raw: string): [string, string] => {
    const key = normalize(raw);
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    return WORD_COLORS[`${key}#${n}`] ?? WORD_COLORS[key] ?? DEFAULT_COLOR;
  };
}

/**
 * Renders a headline as a field of particles sampled from the letterforms.
 * The pointer pushes particles out of the way and they spring back.
 *
 * The real text is always in the DOM for screen readers and for reduced
 * motion; the canvas is decorative on top of it.
 */
export default function ParticleHeadline({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  // Below ~640px the dot grid is coarser than the letterforms and the headline
  // stops being readable — and there is no cursor to push the particles with.
  const small = useMediaQuery("(max-width: 639px)");
  const plain = reduced || small;
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (plain) {
      // Drop any height a previous canvas run measured.
      if (host) host.style.height = "";
      return;
    }
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999, active: false };

    /** Break the text into lines that fit the available width. */
    const layout = (maxWidth: number) => {
      const words = text.toUpperCase().split(" ");
      const lines: string[][] = [];
      let line: string[] = [];
      for (const word of words) {
        const next = [...line, word];
        if (ctx.measureText(next.join(" ")).width > maxWidth && line.length) {
          lines.push(line);
          line = [word];
        } else {
          line = next;
        }
      }
      if (line.length) lines.push(line);
      return lines;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      // Cap DPR: the sampling pass is the expensive part and 2x adds nothing
      // visible at this dot size.
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Size the type to the box, then let the line count set the height.
      // Longer strings step down so a full sentence lands in three or four
      // lines instead of towering over the rest of the hero.
      const ideal = width * 0.088;
      const lengthFactor = Math.sqrt(46 / Math.max(46, text.length));
      const fontSize = Math.max(24, Math.min(112, ideal * lengthFactor));
      const font = `700 ${fontSize}px ${getComputedStyle(host).fontFamily}`;

      ctx.font = font;
      const lines = layout(width * 0.94);
      const lineHeight = fontSize * 1.02;
      height = Math.ceil(lines.length * lineHeight + fontSize * 0.35);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      host.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // Drawn word by word, so each recorded box is exactly where its glyphs
      // landed and the colour lookup cannot drift out of alignment.
      const spaceW = ctx.measureText(" ").width;
      const boxes: {
        x0: number;
        x1: number;
        line: number;
        grad: [string, string];
      }[] = [];
      const resolveWord = makeResolver();

      lines.forEach((words, li) => {
        const widths = words.map((w) => ctx.measureText(w).width);
        const total =
          widths.reduce((a, b) => a + b, 0) + spaceW * (words.length - 1);
        let x = (width - total) / 2;
        const y = lineHeight * (li + 0.5) + fontSize * 0.12;
        words.forEach((w, wi) => {
          ctx.fillText(w, x, y);
          boxes.push({
            x0: x,
            x1: x + widths[wi],
            line: li,
            grad: resolveWord(w),
          });
          x += widths[wi] + spaceW;
        });
      });

      // Sample the rendered glyphs on a grid; every inked cell becomes a dot,
      // coloured by the word it belongs to.
      const step = width < 640 ? 5 : 4;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const next: Particle[] = [];
      for (let y = 0; y < height; y += step) {
        const li = Math.floor(y / lineHeight);
        for (let x = 0; x < width; x += step) {
          const px = Math.floor(x * dpr);
          const py = Math.floor(y * dpr);
          if (data[(py * canvas.width + px) * 4 + 3] < 128) continue;

          const box = boxes.find(
            (b) => b.line === li && x >= b.x0 - 2 && x <= b.x1 + 2,
          );
          const [ca, cb] = box ? box.grad : DEFAULT_COLOR;
          // Quantised so the frame loop has few fillStyle changes.
          const raw = box ? (x - box.x0) / Math.max(1, box.x1 - box.x0) : 0.5;
          const t = Math.round(Math.min(1, Math.max(0, raw)) * 10) / 10;
          const base = mix(ca, cb, t);
          // A quarter of the dots sit a shade back, so the fill reads as a
          // matrix of lights rather than flat paint.
          const color = Math.random() < 0.25 ? mix(base, "#39404f", 0.45) : base;

          next.push({
            hx: x,
            hy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            size: step - 1.4,
            color,
          });
        }
      }
      // Grouping by colour collapses per-particle state changes in the loop.
      next.sort((a, b) => (a.color < b.color ? -1 : a.color > b.color ? 1 : 0));
      particles = next;
      ctx.clearRect(0, 0, width, height);
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);

      let last = "";
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.001) {
            const push = ((RADIUS - dist) / RADIUS) * FORCE;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        }

        p.vx += (p.hx - p.x) * RETURN;
        p.vy += (p.hy - p.y) * RETURN;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        if (p.color !== last) {
          ctx.fillStyle = p.color;
          last = p.color;
        }
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      build();
      raf = requestAnimationFrame(frame);
    };

    // Sampling before the webfont lands would trace the fallback face.
    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      // Drop the measured height so the plain-text fallback can size itself
      // if the viewport crosses the breakpoint.
      host.style.height = "";
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [text, plain]);

  // The plain-text heading carries the same colour logic, so phones and
  // reduced-motion visitors get the meaning too.
  const resolveWord = makeResolver();
  const words = text.split(" ").map((w) => ({ word: w, grad: resolveWord(w) }));

  return (
    <div ref={hostRef} className={`relative w-full font-sans ${className}`}>
      <h1
        className={`text-center text-[clamp(1.9rem,6.6vw,5.4rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em] ${
          plain ? "" : "sr-only"
        }`}
      >
        {words.map(({ word, grad }, i) => (
          <span key={`${word}-${i}`}>
            {i > 0 ? " " : null}
            <span
              className="inline-block"
              style={{
                backgroundImage: `linear-gradient(100deg, ${grad[0]}, ${grad[1]})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </h1>
      {!plain && <canvas ref={canvasRef} aria-hidden className="block w-full" />}
    </div>
  );
}
