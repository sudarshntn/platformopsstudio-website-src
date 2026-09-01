"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Subtle route-change crossfade. Rendered by app/template.tsx so it
 * re-mounts on every navigation (that's what a template.tsx gives you
 * vs. layout.tsx). 220ms ease-out matches --duration-base.
 *
 * Reduced motion: returns children raw, no wrapper. Removes both the
 * transform and the wrapper div so lighthouse doesn't count them.
 */
export function PageTransition({ children }: { readonly children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
