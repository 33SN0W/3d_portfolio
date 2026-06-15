"use client";

/**
 * GroundPlane — The concrete floor of the workshop
 *
 * A surface that exists to receive light and shadow.
 * Not a design element. A physical surface.
 * Extends into darkness in every direction.
 * The edges are never visible — the darkness swallows them.
 */

import { useMemo } from "react";
import { createEpoxyFloor } from "@/materials";

export default function GroundPlane() {
  const material = useMemo(() => createEpoxyFloor(), []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      material={material}
    >
      <planeGeometry args={[40, 40]} />
    </mesh>
  );
}
