"use client";

import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * Composite gate for lazily mounting a 3D Canvas. Returns `true` only
 * when all of these are true:
 *   - `prefers-reduced-motion` is NOT set (else the poster stays and
 *     the Canvas never mounts, per the file's constraint).
 *   - WebGL is available at all (feature-detects with a probe canvas
 *     on mount; failure keeps the poster forever).
 *   - The browser is idle (`requestIdleCallback` OR a 400ms fallback
 *     setTimeout when RIC isn't available — Safari <16 case).
 *   - The mount target is in view (IntersectionObserver on the passed
 *     ref, `rootMargin: 200px` so we start warming before the user
 *     visibly scrolls into it).
 *
 * The gate is one-way — once true, it never flips back to false; the
 * scene itself is responsible for pausing its render loop on tab hide
 * (see HeroScene client).
 */
export function useSceneMountGate(targetRef: RefObject<HTMLElement | null>): boolean {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;

    // WebGL detection — cheap, one-shot.
    let hasWebGl = false;
    try {
      const probe = document.createElement("canvas");
      hasWebGl = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      hasWebGl = false;
    }
    if (!hasWebGl) return;

    let idleDone = false;
    let visibleDone = false;
    const promote = () => {
      if (idleDone && visibleDone) setReady(true);
    };

    // Idle-time gate. Use requestIdleCallback when the browser has
    // it (Chrome/Firefox); fall back to a 400ms setTimeout on Safari.
    const hasRic = typeof window.requestIdleCallback === "function";
    const ric = hasRic
      ? window.requestIdleCallback(() => {
          idleDone = true;
          promote();
        })
      : window.setTimeout(() => {
          idleDone = true;
          promote();
        }, 400);

    // Visibility gate.
    const target = targetRef.current;
    let io: IntersectionObserver | null = null;
    if (target) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            visibleDone = true;
            promote();
            io?.disconnect();
          }
        },
        { rootMargin: "200px" }
      );
      io.observe(target);
    } else {
      // No target (defensive) — treat visibility as satisfied.
      visibleDone = true;
      promote();
    }

    return () => {
      if (hasRic) {
        window.cancelIdleCallback(ric as number);
      } else {
        window.clearTimeout(ric as number);
      }
      io?.disconnect();
    };
  }, [reduced, targetRef]);

  return ready;
}
