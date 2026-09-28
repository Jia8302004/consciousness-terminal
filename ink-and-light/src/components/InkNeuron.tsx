import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {buildNeuron, pointAlong, toPath} from '../lib/neuronGeometry';
import {clamp, inkToLight, organic, palette} from '../theme';

// A neuron drawn stroke by stroke, like a plate by Ramón y Cajal.
//  grow:     frames over which the whole cell draws itself (from `delay`)
//  lit:      0 = iron-gall ink, 1 = glowing light (the 1956 ignition)
//  pulses:   when > 0, bright spikes run down the axon (action potentials)
export const InkNeuron: React.FC<{
  seed?: string;
  cx: number;
  cy: number;
  scale?: number;
  delay?: number;
  grow?: number;
  lit?: number;
  pulses?: number; // spikes per second
  opacity?: number;
}> = ({seed = 'cajal', cx, cy, scale = 1, delay = 0, grow = 150, lit = 0, pulses = 0, opacity = 1}) => {
  const frame = useCurrentFrame();
  const n = useMemo(() => buildNeuron({seed, cx, cy, scale}), [seed, cx, cy, scale]);
  const g = interpolate(frame - delay, [0, grow], [0, 1], {...clamp, easing: organic});
  const stroke = inkToLight(lit);
  const somaT = interpolate(frame - delay, [0, 20], [0, 1], clamp);

  // widen = 1 draws the ink line; widen > 1 draws a soft halo copy for the glow.
  // (Glow is built from wide, faint strokes instead of SVG blur filters: blur filters on big groups
  //  are slow and can render with tiling artifacts on software GL.)
  const paths = (widen: number) =>
    n.branches.map((b, i) => {
      const p = interpolate(g, [b.start, b.end], [0, 1], clamp);
      if (p <= 0) return null;
      return (
        <path
          key={i}
          d={toPath(b.pts)}
          fill="none"
          stroke={stroke}
          strokeWidth={Math.max(0.6, b.width) * widen + (widen > 1 ? 2 : 0)}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      );
    });

  const spikes: React.ReactNode[] = [];
  if (pulses > 0) {
    const t = frame / 30;
    for (let k = 0; k < 4; k++) {
      const f = (t * pulses * 0.35 + k / 4) % 1;
      const [x, y] = pointAlong(n.axonPath, f);
      spikes.push(<circle key={k} cx={x} cy={y} r={14 * scale} fill="url(#spikeGrad)" opacity={Math.sin(f * Math.PI)} />);
    }
  }

  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, overflow: 'visible', opacity}}>
      <defs>
        <radialGradient id="spikeGrad">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="25%" stopColor={palette.phosphor} stopOpacity={0.9} />
          <stop offset="100%" stopColor={palette.phosphor} stopOpacity={0} />
        </radialGradient>
      </defs>
      {lit > 0 ? (
        <>
          <g opacity={lit * 0.07}>{paths(7)}</g>
          <g opacity={lit * 0.16}>{paths(3.2)}</g>
        </>
      ) : null}
      <g>{paths(1)}</g>
      {lit > 0 ? <circle cx={cx} cy={cy} r={34 * scale} fill="url(#spikeGrad)" opacity={somaT * lit * 0.55} /> : null}
      <path d={toPath(n.soma) + ' Z'} fill={stroke} opacity={somaT} />
      {spikes}
    </svg>
  );
};
