"use client";

import { useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Rig } from "./lighting/Rig";
import { Topology } from "./Topology";
import { useTokenColors } from "./hooks/useTokenColors";
import { useLenisScroll } from "@/components/scroll/useLenisScroll";

/**
 * Scroll-linked camera dolly. Shifts camera Z by up to 8% of the
 * scene depth (0.5 units on a ~6-unit-tall camera) as page scroll
 * progresses through the hero region. Progress source is the Lenis
 * scroll — so wheel/trackpad/scrollTo all drive the same value.
 */
function CameraDolly() {
  const camera = useThree((s) => s.camera);
  const progress = useLenisScroll();

  useFrame(() => {
    // Only the first 40% of scroll drives the dolly; beyond that
    // the hero is offscreen and there's nothing to do.
    const t = Math.min(1, progress / 0.4);
    const targetZ = 6 - t * 0.5; // baseline 6, closes to 5.5
    // Lerp for micro-smoothing on top of Lenis.
    camera.position.z += (targetZ - camera.position.z) * 0.12;
  });
  return null;
}

/**
 * The R3F Canvas hosting the topology scene. Client-only (uses browser
 * APIs), imported via next/dynamic from HeroScene.tsx so three/drei
 * are code-split out of the initial route chunk.
 *
 * Perf knobs (per file constraints):
 *   • dpr clamped [1, 1.5] — browsers with pixelRatio > 1.5 (retina
 *     laptops, phones) cap so we're not rendering to a 3× buffer.
 *   • antialias enabled only when a coarse pointer isn't in use
 *     (rough desktop-vs-touch heuristic) — MSAA on mobile is
 *     expensive relative to the visual benefit at this scale.
 *   • powerPreference: "high-performance" so the discrete GPU is
 *     preferred on macOS/multi-GPU setups.
 *   • ACESFilmic tone mapping + SRGB output color space matches the
 *     dark-first design (bright emissives don't clip).
 *   • Render loop pauses when `document.visibilityState` is "hidden"
 *     — set frameloop="never" on tab hide and back to "always" on
 *     tab show, so the GPU goes idle when the user tabs away.
 *
 * Fade-in: opacity starts at 0 and animates to 1 over 400ms once the
 * Canvas has fired its `onCreated` callback (first frame drawn). The
 * static poster underneath stays behind it in DOM order so the swap
 * has no flash of empty background.
 */
export function HeroSceneClient() {
  const colors = useTokenColors();
  const [ready, setReady] = useState(false);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [isDesktop, setIsDesktop] = useState(true);

  // Pause the loop when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => {
      setFrameloop(document.visibilityState === "hidden" ? "never" : "always");
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Antialias only on desktop-class devices (rough heuristic via
  // pointer:fine media query — desktops report a fine pointer,
  // touch-first devices report coarse).
  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setIsDesktop(mql.matches);
  }, []);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-500 ease-out"
      style={{ opacity: ready ? 1 : 0 }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0.4, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: isDesktop,
          powerPreference: "high-performance",
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          setReady(true);
        }}
        frameloop={frameloop}
        style={{ background: "transparent" }}
      >
        <Rig colors={colors} />
        <Topology colors={colors} />
        <CameraDolly />
      </Canvas>
    </div>
  );
}
