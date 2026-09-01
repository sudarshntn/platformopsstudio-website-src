"use client";

import { useEffect, useState } from "react";

/**
 * Read the OS-level `prefers-reduced-motion` preference.
 *
 * Returns `false` during SSR / initial render so no motion-heavy
 * component decides "reduce" during hydration and later flips —
 * matches the pattern the file wants for the 3D scene (poster on
 * server, decide on mount whether to swap in Canvas).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  return reduced;
}
