"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

type RevealProps = {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly as?: "div" | "section" | "article" | "li" | "span";
  readonly className?: string;
};

/**
 * Fade + translate-up 12px on enter-view, once. If prefers-reduced-motion
 * is set, returns static children with no wrapper transforms at all.
 *
 * Compose siblings by passing incrementing `delay` (e.g. 0, 0.06, 0.12)
 * to get the 60ms stagger the file spec asks for. A parent-level
 * stagger container isn't provided here — each sibling holds its own
 * `delay` so refactors don't cascade.
 */
const variants: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export function Reveal({ children, delay = 0, as = "div", className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const MotionComp = motion[as];
  return (
    <MotionComp
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </MotionComp>
  );
}
