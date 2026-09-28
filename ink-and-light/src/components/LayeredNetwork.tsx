import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, palette} from '../theme';

// A layered network that tells the winter-and-thaw story:
//  0..frostAt      forward waves of light run left -> right
//  frostAt..       colour drains to frost, waves stall, ice crystals grow from the corners
//  backAt..        an amber wave runs right -> left (the error flowing backwards),
//                  the ice melts and connection weights visibly change thickness
export const LayeredNetwork: React.FC<{layers?: number[]; frostAt?: number; backAt?: number; seed?: string}> = ({
  layers = [5, 8, 10, 8, 4],
  frostAt = 60,
  backAt = 180,
  seed = 'net',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const x0 = width * 0.2;
  const x1 = width * 0.8;
  const nodes = useMemo(
    () =>
      layers.map((n, li) =>
        Array.from({length: n}, (_, k) => ({
          x: x0 + ((x1 - x0) * li) / (layers.length - 1),
          y: height * 0.45 + (k - (n - 1) / 2) * Math.min(72, (height * 0.56) / n),
        })),
      ),
    [layers, x0, x1, height],
  );
  const edges = useMemo(() => {
    const e: {a: {x: number; y: number}; b: {x: number; y: number}; w0: number; w1: number}[] = [];
    nodes.slice(0, -1).forEach((L, li) =>
      L.forEach((a, i) =>
        nodes[li + 1].forEach((b, j) => {
          e.push({a, b, w0: random(`${seed}w0-${li}-${i}-${j}`), w1: random(`${seed}w1-${li}-${i}-${j}`)});
        }),
      ),
    );
    return e;
  }, [nodes, seed]);

  const frost = interpolate(frame, [frostAt, frostAt + 40], [0, 1], clamp) * (1 - interpolate(frame, [backAt + 20, backAt + 90], [0, 1], clamp));
  const learn = interpolate(frame, [backAt, backAt + 110], [0, 1], {...clamp, easing: easeOut});
  // forward wave position (0..1 across the net); slows to a stop in the winter
  const fwdSpeed = frame < frostAt ? 1 : Math.max(0, 1 - (frame - frostAt) / 40);
  const fwdPos = ((frame * 0.012 * fwdSpeed) % 1.3) - 0.15;
  const backPos = 1.15 - interpolate(frame, [backAt, backAt + 70], [0, 1.3], clamp);
  const appear = interpolate(frame, [0, 25], [0, 1], clamp);

  const base = interpolateColors(frost, [0, 1], [palette.phosphor, palette.frost]);

  const glowAt = (x: number, pos: number) => Math.exp(-(((x - x0) / (x1 - x0) - pos) ** 2) / 0.004);

  return (
    <AbsoluteFill style={{opacity: appear}}>
      <svg width={width} height={height}>
        <defs>
          <radialGradient id="nodeGlowP">
            <stop offset="0%" stopColor={palette.phosphor} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.phosphor} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="nodeGlowA">
            <stop offset="0%" stopColor={palette.golgiAmber} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.golgiAmber} stopOpacity={0} />
          </radialGradient>
        </defs>
        {edges.map((e, i) => {
          const mid = (e.a.x + e.b.x) / 2;
          const fwd = frame < frostAt + 40 ? glowAt(mid, fwdPos) * (1 - frost) : 0;
          const back = frame >= backAt ? glowAt(mid, backPos) : 0;
          const w = e.w0 + (e.w1 - e.w0) * learn;
          const color = back > 0.2 ? palette.golgiAmber : base;
          return (
            <line key={i} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke={color} strokeWidth={0.4 + w * 1.6} opacity={0.12 + w * 0.12 + fwd * 0.6 + back * 0.7} />
          );
        })}
        {nodes.flat().map((n, i) => {
          const fwd = glowAt(n.x, fwdPos) * (1 - frost);
          const back = frame >= backAt ? glowAt(n.x, backPos) : 0;
          return (
            <g key={i}>
              {fwd + back > 0.2 ? <circle cx={n.x} cy={n.y} r={22} fill={back > fwd ? 'url(#nodeGlowA)' : 'url(#nodeGlowP)'} opacity={Math.min(1, (fwd + back) * 0.8)} /> : null}
              <circle cx={n.x} cy={n.y} r={6} fill={palette.siliconNight} stroke={base} strokeWidth={1.4} />
            </g>
          );
        })}
        <Frost amount={frost} width={width} height={height} seed={seed} />
      </svg>
    </AbsoluteFill>
  );
};

// Branching ice crystals growing in from the edges.
const Frost: React.FC<{amount: number; width: number; height: number; seed: string}> = ({amount, width, height, seed}) => {
  const crystals = useMemo(() => {
    const out: {d: string; depth: number}[] = [];
    let n = 0;
    const r = () => random(`${seed}-ice-${n++}`);
    const arm = (x: number, y: number, a: number, len: number, depth: number) => {
      const ex = x + Math.cos(a) * len;
      const ey = y + Math.sin(a) * len;
      out.push({d: `M ${x.toFixed(1)} ${y.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`, depth});
      if (depth === 0) return;
      for (let k = 1; k <= 3; k++) {
        const f = k / 4;
        const bx = x + (ex - x) * f;
        const by = y + (ey - y) * f;
        arm(bx, by, a + Math.PI / 3, len * 0.35 * (1 - f * 0.5), depth - 1);
        arm(bx, by, a - Math.PI / 3, len * 0.35 * (1 - f * 0.5), depth - 1);
      }
    };
    const seeds: [number, number, number][] = [
      [0, 0, Math.PI / 4],
      [width, 0, (3 * Math.PI) / 4],
      [0, height, -Math.PI / 4],
      [width, height, (-3 * Math.PI) / 4],
    ];
    seeds.forEach(([x, y, a]) => {
      for (let k = 0; k < 4; k++) arm(x, y, a + (r() - 0.5) * 1.2, 180 + r() * 160, 2);
    });
    return out;
  }, [width, height, seed]);
  if (amount <= 0) return null;
  return (
    <g stroke="rgba(214,232,245,0.5)" strokeWidth={1} fill="none">
      {crystals.map((c, i) => {
        // main arms (depth 2) grow first, then the side branches
        const k = interpolate(amount, c.depth === 2 ? [0, 0.6] : c.depth === 1 ? [0.3, 0.85] : [0.55, 1], [0, 1], clamp);
        return k > 0 ? <path key={i} d={c.d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} /> : null;
      })}
    </g>
  );
};
