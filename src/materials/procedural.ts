/**
 * Procedural Texture Generator
 *
 * Generates roughness, normal, and color maps via Canvas2D.
 * Zero network requests. Mathematically honest.
 * Each texture encodes the physical manufacturing process of its material.
 */

import * as THREE from "three";

/**
 * Generate a normal map from a grayscale heightmap canvas.
 */
function heightToNormal(
  heightCanvas: HTMLCanvasElement,
  strength: number = 2.0
): HTMLCanvasElement {
  const w = heightCanvas.width;
  const h = heightCanvas.height;
  const ctx = heightCanvas.getContext("2d")!;
  const src = ctx.getImageData(0, 0, w, h).data;

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const oCtx = out.getContext("2d")!;
  const dst = oCtx.createImageData(w, h);
  const d = dst.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const l = src[(y * w + ((x - 1 + w) % w)) * 4] / 255;
      const r = src[(y * w + ((x + 1) % w)) * 4] / 255;
      const u = src[(((y - 1 + h) % h) * w + x) * 4] / 255;
      const dn = src[(((y + 1) % h) * w + x) * 4] / 255;

      const dx = (r - l) * strength;
      const dy = (dn - u) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);

      d[i] = ((dx / len) * 0.5 + 0.5) * 255;
      d[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      d[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      d[i + 3] = 255;
    }
  }

  oCtx.putImageData(dst, 0, 0);
  return out;
}

/**
 * Create a tiling canvas texture with RepeatWrapping.
 */
function canvasToTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

// ─── Concrete ────────────────────────────────────────────

export function createConcreteRoughnessMap(): THREE.CanvasTexture {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d")!;

  // Base roughness ~0.78
  ctx.fillStyle = "#c7c7c7";
  ctx.fillRect(0, 0, s, s);

  // Low-frequency tonal variation (curing differences)
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * s;
    const y = Math.random() * s;
    const r = 40 + Math.random() * 120;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const v = Math.random() > 0.5 ? 210 : 180;
    g.addColorStop(0, `rgba(${v},${v},${v},0.15)`);
    g.addColorStop(1, "rgba(200,200,200,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // High-frequency pitting
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * s;
    const y = Math.random() * s;
    ctx.fillStyle = Math.random() > 0.5 ? "#aaaaaa" : "#e0e0e0";
    ctx.fillRect(x, y, Math.random() * 2, Math.random() * 2);
  }

  const tex = canvasToTexture(c);
  tex.repeat.set(3, 3);
  return tex;
}

export function createConcreteNormalMap(): THREE.CanvasTexture {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, s, s);

  // Aggregate texture
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * s;
    const y = Math.random() * s;
    const v = 100 + Math.random() * 55;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  // Form tie holes (evidence of construction process)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = 64 + col * 128;
      const cy = 80 + row * 170;
      ctx.fillStyle = "#4a4a4a";
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const normal = heightToNormal(c, 2.5);
  const tex = canvasToTexture(normal);
  tex.repeat.set(3, 3);
  return tex;
}

// ─── Brushed Aluminum ────────────────────────────────────

export function createBrushedAluminumRoughnessMap(): THREE.CanvasTexture {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d")!;

  // Base roughness ~0.20
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, s, s);

  // Unidirectional grain (horizontal scratches from single-pass machining)
  for (let i = 0; i < 500; i++) {
    const y = Math.random() * s;
    const x = Math.random() * s;
    const len = 20 + Math.random() * 80;
    const bright = Math.random() > 0.6;
    ctx.strokeStyle = bright ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 0.5 + Math.random() * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y + (Math.random() - 0.5) * 0.5);
    ctx.stroke();
  }

  const tex = canvasToTexture(c);
  tex.repeat.set(2, 2);
  return tex;
}

// ─── Carbon Fiber Weave ──────────────────────────────────

export function createCarbonNormalMap(): THREE.CanvasTexture {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, s, s);

  const block = 16;
  const count = s / block;

  for (let by = 0; by < count; by++) {
    for (let bx = 0; bx < count; bx++) {
      const ox = bx * block;
      const oy = by * block;
      const vert = (bx + by) % 2 === 0;

      ctx.fillStyle = vert ? "#a0a0a0" : "#606060";
      ctx.fillRect(ox, oy, block, block);

      // Strand lines within each block
      ctx.strokeStyle = vert ? "#c0c0c0" : "#404040";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < block; i += 2) {
        ctx.beginPath();
        if (vert) {
          ctx.moveTo(ox + i, oy);
          ctx.lineTo(ox + i, oy + block);
        } else {
          ctx.moveTo(ox, oy + i);
          ctx.lineTo(ox + block, oy + i);
        }
        ctx.stroke();
      }
    }
  }

  const normal = heightToNormal(c, 4.0);
  const tex = canvasToTexture(normal);
  tex.repeat.set(8, 8);
  return tex;
}
