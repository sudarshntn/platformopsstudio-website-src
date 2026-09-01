"use client";

import { useEffect, useState } from "react";
import { useLenis } from "./LenisProvider";

/**
 * Read scroll progress from the shared Lenis instance so R3F's
 * useFrame and motion/react's useScroll consume the same value.
 *
 * When Lenis is disabled (reduced motion / iOS), falls back to a
 * native scroll listener with `{ passive: true }`.
 */
export function useLenisScroll(): number {
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (lenis) {
      const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
        setProgress(limit === 0 ? 0 : scroll / limit);
      };
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }
    // Native fallback.
    const onScroll = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(limit === 0 ? 0 : window.scrollY / limit);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis]);

  return progress;
}
