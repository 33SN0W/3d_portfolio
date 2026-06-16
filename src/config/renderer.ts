/**
 * Renderer Configuration
 *
 * Every value here is a decision traced to the Art Bible and Lighting Package.
 * No defaults. No guesses.
 */

import { ACESFilmicToneMapping, PCFShadowMap, SRGBColorSpace } from "three";

export const rendererConfig = {
  /** ACES filmic — cinema-grade highlight rolloff. Matches BR2049 reference. */
  toneMapping: ACESFilmicToneMapping,

  /** Neutral exposure. Will be tuned when lights enter the scene. */
  toneMappingExposure: 1.0,

  /** Output to sRGB displays. Internal math stays linear. */
  outputColorSpace: SRGBColorSpace,

  /** Shadows are information (Art Bible §III). */
  shadows: true,

  /** Soft penumbra matching the 30–40mm falloff specified in the lighting package. */
  shadowMapType: PCFShadowMap,

  /** Retina support capped at 2x. Beyond 2x is waste with no visual gain. */
  pixelRatio: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,

  /** Clean edges. No jaggies on machined aluminum surfaces. */
  antialias: true,

  /**
   * The background is not transparent. Not absent.
   * It is #050505 — Primary Black from the color philosophy.
   * "The absence of illumination."
   */
  alpha: false,
} as const;

export const cameraConfig = {
  /** Human field of view. No wide-angle distortion (camera philosophy). */
  fov: 50,

  /** Near plane — close enough to see desk objects at macro range. */
  near: 0.1,

  /** Far plane — the space is finite. A garage workshop, not infinity. */
  far: 100,

  /** Entry position: eye height 1600mm, 5m from desk. The approach begins here. */
  position: [0, 1.6, 5] as [number, number, number],
} as const;
