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

// ─── Brake Rotor ─────────────────────────────────────────
/**
 * Ventilated disc with drilled cooling holes.
 * The topology of thermal management made visible.
 */
function BrakeRotor({ material }: { material: THREE.MeshPhysicalMaterial }) {
  const rotorGeo = useMemo(() => {
    const outerR = 0.12;
    const innerR = 0.055;
    const thickness = 0.008;
    const segments = 64;

    // Create ring shape
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerR, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    // Drill holes
    const holeCount = 8;
    const holeR = (outerR + innerR) / 2;
    const drillR = 0.007;
    for (let i = 0; i < holeCount; i++) {
      const angle = (i / holeCount) * Math.PI * 2;
      const cx = Math.cos(angle) * holeR;
      const cy = Math.sin(angle) * holeR;
      const drillPath = new THREE.Path();
      drillPath.absarc(cx, cy, drillR, 0, Math.PI * 2, true);
      shape.holes.push(drillPath);
    }

    // Second ring of smaller holes
    const holeR2 = outerR * 0.82;
    const drillR2 = 0.005;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.PI / 12;
      const cx = Math.cos(angle) * holeR2;
      const cy = Math.sin(angle) * holeR2;
      const drillPath = new THREE.Path();
      drillPath.absarc(cx, cy, drillR2, 0, Math.PI * 2, true);
      shape.holes.push(drillPath);
    }

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.001,
      bevelSize: 0.001,
      bevelSegments: 2,
      curveSegments: segments,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <mesh
      geometry={rotorGeo}
      rotation={[Math.PI / 2, 0, 0]}
      position={[-0.3, 0.15, 0.16]}
      castShadow
      receiveShadow
      material={material}
    />
  );
}

// ─── Suspension Linkage ──────────────────────────────────
/**
 * Rocker arm + connecting rod.
 * The kinematics of controlled force transfer.
 */
function SuspensionLinkage({
  aluminumMat,
  steelMat,
}: {
  aluminumMat: THREE.MeshPhysicalMaterial;
  steelMat: THREE.MeshPhysicalMaterial;
}) {
  const { livery } = usePortfolio();
  const themeColor = LIVERIES[livery]?.color || "#ff6900";
  const orangeMat = useMemo(() => createAnodizedOrange({ color: new THREE.Color(themeColor) }), [themeColor]);
  const carbonMat = useMemo(() => createCarbon(), []);

  return (
    <group position={[0.35, 0.22, 0.06]}>
      {/* 1. Machined Rocker Arm — detailed dual plate mechanical scissor linkage */}
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 6]} material={aluminumMat}>
        <boxGeometry args={[0.16, 0.035, 0.008]} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0.018]} rotation={[0, 0, Math.PI / 6]} material={aluminumMat}>
        <boxGeometry args={[0.16, 0.035, 0.008]} />
      </mesh>

      {/* Rocker spacer sleeves */}
      <mesh castShadow position={[0, 0, 0.009]} rotation={[0, 0, 0]} material={steelMat}>
        <cylinderGeometry args={[0.006, 0.006, 0.018, 12]} />
      </mesh>

      {/* Pivot bearing axle */}
      <mesh castShadow position={[-0.065, -0.02, 0.009]} rotation={[Math.PI / 2, 0, 0]} material={steelMat}>
        <cylinderGeometry args={[0.01, 0.01, 0.035, 16]} />
      </mesh>

      {/* 2. Push Rod / Connecting Linkage */}
      <mesh
        castShadow
        receiveShadow
        position={[0.025, -0.1, 0.009]}
        rotation={[0, 0, -Math.PI / 10]}
        material={aluminumMat}
      >
        <cylinderGeometry args={[0.008, 0.008, 0.16, 12]} />
      </mesh>
      
      {/* Rod end bearing clevis (bottom joint) */}
      <mesh castShadow position={[0.05, -0.17, 0.009]} material={steelMat}>
        <boxGeometry args={[0.016, 0.02, 0.016]} />
      </mesh>

      {/* 3. High-Performance WP Racing Damper Assembly */}
      {/* Top Mounting Clevis */}
      <mesh castShadow position={[0.08, -0.06, 0.009]} material={aluminumMat}>
        <boxGeometry args={[0.02, 0.02, 0.018]} />
      </mesh>
      
      {/* Polished Titanium Damper Shaft */}
      <mesh position={[0.08, -0.11, 0.009]} material={aluminumMat}>
        <cylinderGeometry args={[0.006, 0.006, 0.09, 12]} />
      </mesh>

      {/* Anodized Preload Adjustment Collar (Top) */}
      <mesh position={[0.08, -0.15, 0.009]} rotation={[Math.PI / 2, 0, 0]} material={orangeMat}>
        <cylinderGeometry args={[0.022, 0.022, 0.008, 16]} />
      </mesh>
      
      {/* Anodized Preload Collar Lock Ring */}
      <mesh position={[0.08, -0.158, 0.009]} rotation={[Math.PI / 2, 0, 0]} material={steelMat}>
        <cylinderGeometry args={[0.021, 0.021, 0.004, 16]} />
      </mesh>

      {/* Carbon Fiber Wrapped Main Damper Cylinder Body */}
      <mesh castShadow position={[0.08, -0.21, 0.009]} material={carbonMat}>
        <cylinderGeometry args={[0.018, 0.018, 0.10, 16]} />
      </mesh>

      {/* Damper End Cap (Bottom Mount Clevis) */}
      <mesh castShadow position={[0.08, -0.26, 0.009]} material={steelMat}>
        <boxGeometry args={[0.02, 0.012, 0.02]} />
      </mesh>

      {/* 4. Piggyback Nitrogen Reservoir (Öhlins/WP style) */}
      {/* Reservoir Union Connecting Bracket */}
      <mesh castShadow position={[0.104, -0.175, 0.009]} rotation={[0, 0, Math.PI / 4]} material={steelMat}>
        <boxGeometry args={[0.022, 0.006, 0.012]} />
      </mesh>
      {/* Reservoir Body */}
      <mesh castShadow position={[0.12, -0.19, 0.009]} material={carbonMat}>
        <cylinderGeometry args={[0.012, 0.012, 0.065, 12]} />
      </mesh>
      {/* Reservoir Anodized End Cap */}
      <mesh position={[0.12, -0.155, 0.009]} material={orangeMat}>
        <cylinderGeometry args={[0.012, 0.012, 0.006, 12]} />
      </mesh>
      {/* Compression Adjustment Dial */}
      <mesh position={[0.12, -0.15, 0.009]} material={steelMat}>
        <cylinderGeometry args={[0.007, 0.007, 0.004, 8]} />
      </mesh>

      {/* 5. Suspension Coil Spring */}
      <SpringCoil position={[0.08, -0.20, 0.009]} />
    </group>
  );
}

/**
 * Spring coil — the one moment of orange in the sculpture.
 * The 2% doctrine. One accent. A discovery, not a feature.
 */
function SpringCoil({ position }: { position: [number, number, number] }) {
  const { livery } = usePortfolio();
  const themeColor = LIVERIES[livery]?.color || "#ff6900";
  const material = useMemo(() => createAnodizedOrange({ color: new THREE.Color(themeColor) }), [themeColor]);
  const geo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const coils = 6;
    const radius = 0.018;
    const height = 0.10;
    const segments = coils * 24;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * coils * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          t * height - height / 2,
          Math.sin(angle) * radius
        )
      );
    }

    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, segments, 0.002, 6, false);
  }, []);

  return (
    <mesh geometry={geo} position={position} castShadow material={material} />
  );
}

// ─── Display Platform ────────────────────────────────────
/**
 * The sculpture sits on a machined platform.
 * Concrete base with aluminum edge trim.
 * Museum presentation. Reverent.
 */
function Platform() {
  const carbonPlateMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#161618"),
      roughness: 0.2,
      metalness: 0.9,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
  }, []);

  return (
    <group>
      {/* Sleek, thin machined alignment baseplate */}
      <mesh position={[0, 0.005, 0.06]} receiveShadow castShadow material={carbonPlateMat}>
        <boxGeometry args={[1.2, 0.01, 0.5]} />
      </mesh>
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

      {/* Platform & Suspension assembly shifted to left-front foreground */}
      <group position={[-0.85, 0.04, 0.8]} rotation={[0, -Math.PI / 8, 0]}>
        <Platform />
        <SuspensionLinkage aluminumMat={aluminumMat} steelMat={steelMat} />

        {/* Technical specs placard */}
        <Html
          position={[-0.3, 0.5, 0.1]}
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
            transform: "skew(6deg)",
          }}
        >
          <div style={{ color: "#ffffff", fontWeight: "bold", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "4px" }}>
            SUSPENSION RIG // WP
          </div>
          <div style={{ fontSize: "8px", color: "var(--steel)", lineHeight: "1.3" }}>
            Pressurized monoshock linkage. Mechanical force multiplier study for high-speed rear traction management.
          </div>
        </Html>
      </group>
    </group>
  );
}
