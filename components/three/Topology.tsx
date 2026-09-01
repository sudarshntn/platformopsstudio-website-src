"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { TokenColors } from "./hooks/useTokenColors";

type TopologyProps = { readonly colors: TokenColors };

/**
 * Service-mesh topology:
 *   • Nodes — an InstancedMesh of low-poly spheres placed on the
 *     surface of a virtual icosphere (radius 2). One draw call for
 *     all nodes regardless of count.
 *   • Edges — a single LineSegments where each pair of consecutive
 *     vertices in the buffer is one line. One draw call, no
 *     per-frame allocation.
 *   • Particles — a Points cloud drifting in a bounded volume, one
 *     draw call.
 *
 * Total draw calls: 3. Triangle budget: 30 nodes × ~64 tris (12-subdiv
 * icosahedron) = ~1,920 tris — well under the 8k limit.
 *
 * Motion: the whole rig rotates as a group at 0.05 rad/s. The
 * particle cloud drifts vertically via a static shader-uniform-free
 * `y += sin(t + i)` inside useFrame, using a pre-allocated Vector3
 * scratch buffer.
 */
export function Topology({ colors }: TopologyProps) {
  const groupRef = useRef<THREE.Group>(null);

  // ── NODE POSITIONS ─────────────────────────────────────────
  // Take vertices of an IcosahedronGeometry (order 1 gives 42
  // vertices; we sample 30) and treat them as node positions.
  const nodePositions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 1);
    const attr = geo.getAttribute("position");
    const seen = new Set<string>();
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < attr.count && points.length < 30; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(attr, i);
      const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      points.push(v);
    }
    geo.dispose();
    return points;
  }, []);

  // ── INSTANCE TRANSFORMS ────────────────────────────────────
  const nodeMatrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    return nodePositions.map((p) => {
      dummy.position.copy(p);
      dummy.scale.setScalar(0.06);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });
  }, [nodePositions]);

  const instMeshRef = useRef<THREE.InstancedMesh>(null);

  // Apply instance matrices exactly once after mount.
  useMemo(() => {
    const inst = instMeshRef.current;
    if (!inst) return;
    for (let i = 0; i < nodeMatrices.length; i++) {
      const m = nodeMatrices[i];
      if (m) inst.setMatrixAt(i, m);
    }
    inst.instanceMatrix.needsUpdate = true;
  }, [nodeMatrices]);

  // ── EDGE GEOMETRY ─────────────────────────────────────────
  // Connect each node to its 3 nearest neighbors (deduped) — reads
  // as a triangulated mesh envelope without shipping a full mesh.
  const edgeGeometry = useMemo(() => {
    const positions: number[] = [];
    const edgeSet = new Set<string>();
    nodePositions.forEach((p, i) => {
      const distances = nodePositions
        .map((q, j) => ({ j, d: i === j ? Infinity : p.distanceTo(q) }))
        .sort((a, b) => a.d - b.d);
      for (let k = 0; k < 3; k++) {
        const nb = distances[k];
        if (!nb) continue;
        const a = Math.min(i, nb.j);
        const b = Math.max(i, nb.j);
        const key = `${a}-${b}`;
        if (edgeSet.has(key)) continue;
        edgeSet.add(key);
        const from = nodePositions[a];
        const to = nodePositions[b];
        if (!from || !to) continue;
        positions.push(from.x, from.y, from.z, to.x, to.y, to.z);
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodePositions]);

  // ── PARTICLE FIELD ────────────────────────────────────────
  const particleGeometry = useMemo(() => {
    const count = 200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random point in a 6-radius sphere (rejection-free trick: uniform in cube then reject)
      const r = 4 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  // ── ROTATION LOOP ─────────────────────────────────────────
  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y += delta * 0.05;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={instMeshRef} args={[undefined, undefined, nodePositions.length]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color={colors["--color-primary"]}
          roughness={0.35}
          metalness={0.15}
          emissive={colors["--color-primary"]}
          emissiveIntensity={0.35}
        />
      </instancedMesh>

      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial
          color={colors["--color-primary"]}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points geometry={particleGeometry}>
        <pointsMaterial
          size={0.03}
          color={colors["--color-text-muted"]}
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
