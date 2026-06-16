"use client";

import { useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { usePortfolio } from "@/providers/PortfolioProvider";
import { createSteel, createMachinedAluminum, createCarbon, createWornLeather } from "@/materials";

export default function KTM() {
  const { activeBikePart, setActiveBikePart, playAudio } = usePortfolio();
  const [hoveredPart, setHoveredPart] = useState<'frame' | 'engine' | 'suspension' | 'rear_section' | 'electrical' | null>(null);

  // Group refs for exploded views
  const frameRef = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.Group>(null);
  const suspensionRef = useRef<THREE.Group>(null);
  const rearRef = useRef<THREE.Group>(null);
  const frontRef = useRef<THREE.Group>(null);

  // Premium materials
  const steelMat = useMemo(() => createSteel(), []);
  const carbonMat = useMemo(() => createCarbon(), []);
  const aluminumMat = useMemo(() => createMachinedAluminum(), []);
  const blackLeatherMat = useMemo(() => createWornLeather({ color: new THREE.Color("#111113") }), []);
  
  // Rims: High-contrast Gold/Orange Anodized style
  const orangeRimMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ff5000"),
      roughness: 0.15,
      metalness: 0.95,
      clearcoat: 0.8,
    });
  }, []);

  // Frame: Matte powder-coated charcoal steel
  const powderFrameMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1c1c1e"),
      roughness: 0.8,
      metalness: 0.2,
    });
  }, []);

  // Trellis Frame: Bright KTM orange anodized/powder-coated steel
  const orangeTrellisMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ff5000"),
      roughness: 0.15,
      metalness: 0.9,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
  }, []);

  // Tank/Seat cowl: Matte white satin finish (naked bike signature body panels)
  const satinBodyMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#eceff1"),
      roughness: 0.55,
      metalness: 0.05,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
    });
  }, []);

  // Gold/Copper accents for engine clutch cover and fork stanchions
  const goldMetalMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#d4af37"),
      roughness: 0.18,
      metalness: 0.95,
      clearcoat: 0.5,
    });
  }, []);

  const rubberMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#151515"),
      roughness: 0.9,
      metalness: 0.0,
    });
  }, []);

  const headlightMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#ffe0b3"),
      emissiveIntensity: 0.9,
      roughness: 0.05,
    });
  }, []);

  // Exploded View Animation Loop (LERPing parts outwards to isolate selection)
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const speed = 7.0; // Snappy transition speed

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

  const getHighlightProps = (part: 'frame' | 'engine' | 'suspension' | 'rear_section' | 'electrical') => {
    const isHovered = hoveredPart === part;
    const isFocused = activeBikePart === part;
    if (isFocused) {
      return {
        emissive: new THREE.Color("#ff3000"),
        emissiveIntensity: 0.45,
      };
    }
    if (isHovered) {
      return {
        emissive: new THREE.Color("#ff3000"),
        emissiveIntensity: 0.22,
      };
    }
    return {
      emissive: new THREE.Color("#000000"),
      emissiveIntensity: 0,
    };
  };

  return (
    <group position={[1.35, 0, 0.2]} rotation={[0, -Math.PI / 4, -0.05]}>
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
        {/* Main Crankcase Block */}
        <mesh castShadow position={[0, 0.35, -0.05]} material={powderFrameMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
          <boxGeometry args={[0.22, 0.24, 0.3]} />
        </mesh>
        
        {/* V4 Front Cylinder Bank (Angled forward 45 deg) */}
        <group position={[0, 0.44, 0.06]} rotation={[0.4, 0, 0]}>
          <mesh castShadow material={steelMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
          </mesh>
          {/* Cylinder head valve cover */}
          <mesh castShadow position={[0, 0.07, 0]} material={powderFrameMat}>
            <boxGeometry args={[0.16, 0.03, 0.16]} />
          </mesh>
        </group>

        {/* V4 Rear Cylinder Bank (Angled backward 45 deg) */}
        <group position={[0, 0.44, -0.1]} rotation={[-0.4, 0, 0]}>
          <mesh castShadow material={steelMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
          </mesh>
          {/* Cylinder head cover */}
          <mesh castShadow position={[0, 0.07, 0]} material={powderFrameMat}>
            <boxGeometry args={[0.16, 0.03, 0.16]} />
          </mesh>
        </group>

        {/* Starter Motor Cylindrical housing */}
        <mesh castShadow position={[0, 0.25, 0.02]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
          <cylinderGeometry args={[0.035, 0.035, 0.14, 12]} />
        </mesh>

        {/* Copper/Gold Circular Clutch Outer Cover on the right side */}
        <mesh castShadow position={[0.115, 0.35, -0.02]} rotation={[0, 0, Math.PI / 2]} material={goldMetalMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        </mesh>

        {/* Radiator assembly mounted at the front */}
        <group position={[0, 0.52, 0.18]} rotation={[-0.15, 0, 0]}>
          <mesh castShadow material={carbonMat}>
            <boxGeometry args={[0.24, 0.18, 0.015]} />
          </mesh>
          {/* Radiator mounting brackets */}
          <mesh position={[0.12, 0, -0.01]} material={steelMat}>
            <boxGeometry args={[0.01, 0.2, 0.02]} />
          </mesh>
          <mesh position={[-0.12, 0, -0.01]} material={steelMat}>
            <boxGeometry args={[0.01, 0.2, 0.02]} />
          </mesh>
        </group>

        {/* Curved Exhaust Manifolds */}
        <group position={[0.06, 0.28, 0.04]}>
          <mesh castShadow rotation={[0.6, 0.1, 0]} material={steelMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          </mesh>
          {/* Midpipe merging under crankcase */}
          <mesh castShadow position={[0.02, -0.08, -0.15]} rotation={[1.1, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.25, 8]} />
          </mesh>
          {/* Carbon Fiber Underbelly Silencer Box */}
          <mesh castShadow position={[0.03, -0.12, -0.28]} rotation={[0.4, 0.1, 0]} material={carbonMat} material-emissive={getHighlightProps('engine').emissive} material-emissiveIntensity={getHighlightProps('engine').emissiveIntensity}>
            <cylinderGeometry args={[0.025, 0.032, 0.22, 12]} />
          </mesh>
          {/* Exhaust Tip */}
          <mesh position={[0.035, -0.08, -0.38]} rotation={[0.4, 0.1, 0]} material={aluminumMat}>
            <cylinderGeometry args={[0.018, 0.022, 0.02, 12]} />
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
        {/* Rebuilt High-Fidelity Triangulated Trellis Space Frame */}
        <group position={[0, 0.35, -0.05]}>
          {/* Main Upper Spar Left */}
          <mesh castShadow position={[0.09, 0.22, 0.16]} rotation={[0.5, 0.1, 0]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
          </mesh>
          {/* Main Upper Spar Right */}
          <mesh castShadow position={[-0.09, 0.22, 0.16]} rotation={[0.5, -0.1, 0]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
          </mesh>
          
          {/* Lower Triangulating Braces Left */}
          <mesh castShadow position={[0.095, 0.12, 0.06]} rotation={[-0.4, 0.2, 0]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.009, 0.009, 0.36, 8]} />
          </mesh>
          {/* Lower Triangulating Braces Right */}
          <mesh castShadow position={[-0.095, 0.12, 0.06]} rotation={[-0.4, -0.2, 0]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.009, 0.009, 0.36, 8]} />
          </mesh>

          {/* Diagonals Left (creates the signature space-frame triangles) */}
          <mesh castShadow position={[0.092, 0.16, 0.2]} rotation={[0.8, -0.3, 0.1]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
          </mesh>
          <mesh castShadow position={[0.092, 0.24, -0.06]} rotation={[-0.6, -0.2, -0.1]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />
          </mesh>
          
          {/* Diagonals Right */}
          <mesh castShadow position={[-0.092, 0.16, 0.2]} rotation={[0.8, 0.3, -0.1]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
          </mesh>
          <mesh castShadow position={[-0.092, 0.24, -0.06]} rotation={[-0.6, 0.2, 0.1]} material={orangeTrellisMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <cylinderGeometry args={[0.008, 0.008, 0.24, 8]} />
          </mesh>
          
          {/* Steering Head Column block */}
          <mesh castShadow position={[0, 0.36, 0.25]} rotation={[0.3, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.024, 0.024, 0.18, 12]} />
          </mesh>
        </group>

        {/* Aggressive Angular Fuel Tank (Satin white with creases) */}
        <group position={[0, 0.76, 0.15]}>
          {/* Center core tank */}
          <mesh castShadow material={satinBodyMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <boxGeometry args={[0.24, 0.2, 0.4]} />
          </mesh>
          {/* Beveled top tank block */}
          <mesh castShadow position={[0, 0.11, -0.04]} rotation={[-0.15, 0, 0]} material={satinBodyMat}>
            <boxGeometry args={[0.2, 0.06, 0.3]} />
          </mesh>
          {/* Left sweeping side shroud panel */}
          <mesh castShadow position={[0.13, -0.03, 0.11]} rotation={[0, 0.18, -0.12]} material={satinBodyMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <boxGeometry args={[0.02, 0.18, 0.34]} />
          </mesh>
          {/* Right sweeping side shroud panel */}
          <mesh castShadow position={[-0.13, -0.03, 0.11]} rotation={[0, -0.18, 0.12]} material={satinBodyMat} material-emissive={getHighlightProps('frame').emissive} material-emissiveIntensity={getHighlightProps('frame').emissiveIntensity}>
            <boxGeometry args={[0.02, 0.18, 0.34]} />
          </mesh>
          {/* Anodized Black Gas Cap */}
          <mesh position={[0, 0.14, 0.02]} rotation={[0.1, 0, 0]} material={powderFrameMat}>
            <cylinderGeometry args={[0.032, 0.032, 0.008, 16]} />
          </mesh>
          {/* Orange design accent lines on tank side */}
          <mesh position={[0.142, 0.02, 0.1]} rotation={[0, 0.18, -0.12]} material={orangeRimMat}>
            <boxGeometry args={[0.002, 0.02, 0.2]} />
          </mesh>
          <mesh position={[-0.142, 0.02, 0.1]} rotation={[0, -0.18, 0.12]} material={orangeRimMat}>
            <boxGeometry args={[0.002, 0.02, 0.2]} />
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
        {/* Double-Sided Cast Aluminum Swingarm */}
        <group position={[0, 0.3, -0.32]}>
          {/* Left swingarm arm */}
          <mesh castShadow position={[0.075, 0, 0]} rotation={[0.06, 0, 0]} material={aluminumMat} material-emissive={getHighlightProps('suspension').emissive} material-emissiveIntensity={getHighlightProps('suspension').emissiveIntensity}>
            <boxGeometry args={[0.035, 0.06, 0.52]} />
          </mesh>
          {/* Right swingarm arm */}
          <mesh castShadow position={[-0.075, 0, 0]} rotation={[0.06, 0, 0]} material={aluminumMat} material-emissive={getHighlightProps('suspension').emissive} material-emissiveIntensity={getHighlightProps('suspension').emissiveIntensity}>
            <boxGeometry args={[0.035, 0.06, 0.52]} />
          </mesh>
          {/* Front bracing cross piece */}
          <mesh castShadow position={[0, 0.01, 0.2]} material={aluminumMat}>
            <boxGeometry args={[0.13, 0.05, 0.1]} />
          </mesh>
        </group>

        {/* Monoshock Coil Spring (Ferrari Rosso Corsa orange wrap) */}
        <group position={[0, 0.44, -0.19]} rotation={[0.22, 0, 0]}>
          {/* Central hydraulic damper rod */}
          <mesh position={[0, 0, 0]} material={steelMat} material-emissive={getHighlightProps('suspension').emissive} material-emissiveIntensity={getHighlightProps('suspension').emissiveIntensity}>
            <cylinderGeometry args={[0.012, 0.012, 0.13, 12]} />
          </mesh>
          {/* Anodized gold adjustment collar */}
          <mesh position={[0, 0.06, 0]} material={goldMetalMat}>
            <cylinderGeometry args={[0.022, 0.022, 0.01, 12]} />
          </mesh>
          {/* Coil Spring loops */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <mesh key={i} position={[0, -0.05 + i * 0.018, 0]} rotation={[0.08, 0, 0]} material={orangeRimMat}>
              <torusGeometry args={[0.021, 0.005, 8, 20]} />
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
        {/* Rear Wheel (Wide stance, gold/orange anodized rim) */}
        <group position={[0, 0.3, -0.6]}>
          {/* Fat sticky motorcycle tire */}
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.24, 0.062, 16, 32]} />
            <primitive object={rubberMat} attach="material" />
          </mesh>
          {/* Rim bed */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} material={orangeRimMat} material-emissive={getHighlightProps('rear_section').emissive} material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 16, 1, true]} />
          </mesh>
          {/* Wheel Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.045, 0.045, 0.1, 12]} />
          </mesh>
          {/* Multi-spoke wheel architecture */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              rotation={[(i / 5) * Math.PI * 2, 0, 0]}
              material={orangeRimMat}
              material-emissive={getHighlightProps('rear_section').emissive}
              material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}
            >
              <boxGeometry args={[0.016, 0.4, 0.014]} />
            </mesh>
          ))}
          
          {/* Ventilated rear brake disk */}
          <mesh position={[0.042, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.003, 16]} />
          </mesh>
          {/* Rear Brake Caliper */}
          <mesh position={[0.045, 0.07, -0.04]} material={powderFrameMat}>
            <boxGeometry args={[0.015, 0.03, 0.04]} />
          </mesh>

          {/* Golden sprocket on left side */}
          <mesh position={[-0.046, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={goldMetalMat} material-emissive={getHighlightProps('rear_section').emissive} material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}>
            <cylinderGeometry args={[0.072, 0.072, 0.004, 24]} />
          </mesh>
        </group>

        {/* Physical Chain Drive links extending forward to engine */}
        <group position={[-0.046, 0, 0]}>
          {/* Upper chain run */}
          <mesh position={[0, 0.34, -0.34]} rotation={[0.09, 0, 0]} material={steelMat}>
            <boxGeometry args={[0.006, 0.012, 0.52]} />
          </mesh>
          {/* Lower chain run */}
          <mesh position={[0, 0.25, -0.34]} rotation={[-0.07, 0, 0]} material={steelMat}>
            <boxGeometry args={[0.006, 0.012, 0.52]} />
          </mesh>
        </group>

        {/* Seat & Sport Tail Assembly */}
        <group position={[0, 0.72, -0.22]}>
          {/* Split Rider Seat (Leather) */}
          <mesh castShadow position={[0, 0.01, 0.03]} rotation={[-0.08, 0, 0]} material={blackLeatherMat} material-emissive={getHighlightProps('rear_section').emissive} material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}>
            <boxGeometry args={[0.22, 0.04, 0.28]} />
          </mesh>
          {/* Passenger seat cowl cover (White satin) */}
          <mesh castShadow position={[0, 0.06, -0.16]} rotation={[0.12, 0, 0]} material={satinBodyMat} material-emissive={getHighlightProps('rear_section').emissive} material-emissiveIntensity={getHighlightProps('rear_section').emissiveIntensity}>
            <boxGeometry args={[0.16, 0.06, 0.24]} />
          </mesh>
          {/* Pointy subframe plastic body sides */}
          <mesh castShadow position={[0.07, 0.02, -0.16]} rotation={[0.12, -0.06, -0.06]} material={satinBodyMat}>
            <boxGeometry args={[0.015, 0.09, 0.32]} />
          </mesh>
          <mesh castShadow position={[-0.07, 0.02, -0.16]} rotation={[0.12, 0.06, 0.06]} material={satinBodyMat}>
            <boxGeometry args={[0.015, 0.09, 0.32]} />
          </mesh>
          {/* License plate hanger stub (naked bike standard tail-tidy) */}
          <mesh position={[0, -0.08, -0.28]} rotation={[-0.3, 0, 0]} material={powderFrameMat}>
            <boxGeometry args={[0.02, 0.1, 0.02]} />
          </mesh>
        </group>

        {/* ─── PROFESSIONAL STEEL PADDOCK STAND (Supporting Rear Axle) ─── */}
        <group position={[0, 0, -0.6]}>
          {/* Left stand arm */}
          <mesh castShadow position={[0.12, 0.16, -0.02]} rotation={[0.2, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.34, 8]} />
          </mesh>
          {/* Right stand arm */}
          <mesh castShadow position={[-0.12, 0.16, -0.02]} rotation={[0.2, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.34, 8]} />
          </mesh>
          {/* Left axle pin sleeve */}
          <mesh position={[0.09, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={aluminumMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.06, 8]} />
          </mesh>
          {/* Right axle pin sleeve */}
          <mesh position={[-0.09, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={aluminumMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.06, 8]} />
          </mesh>
          {/* Bottom ground loop brace */}
          <mesh castShadow position={[0, 0.008, -0.16]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.26, 8]} />
          </mesh>
          {/* Left side ground return arm */}
          <mesh position={[0.12, 0.008, -0.09]} rotation={[Math.PI / 2, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          </mesh>
          {/* Right side ground return arm */}
          <mesh position={[-0.12, 0.008, -0.09]} rotation={[Math.PI / 2, 0, 0]} material={steelMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
          </mesh>
          {/* Paddock stand mini wheels */}
          <mesh position={[0.13, 0.008, -0.16]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
            <cylinderGeometry args={[0.024, 0.024, 0.015, 10]} />
          </mesh>
          <mesh position={[-0.13, 0.008, -0.16]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
            <cylinderGeometry args={[0.024, 0.024, 0.015, 10]} />
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
        {/* Front Wheel (Gold/Orange Anodized, slightly narrower) */}
        <group position={[0, 0.3, 0.6]}>
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.24, 0.052, 16, 32]} />
            <primitive object={rubberMat} attach="material" />
          </mesh>
          {/* Rim bed */}
          <mesh castShadow rotation={[0, 0, Math.PI / 2]} material={orangeRimMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 16, 1, true]} />
          </mesh>
          {/* Spokes */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              rotation={[(i / 5) * Math.PI * 2, 0, 0]}
              material={orangeRimMat}
              material-emissive={getHighlightProps('electrical').emissive}
              material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}
            >
              <boxGeometry args={[0.014, 0.4, 0.012]} />
            </mesh>
          ))}
          {/* Dual front brake rotors */}
          <mesh position={[0.031, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.12, 0.12, 0.003, 16]} />
          </mesh>
          <mesh position={[-0.031, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={steelMat}>
            <cylinderGeometry args={[0.12, 0.12, 0.003, 16]} />
          </mesh>
          {/* Dual radial calipers */}
          <mesh position={[0.036, 0.09, -0.05]} rotation={[-0.4, 0, 0]} material={powderFrameMat}>
            <boxGeometry args={[0.018, 0.038, 0.026]} />
          </mesh>
          <mesh position={[-0.036, 0.09, -0.05]} rotation={[-0.4, 0, 0]} material={powderFrameMat}>
            <boxGeometry args={[0.018, 0.038, 0.026]} />
          </mesh>
        </group>

        {/* Front Upside-Down (USD) Gold Forks & Handlebars */}
        <group position={[0, 0.62, 0.45]} rotation={[-0.2, 0, 0]}>
          {/* Left USD Outer Tube (Gold) */}
          <mesh castShadow position={[0.08, 0.08, 0]} material={goldMetalMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
            <cylinderGeometry args={[0.018, 0.018, 0.46, 12]} />
          </mesh>
          {/* Right USD Outer Tube (Gold) */}
          <mesh castShadow position={[-0.08, 0.08, 0]} material={goldMetalMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
            <cylinderGeometry args={[0.018, 0.018, 0.46, 12]} />
          </mesh>
          
          {/* Left fork inner stanchion (Silver steel sliding out of gold sleeve) */}
          <mesh position={[0.08, -0.22, 0]} material={steelMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.38, 12]} />
          </mesh>
          {/* Right fork stanchion */}
          <mesh position={[-0.08, -0.22, 0]} material={steelMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.38, 12]} />
          </mesh>

          {/* Lower Triple Clamp plate */}
          <mesh castShadow position={[0, 0.16, 0]} material={powderFrameMat}>
            <boxGeometry args={[0.2, 0.015, 0.06]} />
          </mesh>
          {/* Upper Triple Clamp plate */}
          <mesh castShadow position={[0, 0.31, 0]} material={powderFrameMat}>
            <boxGeometry args={[0.2, 0.015, 0.06]} />
          </mesh>

          {/* Handlebars (Silver tube) */}
          <mesh position={[0, 0.33, 0.01]} rotation={[0, 0, Math.PI / 2]} material={aluminumMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.38, 8]} />
          </mesh>
          {/* Left rubber handle grip */}
          <mesh position={[0.17, 0.33, 0.01]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
            <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
          </mesh>
          {/* Right handle grip */}
          <mesh position={[-0.17, 0.33, 0.01]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
            <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
          </mesh>
          
          {/* Sleek bar-end mirrors */}
          <group position={[0.2, 0.34, 0.03]} rotation={[0, 0, -0.4]}>
            <mesh material={powderFrameMat}>
              <boxGeometry args={[0.008, 0.03, 0.01]} />
            </mesh>
            <mesh position={[0, 0.02, 0.01]} rotation={[0.4, 0.2, 0]} material={powderFrameMat}>
              <boxGeometry args={[0.03, 0.02, 0.002]} />
            </mesh>
          </group>
          <group position={[-0.2, 0.34, 0.03]} rotation={[0, 0, 0.4]}>
            <mesh material={powderFrameMat}>
              <boxGeometry args={[0.008, 0.03, 0.01]} />
            </mesh>
            <mesh position={[0, 0.02, 0.01]} rotation={[0.4, -0.2, 0]} material={powderFrameMat}>
              <boxGeometry args={[0.03, 0.02, 0.002]} />
            </mesh>
          </group>

          {/* Aggressive Headlight Mask (Naked street fighter signature pod) */}
          <group position={[0, 0.24, 0.08]}>
            {/* White outer shell shield */}
            <mesh castShadow material={satinBodyMat} material-emissive={getHighlightProps('electrical').emissive} material-emissiveIntensity={getHighlightProps('electrical').emissiveIntensity}>
              <boxGeometry args={[0.11, 0.15, 0.05]} />
            </mesh>
            {/* Split LED vertical projector light */}
            <mesh position={[0, 0, 0.026]} material={headlightMat}>
              <boxGeometry args={[0.018, 0.09, 0.008]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
