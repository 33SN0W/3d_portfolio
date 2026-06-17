"use client";

/**
 * Scene — The R3F Canvas
 *
 * ACES tone mapping. Linear color workflow. Physical shadows.
 * Background is #050505. The space exists before the camera arrives.
 */

import { Suspense, useContext } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Camera from "./Camera";
import Lighting from "./Lighting";
import GroundPlane from "./GroundPlane";
import Workbench from "./Workbench";
import KTM from "./KTM";
import { PortfolioContext } from "@/providers/PortfolioProvider";

export default function Scene() {
  const portfolioVal = useContext(PortfolioContext);

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 1.5]}
      camera={{
        fov: 50,
        near: 0.1,
        far: 100,
        position: [0, 1.4, 4],
      }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
        outputColorSpace: THREE.SRGBColorSpace,
        antialias: true,
      }}
      shadows
    >
      {portfolioVal && (
        <PortfolioContext.Provider value={portfolioVal}>
          <color attach="background" args={["#050505"]} />
          <Camera />
          <Lighting />
          <GroundPlane />
          <Suspense fallback={null}>
            <Workbench />
            <KTM />
          </Suspense>
        </PortfolioContext.Provider>
      )}
    </Canvas>
  );
}