import {random} from 'remotion';

// Procedural neuron in the manner of a 19th-century ink plate: a soma, a long apical dendrite,
// several basal dendrites that fork and wander, and a thin axon with a few collaterals.
// Pure function of the seed -> identical on every frame and every render.

export type Pt = [number, number];
export type Branch = {
  pts: Pt[];
  width: number; // stroke width at start (px)
  start: number; // growth start, 0..1 of total growth time
  end: number; // growth end, 0..1
  depth: number;
  axon: boolean;
};
export type Neuron = {soma: Pt[]; branches: Branch[]; axonPath: Pt[]};

type Opts = {seed: string; cx: number; cy: number; scale: number};

export const buildNeuron = ({seed, cx, cy, scale}: Opts): Neuron => {
  let n = 0;
  const rnd = () => random(`${seed}-${n++}`);
  const branches: Branch[] = [];

  // grow one wandering branch, then recurse into its children
  const grow = (x: number, y: number, ang: number, len: number, width: number, depth: number, t0: number, axon: boolean, maxDepth: number) => {
    const steps = Math.max(4, Math.round(len / (6 * scale)));
    const pts: Pt[] = [[x, y]];
    let a = ang;
    let px = x;
    let py = y;
    const stepLen = len / steps;
    for (let i = 0; i < steps; i++) {
      a += (rnd() - 0.5) * (axon ? 0.12 : 0.34);
      px += Math.cos(a) * stepLen;
      py += Math.sin(a) * stepLen;
      pts.push([px, py]);
    }
    const dur = (axon ? 0.5 : 0.22) * (len / (140 * scale));
    const t1 = t0 + dur;
    branches.push({pts, width, start: t0, end: t1, depth, axon});

    if (axon) {
      // a few thin collaterals peeling off the axon
      for (let k = 0; k < 3; k++) {
        const idx = Math.floor(pts.length * (0.3 + 0.2 * k));
        const [bx, by] = pts[idx];
        const side = rnd() < 0.5 ? -1 : 1;
        grow(bx, by, a + side * (0.7 + rnd() * 0.4), len * 0.28, width * 0.6, depth + 1, t0 + dur * (idx / pts.length), false, depth + 2);
      }
      return;
    }
    if (depth >= maxDepth) return;
    const kids = rnd() < 0.25 ? 3 : 2;
    for (let k = 0; k < kids; k++) {
      const spread = 0.35 + rnd() * 0.45;
      const na = a + (k - (kids - 1) / 2) * spread + (rnd() - 0.5) * 0.2;
      grow(px, py, na, len * (0.62 + rnd() * 0.18), width * 0.68, depth + 1, t1, false, maxDepth);
    }
  };

  // soma: an irregular teardrop, pointing up toward the apical dendrite
  const soma: Pt[] = [];
  const R = 16 * scale;
  for (let i = 0; i < 28; i++) {
    const th = (i / 28) * Math.PI * 2;
    const tear = 1 + 0.45 * Math.max(0, -Math.sin(th)) ** 3; // stretched upward
    const wob = 1 + (rnd() - 0.5) * 0.12;
    soma.push([cx + Math.cos(th) * R * 0.85 * wob, cy + Math.sin(th) * R * tear * wob]);
  }

  // apical dendrite: long, upward, deep tree
  grow(cx, cy - R * 1.3, -Math.PI / 2 + (rnd() - 0.5) * 0.2, 150 * scale, 4.2 * scale, 0, 0, false, 4);
  // basal dendrites: sideways and down
  const basal = 4 + Math.floor(rnd() * 3);
  for (let i = 0; i < basal; i++) {
    const ang = Math.PI * (0.05 + (i / (basal - 1)) * 0.9) + (rnd() - 0.5) * 0.3;
    grow(cx + Math.cos(ang) * R * 0.7, cy + Math.sin(ang) * R * 0.7, ang, (70 + rnd() * 40) * scale, 3 * scale, 1, 0.02 * i, false, 3);
  }
  // axon: long, thin, downward
  const axStart = branches.length;
  grow(cx + 2 * scale, cy + R, Math.PI / 2 + (rnd() - 0.5) * 0.15, 330 * scale, 1.6 * scale, 0, 0.05, true, 0);
  const axonPath = branches[axStart].pts;

  const maxEnd = Math.max(...branches.map((b) => b.end));
  branches.forEach((b) => {
    b.start /= maxEnd;
    b.end /= maxEnd;
  });
  return {soma, branches, axonPath};
};

// Smooth polyline -> SVG path using quadratic midpoints.
export const toPath = (pts: Pt[]) => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q ${x.toFixed(1)} ${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
};

export const pointAlong = (pts: Pt[], f: number): Pt => {
  const segs = pts.length - 1;
  const x = Math.min(Math.max(f, 0), 0.9999) * segs;
  const i = Math.floor(x);
  const t = x - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
};
