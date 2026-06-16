"use client";

/**
 * HeroSculpture — Engineering as Art
 *
 * Not a motorcycle. Not a replica.
 * A sculptural interpretation of engineering principles:
 * trellis geometry, suspension kinematics, brake rotor topology.
 *
 * This belongs in a museum. It was built by someone who understands
 * these systems at the structural level — not someone who admires
 * them from a distance.
 *
 * Every tube angle, every node junction, every drilled hole
 * is placed with engineering intent. Not decoration.
 */

import { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { LIVERIES } from "@/config/colors";
import {
  createCarbon,
  createBrushedAluminum,
  createMachinedAluminum,
  createAnodizedOrange,
  createSteel,
} from "@/materials";

// ─── Trellis Frame ───────────────────────────────────────
/**
 * Triangulated tubular structure.
 * The tubes intersect at precise angles dictated by load paths,
 * not aesthetics. Carbon tubes, aluminum nodes.
 */
function TrellisFrame({ material }: { material: THREE.MeshPhysicalMaterial }) {
  const tubeRadius = 0.012;
  const nodeRadius = 0.022;
  const nodeMaterial = useMemo(() => createMachinedAluminum(), []);

  // Define tube endpoints — triangulated load path geometry
  const tubes: [THREE.Vector3, THREE.Vector3][] = useMemo(
    () => [
      // Main longitudinal spars
      [new THREE.Vector3(-0.4, 0.3, 0), new THREE.Vector3(0.5, 0.6, 0)],
      [new THREE.Vector3(-0.4, 0.3, 0.12), new THREE.Vector3(0.5, 0.6, 0.12)],
      // Diagonal braces — the triangulation
      [new THREE.Vector3(-0.4, 0.3, 0), new THREE.Vector3(-0.1, 0.55, 0.06)],
      [new THREE.Vector3(-0.4, 0.3, 0.12), new THREE.Vector3(-0.1, 0.55, 0.06)],
      [new THREE.Vector3(-0.1, 0.55, 0.06), new THREE.Vector3(0.2, 0.35, 0)],
      [new THREE.Vector3(-0.1, 0.55, 0.06), new THREE.Vector3(0.2, 0.35, 0.12)],
      [new THREE.Vector3(0.2, 0.35, 0), new THREE.Vector3(0.5, 0.6, 0)],
      [new THREE.Vector3(0.2, 0.35, 0.12), new THREE.Vector3(0.5, 0.6, 0.12)],
      // Cross braces
      [new THREE.Vector3(-0.4, 0.3, 0), new THREE.Vector3(-0.4, 0.3, 0.12)],
      [new THREE.Vector3(0.2, 0.35, 0), new THREE.Vector3(0.2, 0.35, 0.12)],
      [new THREE.Vector3(0.5, 0.6, 0), new THREE.Vector3(0.5, 0.6, 0.12)],
      // Subframe diagonals
      [new THREE.Vector3(-0.4, 0.3, 0.06), new THREE.Vector3(-0.1, 0.1, 0.06)],
      [new THREE.Vector3(-0.1, 0.1, 0.06), new THREE.Vector3(0.15, 0.15, 0.06)],
      [new THREE.Vector3(0.15, 0.15, 0.06), new THREE.Vector3(0.2, 0.35, 0.06)],
    ],
    []
  );

  // Unique node positions (vertices of the trellis)
  const nodes = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    tubes.forEach(([a, b]) => {
      const ka = a.toArray().map((v) => v.toFixed(3)).join(",");
      const kb = b.toArray().map((v) => v.toFixed(3)).join(",");
      map.set(ka, a);
      map.set(kb, b);
    });
    return Array.from(map.values());
  }, [tubes]);

  return (
    <group>
      {/* Carbon tubes */}
      {tubes.map(([start, end], i) => {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.normalize()
        );
        return (
          <mesh
            key={`tube-${i}`}
            position={mid}
            quaternion={quat}
            castShadow
            receiveShadow
            material={material}
          >
            <cylinderGeometry args={[tubeRadius, tubeRadius, len, 8]} />
          </mesh>
        );
      })}

      {/* Aluminum junction nodes */}
      {nodes.map((pos, i) => (
        <mesh key={`node-${i}`} position={pos} castShadow material={nodeMaterial}>
          <icosahedronGeometry args={[nodeRadius, 1]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Assembly ────────────────────────────────────────────

export default function HeroSculpture() {
  const carbonMat = useMemo(() => createCarbon(), []);
  const steelMat = useMemo(() => createSteel(), []);
  const aluminumMat = useMemo(() => createMachinedAluminum(), []);

  return (
    <group>
      {/* Trellis frame leaning against the left wall of the garage */}
      <group position={[-1.4, 0.04, -0.9]} rotation={[0.2, 0.6, 1.5]}>
        <TrellisFrame material={carbonMat} />

        {/* Structural display rack/mount holding the trellis in position */}
        <group position={[0, 0.1, 0.06]} rotation={[-1.5, -0.6, -0.2]}>
          {/* Machined metal baseplate on floor */}
          <mesh castShadow receiveShadow position={[0, -0.16, -0.1]} material={steelMat}>
            <boxGeometry args={[0.9, 0.02, 0.4]} />
          </mesh>
          {/* Left vertical support pillar */}
          <mesh castShadow position={[-0.32, 0.15, -0.1]} material={steelMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.6, 12]} />
          </mesh>
          {/* Right vertical support pillar */}
          <mesh castShadow position={[0.32, 0.15, -0.1]} material={steelMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.6, 12]} />
          </mesh>
          {/* Horizontal brace holding trellis */}
          <mesh castShadow position={[0, 0.38, -0.1]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.72, 12]} />
          </mesh>
          {/* Sturdy lock collar clamps holding frame nodes */}
          <mesh position={[-0.32, 0.38, -0.1]} material={aluminumMat}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
          </mesh>
          <mesh position={[0.32, 0.38, -0.1]} material={aluminumMat}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
          </mesh>
        </group>
        
        {/* Technical specs placard */}
        <Html
          position={[0, 0.6, 0.2]}
          center
          distanceFactor={1.5}
          style={{
            background: "rgba(5, 5, 5, 0.85)",
            border: "1px solid var(--orange)",
            borderRadius: "2px",
            padding: "8px 12px",
            color: "var(--titanium)",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            width: "160px",
            boxShadow: "0 0 10px rgba(255, 105, 0, 0.15)",
            userSelect: "none",
            pointerEvents: "none",
            transform: "skew(-6deg)",
          }}
        >
          <div style={{ color: "#ffffff", fontWeight: "bold", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "4px" }}>
            CHASSIS RIG // TRELLIS
          </div>
          <div style={{ fontSize: "8px", color: "var(--steel)", lineHeight: "1.3" }}>
            Trellis space-frame load path study. Carbon-fiber tubing, machined aluminum junctions. Engineered for high torsional rigidity.
          </div>
        </Html>
      </group>
    </group>
  );
}
