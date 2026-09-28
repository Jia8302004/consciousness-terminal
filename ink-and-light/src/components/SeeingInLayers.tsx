import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, palette, precise} from '../theme';

// Phase 1 (after Hubel & Wiesel): a bar sweeps through orientations inside a receptive field;
//   a grid of cells, each tuned to one orientation, lights up when the bar matches it.
// Phase 2 (from `assembleAt`): the tuned edges leave the grid and assemble into an eye —
//   simple edges combine into a shape, layer by layer.
type Seg = {x: number; y: number; a: number};

const eyeTargets = (cx: number, cy: number, w: number): Seg[] => {
  const out: Seg[] = [];
  const h = w * 0.42;
  // upper and lower lids (sine arcs)
  for (let i = 0; i <= 26; i++) {
    const u = i / 26;
    const x = cx - w / 2 + u * w;
    const dy = Math.sin(u * Math.PI) * h;
    const slope = Math.atan2(Math.cos(u * Math.PI) * Math.PI * h, w);
    out.push({x, y: cy - dy, a: -slope});
    if (i > 0 && i < 26) out.push({x, y: cy + dy * 0.8, a: slope * 0.8});
  }
  // iris
  for (let i = 0; i < 22; i++) {
    const th = (i / 22) * Math.PI * 2;
    const r = h * 0.62;
    out.push({x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r, a: th + Math.PI / 2});
  }
  // pupil
  for (let i = 0; i < 10; i++) {
    const th = (i / 10) * Math.PI * 2;
    const r = h * 0.25;
    out.push({x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r, a: th + Math.PI / 2});
  }
  return out;
};

export const SeeingInLayers: React.FC<{assembleAt?: number; seed?: string}> = ({assembleAt = 150, seed = 'v1'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cols = 9;
  const rows = 6;
  const gx = width * 0.56;
  const gy = height * 0.36;
  const cell = 70;
  const grid = useMemo(
    () =>
      Array.from({length: cols * rows}, (_, i) => ({
        x: gx + (i % cols) * cell,
        y: gy + Math.floor(i / cols) * cell,
        pref: random(`${seed}-pref-${i}`) * Math.PI,
      })),
    [gx, gy, seed],
  );
  const targets = useMemo(() => eyeTargets(width * 0.5, height * 0.47, width * 0.34), [width, height]);

  // stimulus bar sweeps orientation back and forth
  const theta = (Math.sin(frame / 38) * 0.5 + 0.5) * Math.PI;
  const rfx = width * 0.26;
  const rfy = height * 0.45;
  const assemble = interpolate(frame, [assembleAt, assembleAt + 90], [0, 1], {...clamp, easing: precise});
  const phase1 = 1 - interpolate(frame, [assembleAt - 10, assembleAt + 30], [0, 1], clamp);
  const appear = interpolate(frame, [0, 30], [0, 1], {...clamp, easing: easeOut});

  const response = (pref: number) => {
    let d = Math.abs(pref - theta);
    d = Math.min(d, Math.PI - d);
    return Math.exp(-(d * d) / 0.05);
  };

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <defs>
          <radialGradient id="cellGrad">
            <stop offset="0%" stopColor={palette.golgiAmber} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.golgiAmber} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* receptive field + stimulus */}
        <g opacity={phase1 * appear}>
          <circle cx={rfx} cy={rfy} r={150} fill="none" stroke="rgba(207,243,241,0.25)" strokeDasharray="3 8" />
          <line
            x1={rfx - Math.cos(theta) * 120}
            y1={rfy - Math.sin(theta) * 120}
            x2={rfx + Math.cos(theta) * 120}
            y2={rfy + Math.sin(theta) * 120}
            stroke={palette.phosphor}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </g>
        {/* tuned cells: become the moving edges in phase 2 */}
        {grid.map((c, i) => {
          const tgt = targets[i % targets.length];
          const k = interpolate(assemble, [(i / grid.length) * 0.4, (i / grid.length) * 0.4 + 0.6], [0, 1], clamp);
          const x = c.x + (tgt.x - c.x) * k;
          const y = c.y + (tgt.y - c.y) * k;
          const a = c.pref + (tgt.a - c.pref) * k;
          const resp = phase1 > 0 ? response(c.pref) * phase1 : 0;
          const L = 22 - 8 * k;
          const color = resp > 0.1 ? palette.golgiAmber : palette.phosphor;
          return (
            <g key={i} opacity={appear}>
              <circle cx={c.x} cy={c.y} r={26} fill="none" stroke="rgba(207,243,241,0.14)" opacity={phase1} />
              {resp > 0.1 ? <circle cx={c.x} cy={c.y} r={34} fill="url(#cellGrad)" opacity={resp * 0.5} /> : null}
              <line
                x1={x - Math.cos(a) * L}
                y1={y - Math.sin(a) * L}
                x2={x + Math.cos(a) * L}
                y2={y + Math.sin(a) * L}
                stroke={color}
                strokeWidth={2.2}
                strokeLinecap="round"
                opacity={0.35 + 0.65 * Math.max(resp, k)}
              />
            </g>
          );
        })}
        {/* the remaining target edges fade in so the eye closes */}
        {targets.slice(grid.length).map((tg, i) => {
          const k = interpolate(assemble, [0.5 + (i / targets.length) * 0.4, 0.95], [0, 1], clamp);
          return (
            <line
              key={`t${i}`}
              x1={tg.x - Math.cos(tg.a) * 14}
              y1={tg.y - Math.sin(tg.a) * 14}
              x2={tg.x + Math.cos(tg.a) * 14}
              y2={tg.y + Math.sin(tg.a) * 14}
              stroke={palette.phosphor}
              strokeWidth={2.2}
              strokeLinecap="round"
              opacity={k}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
