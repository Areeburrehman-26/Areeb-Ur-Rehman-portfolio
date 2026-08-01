"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

const hidden = {
  opacity: 0.3,
  filter: "blur(8px) saturate(0.6)",
  y: 24,
};

const shown = {
  opacity: 1,
  filter: "blur(0px) saturate(1)",
  y: 0,
};

/**
 * Reduced-motion states must still name `filter`. The first client render uses
 * the motion-capable snapshot, so omitting the key here would leave the
 * element stuck on the blur it was given before the preference was known.
 */
const reducedHidden = { opacity: 0, y: 12, filter: "blur(0px) saturate(1)" };
const reducedShown = { opacity: 1, y: 0, filter: "blur(0px) saturate(1)" };

/**
 * Blur-to-sharp entrance. Fires once at 35% visibility and staggers direct
 * children wrapped in <RevealItem>. Reduced motion keeps the reveal but runs
 * it 40% faster with no blur.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  stagger = 0.1,
  id,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  id?: string;
  as?: "div" | "section";
}) {
  const reduced = usePrefersReducedMotion();
  const M = as === "section" ? motion.section : motion.div;

  const variants: Variants = {
    hidden: reduced ? reducedHidden : hidden,
    shown: {
      ...(reduced ? reducedShown : shown),
      transition: {
        duration: reduced ? 0.35 : 0.58,
        ease: EASE,
        delayChildren: delay,
        staggerChildren: reduced ? 0.05 : stagger,
      },
    },
  };

  return (
    <M
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.35 }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = {
    hidden: reduced ? reducedHidden : hidden,
    shown: {
      ...(reduced ? reducedShown : shown),
      transition: { duration: reduced ? 0.32 : 0.55, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
