import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from '../theme';

// Night-world background: faint drifting cells that occasionally fire (a brief flash + halo).
// Each cell fires on its own deterministic rhythm; `rate` scales how busy the field is.
export const NeuralDust: React.FC<{count?: number; seed?: string; rate?: number; brightness?: number; color?: string}> = ({
  count = 320,
  seed = 'dust',
  rate = 1,
  brightness = 1,
  color = palette.golgiAmber,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const cells = useMemo(
    () =>
      Array.from({length: count}, (_, i) => ({
        x: random(`${seed}x${i}`) * width,
        y: random(`${seed}y${i}`) * height,
        vx: (random(`${seed}vx${i}`) - 0.5) * 6,
        vy: (random(`${seed}vy${i}`) - 0.5) * 6,
        period: 2 + random(`${seed}p${i}`) * 7,
        phase: random(`${seed}ph${i}`),
        r: 0.6 + random(`${seed}r${i}`) ** 3 * 2,
      })),
    [count, seed, width, height],
  );
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <defs>
          <radialGradient id={`dustGrad-${seed}`}>
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>
        {cells.map((c, i) => {
          const x = (((c.x + c.vx * t) % width) + width) % width;
          const y = (((c.y + c.vy * t) % height) + height) % height;
          const ph = (t * rate) / c.period + c.phase;
          const f = ph - Math.floor(ph);
          const fire = f < 0.06 ? 1 - f / 0.06 : 0; // sharp spike, fast decay
          const base = 0.22 * brightness;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={c.r} fill={palette.nightText} opacity={base + fire * 0.7 * brightness} />
              {fire > 0.05 ? <circle cx={x} cy={y} r={c.r * 9} fill={`url(#dustGrad-${seed})`} opacity={fire * 0.8 * brightness} /> : null}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
