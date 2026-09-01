"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useSceneMountGate } from "./hooks/useSceneMountGate";

/*
 * Lazy R3F Canvas — three/drei/etc. are code-split into their own
 * chunk (ssr:false + dynamic) so the initial route chunk stays lean.
 * The chunk only fetches once the useSceneMountGate hook flips to
 * true (idle + in-view + WebGL available + not reduced-motion).
 */
const HeroSceneClient = dynamic(() => import("./HeroScene.client").then((m) => m.HeroSceneClient), {
  ssr: false,
});

/*
 * Static poster shown on the server, during hydration, and forever
 * when the mount gate stays closed (reduced motion, no WebGL, tab
 * never in view). We render one of our SVG banners at low opacity as
 * the poster — it matches the scene's blue-primary aesthetic and
 * ships in the initial HTML so nothing shifts on Canvas swap-in.
 *
 * The gate hook triggers a re-render when it flips to true; at that
 * point the Canvas mounts on top of the poster, fades in over 400ms,
 * and the poster stays behind it (still in DOM so if the Canvas
 * were ever to be unmounted, the poster is still there).
 */
function Poster() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/img/banners/banner-argocd-mcp-multicluster.svg"
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Called by the Hero section. Renders inside the hero's placeholder
 * area (absolute positioned to fill the parent). Server output is
 * always just the poster + a mount-gate ref; the Canvas fades in
 * later, only if the gate opens.
 */
export function HeroScene() {
  const gateRef = useRef<HTMLDivElement>(null);
  const ready = useSceneMountGate(gateRef);

  return (
    <div ref={gateRef} className="absolute inset-0 -z-10 overflow-hidden">
      <Poster />
      {ready && <HeroSceneClient />}
    </div>
  );
}
