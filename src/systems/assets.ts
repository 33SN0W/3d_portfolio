/**
 * Asset Loader Architecture
 *
 * The space contains objects that must load before they can exist.
 * This system manages that loading with the same discipline as the space itself:
 * quietly, without announcement, without loading screens.
 *
 * The darkness at the beginning IS the loading state.
 * The engine tick IS the progress indicator.
 */

import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Asset manifest — every asset the space will ever need.
 * Currently empty. Assets are added as objects earn their presence.
 */
export const manifest = {
  textures: {} as Record<string, string>,
  models: {} as Record<string, string>,
  hdri: {} as Record<string, string>,
} as const;

/**
 * Preload an HDRI environment map.
 * Returns null if no path is provided — the space starts in pure darkness.
 */
export function useHDRI(path: string | null) {
  if (!path) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useLoader(RGBELoader, path);
}

/**
 * Preload a texture.
 */
export function useTexture(path: string) {
  return useLoader(TextureLoader, path);
}

/**
 * Asset loading state tracker.
 * Reports total assets and loaded count for Suspense coordination.
 */
export class AssetTracker {
  private loaded = 0;
  private total = 0;

  register(count: number): void {
    this.total += count;
  }

  complete(): void {
    this.loaded++;
  }

  get progress(): number {
    if (this.total === 0) return 1;
    return this.loaded / this.total;
  }

  get isComplete(): boolean {
    return this.loaded >= this.total;
  }
}

/** Singleton asset tracker for the space. */
export const assetTracker = new AssetTracker();
