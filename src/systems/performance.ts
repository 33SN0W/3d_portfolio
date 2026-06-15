/**
 * Performance Monitor — Dev Only
 *
 * A 3D scene that drops below 60fps breaks the illusion of physical presence.
 * The camera stutters instead of gliding. Motion feels digital instead of massive.
 *
 * This monitor exists to prevent that. It never ships to production.
 */

import Stats from "stats.js";

let stats: Stats | null = null;

/**
 * Initialize the performance monitor.
 * Appends to document.body in dev mode only.
 * Returns a cleanup function.
 */
export function initPerformanceMonitor(): () => void {
  if (typeof window === "undefined") return () => {};
  if (process.env.NODE_ENV !== "development") return () => {};

  stats = new Stats();
  stats.showPanel(0); // FPS panel
  stats.dom.style.cssText =
    "position:fixed;bottom:0;left:0;z-index:9999;opacity:0.8;";
  document.body.appendChild(stats.dom);

  return () => {
    if (stats) {
      document.body.removeChild(stats.dom);
      stats = null;
    }
  };
}

/** Call at the beginning of each frame. */
export function beginFrame(): void {
  stats?.begin();
}

/** Call at the end of each frame. */
export function endFrame(): void {
  stats?.end();
}
