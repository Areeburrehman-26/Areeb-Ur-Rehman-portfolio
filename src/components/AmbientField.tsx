"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const ORBS = [
  { top: "6%", left: "-8%", size: 520, color: "rgba(255,106,26,0.16)", dur: 28, delay: 0, depth: 90 },
  { top: "38%", left: "62%", size: 620, color: "rgba(45,212,191,0.12)", dur: 34, delay: -6, depth: 160 },
  { top: "72%", left: "8%", size: 480, color: "rgba(167,139,250,0.14)", dur: 30, delay: -12, depth: 220 },
  { top: "115%", left: "55%", size: 560, color: "rgba(255,106,26,0.10)", dur: 26, delay: -3, depth: 120 },
];

/**
 * Fixed, drifting orb field. Content scrolls past it; the orbs themselves move
 * only slightly with scroll, so the depth reads as parallax rather than a
 * scroll-locked background.
 */
export default function AmbientField() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -260]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 grid-paper opacity-60" />
      {ORBS.map((o, i) => (
        <motion.div
          key={i}
          style={{
            top: o.top,
            left: o.left,
            width: o.size,
            height: o.size,
            background: o.color,
            y: i % 2 === 0 ? y1 : y2,
            // consumed by the .orb keyframes
            ["--dur" as string]: `${o.dur}s`,
            ["--delay" as string]: `${o.delay}s`,
          }}
          className="orb"
        />
      ))}
      {/* vignette keeps text legible over the field */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,6,0.75)_100%)]" />
    </div>
  );
}
