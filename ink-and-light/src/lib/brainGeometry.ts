import {random} from 'remotion';

// Procedural brain-shaped point cloud (no scanned mesh -> no licensing questions).
// Two hemispheres = ellipsoids with a medial gap, a flattened base, "gyri" as radial ripples,
// plus a cerebellum tucked under the back. Units: roughly -1..1 front-to-back (z).
export const buildBrainPoints = (count: number, seed: string) => {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r1 = random(`${seed}a${i}`);
    const r2 = random(`${seed}b${i}`);
    const r3 = random(`${seed}c${i}`);
    // uniform direction on a sphere
    const u = r1 * 2 - 1;
    const th = r2 * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    let dx = s * Math.cos(th);
    let dy = u;
    let dz = s * Math.sin(th);
    const cerebellum = r3 < 0.1;
    let x: number, y: number, z: number;
    if (cerebellum) {
      x = dx * 0.5;
      y = -0.42 + dy * 0.22;
      z = -0.62 + dz * 0.3;
    } else {
      const hemi = r3 < 0.55 ? -1 : 1;
      // gyri: ripples on the surface
      const ripple = 1 + 0.05 * Math.sin(dy * 14 + dz * 9) * Math.sin(dx * 11 + dz * 13) + 0.025 * Math.sin(dz * 31 + dy * 23);
      // mostly surface points, a few inside for depth
      const shell = random(`${seed}d${i}`) < 0.85 ? 1 : 0.55 + random(`${seed}e${i}`) * 0.4;
      x = hemi * (0.04 + Math.abs(dx) * 0.58) * ripple * shell;
      y = dy * 0.66 * ripple * shell;
      z = dz * 0.98 * ripple * shell;
      if (y < -0.28) y = -0.28 + (y + 0.28) * 0.35; // flatten the base
      if (z > 0.3) y *= 1 - (z - 0.3) * 0.25; // taper toward the frontal pole
    }
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
};

// Snap every point to a voxel lattice: the "artificial" twin of the same shape.
export const latticeOf = (pos: Float32Array, step = 0.075) => {
  const out = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i++) out[i] = Math.round(pos[i] / step) * step;
  return out;
};
