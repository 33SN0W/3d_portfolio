/**
 * Color Palette — derived from the environment, not invented.
 *
 * Every color here exists because it exists in the physical space.
 * Hex values from the Art Bible. Linear-space conversions for Three.js.
 *
 * Three.js works in linear color space internally.
 * These sRGB hex values are converted to linear by Three.js Color class automatically
 * when used with the linear workflow (outputColorSpace = SRGBColorSpace).
 */

export const palette = {
  /**
   * Primary Black — #050505
   * Not a background color. The absence of illumination.
   * The space where light has not reached yet.
   */
  primaryBlack: "#050505",

  /**
   * Concrete — #111111
   * The wall. The floor. The working surfaces.
   * Not pure black. Concrete is never pure black.
   */
  concrete: "#111111",

  /**
   * Carbon — #1A1A1A
   * The substrate. The material of the tools and the structure.
   */
  carbon: "#1a1a1a",

  /**
   * Titanium — #A4A4A4
   * Aged aluminum. The fasteners. The machined edges.
   * Never bright. Always slightly dulled.
   */
  titanium: "#a4a4a4",

  /**
   * Steel — #707070
   * Deeper, cooler. The floor brackets, the hardware.
   */
  steel: "#707070",

  /**
   * Warm White — #F2F2F2
   * Not white-white. The color of paper under warm light.
   * Text only. Human language only.
   */
  warmWhite: "#f2f2f2",

  /**
   * Primary Orange — #FF6900
   * The motorcycle's accent. The one warm light in the room.
   * Less than 2% of the total visual field.
   */
  primaryOrange: "#ff6900",

  /**
   * Orange Glow — #FF8A30
   * The ambient spill of the orange light.
   * On concrete. On chrome. On the edge of a helmet visor.
   */
  orangeGlow: "#ff8a30",
} as const;

export type LiveryType =
  | "ducati"
  | "yamaha"
  | "ktm"
  | "gresini"
  | "vr46"
  | "pramac"
  | "lcr";

export const LIVERIES: Record<LiveryType, { color: string; glow: string; label: string }> = {
  ducati: { color: "#e50000", glow: "#ff3333", label: "DUCATI LENOVO" },
  yamaha: { color: "#004b93", glow: "#00a2ff", label: "MONSTER YAMAHA" },
  ktm: { color: "#ff5000", glow: "#ff7c33", label: "RED BULL KTM" },
  gresini: { color: "#8fa8ff", glow: "#a3b8eb", label: "GRESINI RACING" },
  vr46: { color: "#dfff00", glow: "#f3ff80", label: "PERTAMINA VR46" },
  pramac: { color: "#a000c8", glow: "#d030ff", label: "PRIMA PRAMAC" },
  lcr: { color: "#008751", glow: "#00df85", label: "LCR HONDA" }
};

/** The clear color for the renderer. This is what darkness looks like. */
export const clearColor = palette.primaryBlack;

