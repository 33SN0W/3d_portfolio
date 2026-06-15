/**
 * Animation System — GSAP + Theatre.js Integration
 *
 * The shot list has 28 shots with precise timestamps.
 * GSAP provides the timeline architecture.
 * Theatre.js provides the visual sequencer for tuning.
 *
 * This module initializes both and bridges them.
 * No timelines are created yet — the space starts in silence.
 */

import gsap from "gsap";

/**
 * GSAP configuration for this world.
 *
 * All easing curves are physically grounded.
 * No CSS ease-in-out defaults.
 * Custom curves that model real material behavior.
 */
export function initGSAP(): void {
  // Register GSAP defaults that match the motion philosophy
  gsap.defaults({
    // Deceleration that feels like weight settling. Not a bounce. A rest.
    ease: "power2.out",
    // Duration that implies mass. Nothing in this world happens instantly.
    duration: 1.2,
    // Overwrite concurrent tweens to prevent animation conflicts.
    overwrite: "auto",
  });
}

/**
 * Custom easing curves from the shot list.
 * Each is a specific physical behavior, not a stylistic choice.
 */
export const easings = {
  /** Slow start, patient deceleration. For the approach dolly. */
  dollyForward: "cubic-bezier(0.25, 0.0, 0.1, 1.0)",

  /** Near-zero start, immediate commit. For settling to rest. */
  settle: "cubic-bezier(0.0, 0.0, 0.05, 1.0)",

  /** Linear with slight ease-out. For pan movements. */
  pan: "power1.out",

  /** Smooth focus transitions. Not instant. The lens has physical travel. */
  focusRack: "power2.inOut",
} as const;

/**
 * Master timeline for the entrance sequence.
 * Created empty — shots are added as the scene is populated.
 */
export function createMasterTimeline(): gsap.core.Timeline {
  return gsap.timeline({
    paused: true,
    defaults: {
      ease: easings.pan,
    },
  });
}

/**
 * Theatre.js project initialization.
 * Dev-only — the studio never ships to production.
 *
 * Theatre.js is loaded dynamically to avoid bundling in production.
 */
export async function initTheatre(): Promise<void> {
  if (process.env.NODE_ENV !== "development") return;

  try {
    const core = await import("@theatre/core");
    const studio = await import("@theatre/studio");

    studio.default.initialize();

    // Create the project for this world
    core.getProject("Prateeks World");
  } catch (e) {
    // Theatre.js is optional. The world exists without it.
    console.warn("[Theatre.js] Failed to initialize:", e);
  }
}
