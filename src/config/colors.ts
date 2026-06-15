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

export type LiveryType = "mclaren" | "ferrari" | "mercedes" | "camel" | "marlboro" | "redbull";

export const LIVERIES: Record<LiveryType, { color: string; glow: string; label: string }> = {
  mclaren: { color: "#ff6900", glow: "#ff8a30", label: "MCLAREN PAPAYA" },
  ferrari: { color: "#ff1800", glow: "#ff4f33", label: "FERRARI ROSSO" },
  mercedes: { color: "#00ffcc", glow: "#4dffd2", label: "MERCEDES SILVER" },
  camel: { color: "#fdb913", glow: "#fdcb4a", label: "CAMEL RACING" },
  marlboro: { color: "#ff3333", glow: "#ff6666", label: "MARLBORO SPEED" },
  redbull: { color: "#0066ff", glow: "#3385ff", label: "RED BULL JAPAN" }
};

/** The clear color for the renderer. This is what darkness looks like. */
export const clearColor = palette.primaryBlack;

