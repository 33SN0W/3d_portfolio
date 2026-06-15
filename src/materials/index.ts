import * as THREE from "three";

// ─── RAW CONCRETE ────────────────────────────────────────
export function createConcrete(overrides?: Partial<THREE.MeshPhysicalMaterialParameters>) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#333333"),
    roughness: 0.82,
    metalness: 0.0,
    ...overrides,
  });
}

// ─── STRUCTURAL CARBON FIBER ─────────────────────────────
export function createCarbon(overrides?: Partial<THREE.MeshPhysicalMaterialParameters>) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1a1a1a"),
    roughness: 0.35,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    ...overrides,
  });
}

// ─── BRUSHED ALUMINUM ────────────────────────────────────
export function createBrushedAluminum(
  overrides?: Partial<THREE.MeshPhysicalMaterialParameters>
) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#c8c8c8"),
    roughness: 0.28,
    metalness: 0.92,
    ...overrides,
  });
}

// ─── MACHINED ALUMINUM ───────────────────────────────────
export function createMachinedAluminum(
  overrides?: Partial<THREE.MeshPhysicalMaterialParameters>
) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#e0e0e0"),
    roughness: 0.08,
    metalness: 0.98,
    clearcoat: 0.4,
    clearcoatRoughness: 0.05,
    ...overrides,
  });
}

// ─── ANODIZED ORANGE ─────────────────────────────────────
export function createAnodizedOrange(
  overrides?: Partial<THREE.MeshPhysicalMaterialParameters>
) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#ff1800"),
    roughness: 0.15,
    metalness: 0.95,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    ...overrides,
  });
}

// ─── STEEL ───────────────────────────────────────────────
export function createSteel(overrides?: Partial<THREE.MeshPhysicalMaterialParameters>) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#808080"),
    roughness: 0.35,
    metalness: 0.88,
    ...overrides,
  });
}

// ─── SMOKED GLASS ────────────────────────────────────────
export function createSmokedGlass(
  overrides?: Partial<THREE.MeshPhysicalMaterialParameters>
) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#333333"),
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.6,
    thickness: 0.05,
    ior: 1.5,
    ...overrides,
  });
}

// ─── WORN LEATHER ────────────────────────────────────────
export function createWornLeather(
  overrides?: Partial<THREE.MeshPhysicalMaterialParameters>
) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#5a3a22"),
    roughness: 0.78,
    metalness: 0.0,
    ...overrides,
  });
}

// ─── POLISHED EPOXY CONCRETE FLOOR ───────────────────────
export function createEpoxyFloor(overrides?: Partial<THREE.MeshPhysicalMaterialParameters>) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#16161a"),
    roughness: 0.3,
    metalness: 0.0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    ...overrides,
  });
}
