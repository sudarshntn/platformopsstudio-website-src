"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

type LenisContextValue = { readonly lenis: Lenis | null };
const LenisContext = createContext<LenisContextValue>({ lenis: null });

/**
 * Global smooth-scroll provider. Scoped to `<html>` (Lenis's default);
 * overflow containers (mobile-nav dialog, modals) are NOT lerped
 * because they don't use the root scroller.
 *
 * - Skips instantiation entirely if `prefers-reduced-motion: reduce`,
 *   falling back to native scroll.
 * - iOS Safari: Lenis's native touch-momentum handling is uneven;
 *   guarded via UA check so iOS falls back to native scroll too.
 * - Exposes the Lenis instance via context so useLenisScroll() and
 *   the R3F hero-dolly hook can share the same source of truth.
 */
export function LenisProvider({ children }: { readonly children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // iOS: fall back to native. Lenis on iOS Safari can conflict
    // with the rubber-banding overscroll and momentum.
    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    if (isIOS) return;

    const instance = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(instance);

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Anchor-link interception — hash navigation uses lenis.scrollTo
  // with a header offset so the target isn't hidden by the sticky
  // header.
  useEffect(() => {
    if (!lenis) return;
    const HEADER_OFFSET = 80;
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.(
        "a[href^='#']"
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -HEADER_OFFSET });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  // Keyboard-focus: when a link/button gains focus off-screen, scroll
  // via Lenis so smoothness matches wheel scroll. Skipped for form
  // controls (input focus + autofill can double-scroll on mobile).
  useEffect(() => {
    if (!lenis) return;
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top >= 80 && rect.bottom <= window.innerHeight - 40;
      if (!inView) lenis.scrollTo(el, { offset: -100 });
    };
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [lenis]);

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>;
}

/** Read the current Lenis instance. Returns null when Lenis is disabled. */
export function useLenis(): Lenis | null {
  return useContext(LenisContext).lenis;
}
