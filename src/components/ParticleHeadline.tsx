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
  accent: boolean;
};

const ACCENT = "#ff6a1a";
const INK = "#e9edf6";

/** Pointer repulsion field. */
const RADIUS = 130;
const FORCE = 2.6;
/** Spring pulling each particle back to its letterform position. */
const RETURN = 0.055;
const DAMPING = 0.86;

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
    const layout = (fontSize: number, maxWidth: number) => {
      ctx.font = `700 ${fontSize}px ${getComputedStyle(host).fontFamily}`;
      const words = text.toUpperCase().split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      // Cap DPR: the sampling pass is the expensive part and 2x adds nothing
      // visible at this dot size.
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Size the type to the box, then let the line count set the height.
      // Longer strings step down so a full sentence still lands in three or
      // four lines instead of towering over the rest of the hero.
      const ideal = width * 0.088;
      const lengthFactor = Math.sqrt(46 / Math.max(46, text.length));
      const fontSize = Math.max(24, Math.min(112, ideal * lengthFactor));
      const lines = layout(fontSize, width * 0.94);
      const lineHeight = fontSize * 1.02;
      height = Math.ceil(lines.length * lineHeight + fontSize * 0.35);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      host.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `700 ${fontSize}px ${getComputedStyle(host).fontFamily}`;
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, lineHeight * (i + 0.5) + fontSize * 0.12);
      });

      // Sample the rendered glyphs on a grid; every inked cell becomes a dot.
      const step = width < 640 ? 5 : 4;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const next: Particle[] = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const px = Math.floor(x * dpr);
          const py = Math.floor(y * dpr);
          const alpha = data[(py * canvas.width + px) * 4 + 3];
          if (alpha < 128) continue;
          next.push({
            hx: x,
            hy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            size: step - 1.4,
            // A minority of ink-coloured dots give the fill its speckle.
            accent: Math.random() > 0.26,
          });
        }
      }
      particles = next;
      ctx.clearRect(0, 0, width, height);
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);

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

        ctx.fillStyle = p.accent ? ACCENT : INK;
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

  return (
    <div ref={hostRef} className={`relative w-full font-sans ${className}`}>
      {/* Real text: the accessible copy, and the visible headline whenever the
          canvas is not running. */}
      <h1
        className={`text-center text-[clamp(1.9rem,6.6vw,5.4rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-ink ${
          plain ? "" : "sr-only"
        }`}
      >
        {text}
      </h1>
      {!plain && (
        <canvas ref={canvasRef} aria-hidden className="block w-full" />
      )}
    </div>
  );
}
