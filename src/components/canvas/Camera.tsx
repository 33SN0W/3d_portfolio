"use client";

/**
 * Camera — Scroll-driven cinematic observer
 *
 * The camera moves through the space as the visitor scrolls.
 * Mouse parallax and organic breathing persist throughout.
 * Each scroll zone has a specific camera position and look target.
 *
 * The movement feels like Roger Deakins operating a dolly —
 * slow, deliberate, patient.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getProgress } from "@/systems/scroll";
import { usePortfolio } from "@/providers/PortfolioProvider";

// Camera keyframes — position and look target at each scroll progress
const KEYFRAMES = [
  { at: 0.00, pos: [0, 1.4, 4.0],       look: [0, 0.4, 0] },         // Sector 1: Paddock (Intro)
  { at: 0.10, pos: [0, 1.4, 4.0],       look: [0, 0.4, 0] },
  { at: 0.16, pos: [1.35, 0.95, 1.3],  look: [1.35, 0.5, 0.2] },    // Sector 2: Garage (Tech Stack)
  { at: 0.28, pos: [1.35, 0.95, 1.3],  look: [1.35, 0.5, 0.2] },
  { at: 0.32, pos: [0, 1.48, 0.85],    look: [0, 1.55, -1.2] },     // Sector 3: Build Log (Blueprints/Projects)
  { at: 0.44, pos: [0, 1.48, 0.85],    look: [0, 1.55, -1.2] },
  { at: 0.48, pos: [0, 1.1, 0.9],      look: [0, 0.85, -0.75] },    // Sector 4: Race History (Experience)
  { at: 0.60, pos: [0, 1.1, 0.9],      look: [0, 0.85, -0.75] },
  { at: 0.64, pos: [0.38, 0.96, -0.18], look: [0.52, 0.84, -0.42] }, // Sector 5: Race Strategy (Leadership/Helmet)
  { at: 0.76, pos: [0.38, 0.96, -0.18], look: [0.52, 0.84, -0.42] },
  { at: 0.80, pos: [0, 1.35, 3.2],     look: [0, 0.7, -0.3] },      // Sector 6: Pit Wall (Contact)
  { at: 1.00, pos: [0, 1.35, 3.2],     look: [0, 0.7, -0.3] },
] as const;

/** Interpolate between keyframes based on progress */
function interpolateKeyframes(progress: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  // Find the two keyframes we're between
  let a: typeof KEYFRAMES[number] = KEYFRAMES[0];
  let b: typeof KEYFRAMES[number] = KEYFRAMES[KEYFRAMES.length - 1];

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (progress >= KEYFRAMES[i].at && progress <= KEYFRAMES[i + 1].at) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }

  // Local progress between the two keyframes
  const range = b.at - a.at;
  const t = range > 0 ? (progress - a.at) / range : 0;

  // Smooth easeInOutExpo easing for mechanical visual precision
  const eased = t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;

  return {
    pos: new THREE.Vector3(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], eased),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], eased),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], eased),
    ),
    look: new THREE.Vector3(
      THREE.MathUtils.lerp(a.look[0], b.look[0], eased),
      THREE.MathUtils.lerp(a.look[1], b.look[1], eased),
      THREE.MathUtils.lerp(a.look[2], b.look[2], eased),
    ),
  };
}

const POSTER_TARGETS: Record<string, { pos: [number, number, number]; look: [number, number, number] }> = {
  journey:  { pos: [-0.55, 1.65, -0.65], look: [-0.55, 1.65, -1.2] },
  resume:   { pos: [0.55, 1.65, -0.65],  look: [0.55, 1.65, -1.2] },
  ferrari:  { pos: [-1.1, 1.65, -0.72],  look: [-1.1, 1.65, -1.2] },
  ktm:      { pos: [-1.65, 1.62, -0.72], look: [-1.65, 1.62, -1.2] },
  senna:    { pos: [1.1, 1.65, -0.72],   look: [1.1, 1.65, -1.2] },
  senna2:   { pos: [1.65, 1.62, -0.72],  look: [1.65, 1.62, -1.2] },
  helmet:   { pos: [0.38, 0.96, -0.18],  look: [0.52, 0.84, -0.42] },
  notebook: { pos: [-0.34, 0.94, -0.28], look: [-0.48, 0.75, -0.55] },
  coffee:   { pos: [-0.24, 0.94, -0.42], look: [-0.38, 0.75, -0.7] },
  bike:     { pos: [2.05, 0.7, 1.2],     look: [1.35, 0.5, 0.2] },
};

export default function Camera() {
  const currentPos = useRef(new THREE.Vector3(0, 1.4, 4.0));
  const currentLook = useRef(new THREE.Vector3(0, 0.4, 0));
  const { isLaptopActive, focusedPoster, activeBikePart } = usePortfolio();

  useFrame((state, delta) => {
    const camera = state.camera;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer;
    const dt = Math.min(delta, 0.1);

    // Read scroll progress
    const progress = getProgress();
    const target = interpolateKeyframes(progress);

    // Disable breathing when zoomed into laptop, poster, or bike to stabilize text
    const isZoomed = isLaptopActive || !!focusedPoster || !!activeBikePart;
    const breathingX = isZoomed ? 0 : Math.sin(time * 0.12) * 0.015 + Math.cos(time * 0.41) * 0.004;
    const breathingY = isZoomed ? 0 : Math.cos(time * 0.15) * 0.01 + Math.sin(time * 0.33) * 0.003;
    const breathingZ = isZoomed ? 0 : Math.sin(time * 0.08) * 0.008;

    // Mouse parallax — dampened to 0.04 for premium restraint
    const mouseScale = 0.04;
    const targetMouseX = isZoomed ? 0 : pointer.x * mouseScale;
    const targetMouseY = isZoomed ? 0 : pointer.y * mouseScale * 0.5;

    // Final destinations (override if user clicked on the laptop, poster, or bike)
    let basePosX = target.pos.x;
    let basePosY = target.pos.y;
    let basePosZ = target.pos.z;

    if (isLaptopActive) {
      basePosX = 0;
      basePosY = 1.039;
      basePosZ = -0.525;
    } else if (focusedPoster && POSTER_TARGETS[focusedPoster]) {
      const pTarget = POSTER_TARGETS[focusedPoster];
      basePosX = pTarget.pos[0];
      basePosY = pTarget.pos[1];
      basePosZ = pTarget.pos[2];
    } else if (activeBikePart) {
      // Dynamic camera targets for bike CAD inspection zoom
      const BIKE_TARGETS: Record<string, { pos: [number, number, number]; look: [number, number, number] }> = {
        engine:       { pos: [2.15, 0.55, 0.7],  look: [1.35, 0.42, 0.2] },
        frame:        { pos: [2.15, 0.75, 0.8],  look: [1.35, 0.58, 0.2] },
        suspension:   { pos: [1.95, 0.45, -0.3], look: [1.25, 0.25, -0.2] },
        rear_section: { pos: [2.05, 0.5, -0.4],  look: [1.35, 0.3, -0.4] },
        electrical:   { pos: [2.05, 0.7, 0.9],   look: [1.35, 0.55, 0.5] },
      };
      const bTarget = BIKE_TARGETS[activeBikePart] || { pos: [2.05, 0.7, 1.2], look: [1.35, 0.5, 0.2] };
      basePosX = bTarget.pos[0];
      basePosY = bTarget.pos[1];
      basePosZ = bTarget.pos[2];
    }

    const destX = basePosX + targetMouseX + breathingX;
    const destY = basePosY + targetMouseY + breathingY;
    const destZ = basePosZ + breathingZ;

    // High-inertia interpolation — heavy, cinematic drag
    const posLerp = 1 - Math.exp(-2.0 * dt);
    const lookLerp = 1 - Math.exp(-2.5 * dt);

    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, destX, posLerp);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, destY, posLerp);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, destZ, posLerp);

    camera.position.copy(currentPos.current);

    // Look target with mouse offset (override if laptop active, poster active, or bike active)
    let baseLookX = target.look.x;
    let baseLookY = target.look.y;
    let baseLookZ = target.look.z;

    if (isLaptopActive) {
      baseLookX = 0;
      baseLookY = 0.864;
      baseLookZ = -0.828;
    } else if (focusedPoster && POSTER_TARGETS[focusedPoster]) {
      const pTarget = POSTER_TARGETS[focusedPoster];
      baseLookX = pTarget.look[0];
      baseLookY = pTarget.look[1];
      baseLookZ = pTarget.look[2];
    } else if (activeBikePart) {
      const BIKE_TARGETS: Record<string, { pos: [number, number, number]; look: [number, number, number] }> = {
        engine:       { pos: [2.15, 0.55, 0.7],  look: [1.35, 0.42, 0.2] },
        frame:        { pos: [2.15, 0.75, 0.8],  look: [1.35, 0.58, 0.2] },
        suspension:   { pos: [1.95, 0.45, -0.3], look: [1.25, 0.25, -0.2] },
        rear_section: { pos: [2.05, 0.5, -0.4],  look: [1.35, 0.3, -0.4] },
        electrical:   { pos: [2.05, 0.7, 0.9],   look: [1.35, 0.55, 0.5] },
      };
      const bTarget = BIKE_TARGETS[activeBikePart] || { pos: [2.05, 0.7, 1.2], look: [1.35, 0.5, 0.2] };
      baseLookX = bTarget.look[0];
      baseLookY = bTarget.look[1];
      baseLookZ = bTarget.look[2];
    }

    const lookDestX = baseLookX + targetMouseX * 0.2;
    const lookDestY = baseLookY + targetMouseY * 0.2;
    const lookDestZ = baseLookZ;

    currentLook.current.x = THREE.MathUtils.lerp(currentLook.current.x, lookDestX, lookLerp);
    currentLook.current.y = THREE.MathUtils.lerp(currentLook.current.y, lookDestY, lookLerp);
    currentLook.current.z = THREE.MathUtils.lerp(currentLook.current.z, lookDestZ, lookLerp);

    camera.lookAt(currentLook.current);
  });

  return null;
}
