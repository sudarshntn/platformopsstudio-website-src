"use client";

import { useEffect, useState } from "react";

// Design tokens the 3D scene reads at mount. Kept as a plain string
// union rather than `as const` array to avoid an unused-runtime-value
// lint warning; the values only appear in the DEFAULTS map below and
// the read() branches inside useEffect.
type TokenName = "--color-primary" | "--color-accent" | "--color-bg" | "--color-text-muted";
export type TokenColors = Readonly<Record<TokenName, string>>;

const DEFAULTS: TokenColors = {
  "--color-primary": "#4f7cff",
  "--color-accent": "#a78bfa",
  "--color-bg": "#0a0b10",
  "--color-text-muted": "#9aa3b2",
};

/**
 * Reads the current values of our color tokens off `:root` at mount.
 * The values are hex strings suitable for `new THREE.Color(...)` so
 * re-theming (light-mode swap in the future, or a runtime toggle in
 * stage 12) propagates without hardcoding hexes in the scene code.
 *
 * Returns the defaults during SSR / before hydration so any scene
 * material referencing these props has a stable initial value.
 */
export function useTokenColors(): TokenColors {
  const [colors, setColors] = useState<TokenColors>(DEFAULTS);

  useEffect(() => {
    const s = getComputedStyle(document.documentElement);
    const read = (name: TokenName): string => {
      const v = s.getPropertyValue(name).trim();
      return v || DEFAULTS[name];
    };
    setColors({
      "--color-primary": read("--color-primary"),
      "--color-accent": read("--color-accent"),
      "--color-bg": read("--color-bg"),
      "--color-text-muted": read("--color-text-muted"),
    });
  }, []);

  return colors;
}
