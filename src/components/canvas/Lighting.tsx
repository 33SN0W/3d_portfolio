"use client";

/**
 * Lighting — Museum-grade architectural illumination
 *
 * Inspired by: Porsche Museum late evening lighting
 * Warm, controlled, restrained. Every photon has purpose.
 */

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export default function Lighting() {
  const keySpotRef = useRef<THREE.SpotLight>(null);
  const wallRef = useRef<THREE.SpotLight>(null);
  const bikeRef = useRef<THREE.SpotLight>(null);
  const laptopRef = useRef<THREE.PointLight>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (keySpotRef.current) {
      const target = new THREE.Object3D();
      target.position.set(0, 0.4, -0.3);
      scene.add(target);
      keySpotRef.current.target = target;
      return () => {
        scene.remove(target);
      };
    }
  }, [scene]);

  return (
    <group>
      {/* Museum ambient — deep shadow with warm undertone */}
      <ambientLight intensity={0.015} color="#1a1612" />

      {/*
        Key Light — Hidden ceiling strip, 2200K warm tungsten.
        Museum spotlight quality. Controlled falloff.
      */}
      <spotLight
        ref={keySpotRef}
        position={[0, 4.5, 0.5]}
        color="#ff8c46"
        intensity={180}
        distance={12}
        angle={Math.PI / 4}
        penumbra={0.7}
        decay={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0003}
        shadow-normalBias={0.03}
      />

      {/* Architectural wall washing — soft indirect bounce */}
      <spotLight
        position={[-2.5, 3.5, -0.5]}
        color="#ffaa88"
        intensity={45}
        distance={8}
        angle={Math.PI / 3}
        penumbra={0.9}
        decay={2.2}
      />

      {/* Motorcycle rim lighting — capturing metal contours */}
      <spotLight
        position={[2.8, 2.4, -0.5]}
        color="#ffd4a8"
        intensity={140}
        distance={6}
        angle={Math.PI / 5}
        penumbra={0.6}
        decay={1.8}
      />

      {/* Laptop screen wash — subtle emissive glow */}
      <pointLight
        position={[0, 0.86, -0.75]}
        color="#e0e0ff"
        intensity={0.8}
        distance={1.5}
        decay={2.5}
      />

      {/* Blueprint wall washing — soft overhead illumination */}
      <spotLight
        position={[0, 3.2, -1.0]}
        color="#ffffff"
        intensity={35}
        distance={10}
        angle={Math.PI / 2.2}
        penumbra={0.95}
        decay={2}
      />
    </group>
  );
}
