"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { createSteel, createMachinedAluminum, createCarbon } from "@/materials";

export default function KTM() {
  const { activeBikePart, setActiveBikePart, playAudio } = usePortfolio();
  const [hoveredPart, setHoveredPart] = useState<'frame' | 'engine' | 'suspension' | 'rear_section' | 'electrical' | null>(null);

  // Premium materials
  
  // Rims: Dark brushed metal
  const darkRimMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#18181a"),
      roughness: 0.35,
      metalness: 0.9,
    });
  }, []);

  // Frame: Matte powder-coated charcoal steel
  const powderFrameMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#242428"),
      roughness: 0.75,
      metalness: 0.1,
    });
  }, []);

  // Tank: Matte satin graphite paint
  const satinTankMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#141416"),
      roughness: 0.6,
      metalness: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
    });
  }, []);

  // Ferrari Rosso Corsa Accent Material
  const rossoCorsaMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ff1800"),
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.4,
    });
  }, []);

  const rubberMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#151515"),
      roughness: 0.88,
      metalness: 0.0,
    });
  }, []);

  const headlightMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#ffe0b3"),
      emissiveIntensity: 0.6,
      roughness: 0.05,
    });
  }, []);

  // 60FPS CAD Exploded View Animation Loop
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const speed = 7.0; // Snappy mechanical transition speed

    // Target positions based on which part is selected.
    // If a part is selected, other parts explode outwards to isolate it.
    const targetFrame = (activeBikePart && activeBikePart !== 'frame') 
      ? new THREE.Vector3(0, 0.45, 0.1) 
      : (activeBikePart === 'frame' ? new THREE.Vector3(0, 0.15, 0) : new THREE.Vector3(0, 0, 0));
      
    const targetEngine = (activeBikePart && activeBikePart !== 'engine')
      ? new THREE.Vector3(0, -0.3, -0.05)
      : (activeBikePart === 'engine' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0, 0, 0));

    const targetSuspension = (activeBikePart && activeBikePart !== 'suspension')
      ? new THREE.Vector3(-0.18, -0.08, -0.15)
      : (activeBikePart === 'suspension' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0, 0, 0));

    const targetRear = (activeBikePart && activeBikePart !== 'rear_section')
      ? new THREE.Vector3(0, 0.05, -0.55)
      : (activeBikePart === 'rear_section' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0, 0, 0));

    const targetFront = (activeBikePart && activeBikePart !== 'electrical')
      ? new THREE.Vector3(0, 0.05, 0.55)
      : (activeBikePart === 'electrical' ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0, 0, 0));

    if (frameRef.current) frameRef.current.position.lerp(targetFrame, speed * dt);
    if (engineRef.current) engineRef.current.position.lerp(targetEngine, speed * dt);
    if (suspensionRef.current) suspensionRef.current.position.lerp(targetSuspension, speed * dt);
    if (rearRef.current) rearRef.current.position.lerp(targetRear, speed * dt);
    if (frontRef.current) frontRef.current.position.lerp(targetFront, speed * dt);
  });

  // Emissive highlight generator for hovered parts
  const getHighlightProps = (part: 'frame' | 'engine' | 'suspension' | 'rear_section' | 'electrical') => {
    const isHovered = hoveredPart === part;
    const isFocused = activeBikePart === part;
    if (isFocused) {
      return {
        emissive: new THREE.Color("#ff1800"),
        emissiveIntensity: 0.35,
      };
    }
    if (isHovered) {
      return {
        emissive: new THREE.Color("#ff1800"),
        emissiveIntensity: 0.18,
      };
    }
    return {
      emissive: new THREE.Color("#000000"),
      emissiveIntensity: 0,
    };
  };

  return (
    <group position={[1.1, 0, 0.2]} rotation={[0, -Math.PI / 4, -0.1]}>
      {/* 
        Leaning motorcycle stance.
        Positioned in the mid-right shadow area of the garage workshop.
      */}

      {/* ─── 1. ENGINE GROUP ─── */}
      <group
        ref={engineRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveBikePart(activeBikePart === 'engine' ? null : 'engine');
          playAudio('chirp');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('engine');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Stylized Engine Block */}
        <mesh castShadow material={steelMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
          <boxGeometry args={[0.2, 0.28, 0.32]} />
        </mesh>
        {/* Cooling cylinders (fins) */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.08 - i * 0.05, 0.02]} material={steelMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <boxGeometry args={[0.22, 0.01, 0.34]} />
          </mesh>
        ))}

        {/* Exhaust Pipes */}
        <group position={[0.1, 0.32, -0.1]}>
          <mesh castShadow rotation={[0.8, 0, 0.2]} material={steelMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <cylinderGeometry args={[0.018, 0.018, 0.4, 8]} />
          </mesh>
          <mesh castShadow position={[0.06, 0.15, -0.32]} rotation={[0.4, 0.2, 0]} material={carbonMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <cylinderGeometry args={[0.026, 0.026, 0.24, 12]} />
          </mesh>
          <mesh position={[0.07, 0.23, -0.4]} rotation={[0.4, 0.2, 0]} material={aluminumMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <cylinderGeometry args={[0.02, 0.024, 0.03, 12]} />
          </mesh>
        </group>
      </group>

      {/* ─── 2. FRAME GROUP ─── */}
      <group
        ref={frameRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveBikePart(activeBikePart === 'frame' ? null : 'frame');
          playAudio('chirp');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('frame');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Trellis Frame (Matte Powder-Coated Charcoal) */}
        <group position={[0, 0.55, 0.15]}>
          <mesh castShadow rotation={[0.4, 0, 0]} material={powderFrameMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
          </mesh>
          <mesh castShadow rotation={[-0.4, 0, 0]} material={powderFrameMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
          </mesh>
          {[0.1, -0.1].map((z, idx) => (
            <mesh
              key={idx}
              position={[0, 0.02, z]}
              rotation={[0, 0, Math.PI / 4]}
              material={powderFrameMat}
              material-emissive={getHighlightProps('frame').emissive}
              material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}
            >
              <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
            </mesh>
          ))}
        </group>

        {/* Fuel Tank & Sharp Side Shrouds (Satin Graphite) */}
        <group position={[0, 0.76, 0.15]}>
          <mesh castShadow material={satinTankMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <boxGeometry args={[0.26, 0.24, 0.45]} />
          </mesh>
          <mesh castShadow position={[0.12, -0.05, 0.1]} rotation={[0, 0.2, -0.15]} material={satinTankMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <boxGeometry args={[0.02, 0.18, 0.3]} />
          </mesh>
          <mesh castShadow position={[-0.12, -0.05, 0.1]} rotation={[0, -0.2, 0.15]} material={satinTankMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <boxGeometry args={[0.02, 0.18, 0.3]} />
          </mesh>
          {/* Subtle Red Racing Stripe Accent */}
          <mesh position={[0.13, -0.03, 0.05]} rotation={[0, 0.2, -0.15]} material={rossoCorsaMat}>
            <boxGeometry args={[0.01, 0.08, 0.22]} />
          </mesh>
          <mesh position={[-0.13, -0.03, 0.05]} rotation={[0, -0.2, 0.15]} material={rossoCorsaMat}>
            <boxGeometry args={[0.01, 0.08, 0.22]} />
          </mesh>
        </group>
      </group>

      {/* ─── 3. SUSPENSION GROUP ─── */}
      <group
        ref={suspensionRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveBikePart(activeBikePart === 'suspension' ? null : 'suspension');
          playAudio('chirp');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('suspension');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Swingarm (connecting rear wheel hub to frame pivot) */}
        <group position={[0, 0.3, -0.3]} rotation={[0.08, 0, 0]}>
          <mesh castShadow material={aluminumMat} material-emissive={getHighlightProps('suspension').emissive} material-emissiveIntensity={getHighlightProps('suspension').emissiveIntensity}>
            <boxGeometry args={[0.15, 0.04, 0.6]} />
          </mesh>
        </group>

        {/* Monoshock suspension coil spring (Ferrari Rosso Corsa Highlight) */}
        <group position={[0, 0.45, -0.2]} rotation={[0.2, 0, 0]}>
          <mesh material={rossoCorsaMat} material-emissive={getHighlightProps('suspension').emissive} material-emissiveIntensity={getHighlightProps('suspension').emissiveIntensity}>
            <cylinderGeometry args={[0.015, 0.015, 0.12, 16]} />
          </mesh>
          {/* Stylized coil spring rings wrapping the shock */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} position={[0, -0.05 + i * 0.02, 0]} rotation={[0.1, 0, 0]} material={rossoCorsaMat}>
              <torusGeometry args={[0.022, 0.004, 8, 24]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ─── 4. REAR SECTION GROUP ─── */}
      <group
        ref={rearRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveBikePart(activeBikePart === 'rear_section' ? null : 'rear_section');
          playAudio('chirp');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('rear_section');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Rear Wheel */}
        <group position={[0, 0.3, -0.6]}>
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.24, 0.06, 12, 32]} />
            <primitive object={rubberMat} attach="material" />
          </mesh>
          {/* Rim - Dark Brushed Metal */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} material={darkRimMat} material-emissive={getHighlightProps('rear_section').emissive} material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16, 1, true]} />
          </mesh>
          {/* Subtle Red Rim Highlight Ring */}
          <mesh position={[0.041, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={rossoCorsaMat}>
            <torusGeometry args={[0.198, 0.002, 4, 32]} />
          </mesh>
          {/* Spokes */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              rotation={[(i / 5) * Math.PI * 2, 0, 0]}
              material={aluminumMat}
              material-emissive={getHighlightProps('rear_section').emissive}
              material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}
            >
              <boxGeometry args={[0.02, 0.4, 0.01]} />
            </mesh>
          ))}
          {/* Rear Brake Disc */}
          <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.1, 0.1, 0.003, 16]} />
          </mesh>
        </group>

        {/* Seat */}
        <group position={[0, 0.71, -0.25]}>
          <mesh castShadow material={blackLeatherMat} material-emissive={getHighlightProps('rear_section').emissive} material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}>
            <boxGeometry args={[0.22, 0.05, 0.38]} />
          </mesh>
          <mesh castShadow position={[0, 0.06, -0.26]} rotation={[0.12, 0, 0]} material={blackLeatherMat} material-emissive={getHighlightProps('rear_section').emissive} material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}>
            <boxGeometry args={[0.16, 0.06, 0.22]} />
          </mesh>
        </group>
      </group>

      {/* ─── 5. ELECTRICAL & FRONT GROUP ─── */}
      <group
        ref={frontRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveBikePart(activeBikePart === 'electrical' ? null : 'electrical');
          playAudio('chirp');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart('electrical');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Front Wheel */}
        <group position={[0, 0.3, 0.6]}>
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.24, 0.05, 12, 32]} />
            <primitive object={rubberMat} attach="material" />
          </mesh>
          {/* Rim - Dark Brushed Metal */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} material={darkRimMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16, 1, true]} />
          </mesh>
          {/* Red Rim Highlight */}
          <mesh position={[0.031, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={rossoCorsaMat}>
            <torusGeometry args={[0.198, 0.002, 4, 32]} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              rotation={[(i / 5) * Math.PI * 2, 0, 0]}
              material={aluminumMat}
              material-emissive={getHighlightProps('electrical').emissive}
              material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}
            >
              <boxGeometry args={[0.015, 0.4, 0.01]} />
            </mesh>
          ))}
          {/* Front Brake Discs */}
          <mesh position={[0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.12, 0.12, 0.003, 16]} />
          </mesh>
          <mesh position={[-0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.12, 0.12, 0.003, 16]} />
          </mesh>
        </group>

        {/* Front Forks & Headlight */}
        <group position={[0, 0.62, 0.45]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow position={[0.08, 0, 0]} material={aluminumMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
            <cylinderGeometry args={[0.015, 0.015, 0.75, 8]} />
          </mesh>
          <mesh castShadow position={[-0.08, 0, 0]} material={aluminumMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
            <cylinderGeometry args={[0.015, 0.015, 0.75, 8]} />
          </mesh>
          <mesh castShadow position={[0, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
            <cylinderGeometry args={[0.01, 0.01, 0.38, 8]} />
          </mesh>
          {/* Headlight Mask */}
          <group position={[0, 0.24, 0.06]}>
            <mesh castShadow material={carbonMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
              <boxGeometry args={[0.1, 0.14, 0.04]} />
            </mesh>
            <mesh position={[0, 0, 0.022]} material={headlightMat}>
              <boxGeometry args={[0.03, 0.08, 0.01]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ─── STATIC KICKSTAND ─── */}
      <mesh
        castShadow
        position={[-0.06, 0.15, -0.05]}
        rotation={[0, 0, 0.4]}
        material={steelMat}
      >
        <cylinderGeometry args={[0.008, 0.008, 0.34, 8]} />
      </mesh>
    </group>
  );
}
