"use client";

import type { TokenColors } from "../hooks/useTokenColors";

type RigProps = { readonly colors: TokenColors };

/**
 * Three-light setup for the hero topology:
 *   - Ambient at 0.35 keeps every face at least slightly readable so
 *     the wireframe doesn't disappear at grazing angles.
 *   - One key directional at intensity 0.6 from front-top-right,
 *     shadows disabled per the file constraint.
 *   - Rim light: colored point light aligned to --color-accent,
 *     positioned back-left so it kisses the far side of the icosphere
 *     with a warm violet edge against the cool primary blue nodes.
 */
export function Rig({ colors }: RigProps) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" castShadow={false} />
      <pointLight
        position={[-4, 2, -3]}
        intensity={2.2}
        distance={12}
        decay={1.6}
        color={colors["--color-accent"]}
      />
    </>
  );
}
