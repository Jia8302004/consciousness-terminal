import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, palette} from '../theme';
import {fonts} from '../fonts';

// An illustrative 19x19 board (NOT a reconstruction of a real game): the grid draws itself,
// stones fall in quick succession, then a pause, then one stone lands with a shockwave and its move number.
export const GoBoard: React.FC<{keyMoveAt?: number; keyMove?: [number, number]; label?: string; seed?: string}> = ({
  keyMoveAt = 120,
  keyMove = [13, 5],
  label = '37',
  seed = 'go',
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const size = height * 0.74;
  const step = size / 18;
  const ox = width * 0.62 - size / 2;
  const oy = height / 2 - size / 2;
  const stones = useMemo(() => {
    const used = new Set<string>([keyMove.join(',')]);
    const out: [number, number][] = [];
    let n = 0;
    while (out.length < 36 && n < 500) {
      const c = Math.floor(random(`${seed}c${n}`) * 19);
      const r = Math.floor(random(`${seed}r${n}`) * 19);
      n++;
      // keep the illustrative position loosely "go-like": avoid the outermost line
      if (c === 0 || r === 0 || c === 18 || r === 18 || used.has(`${c},${r}`)) continue;
      used.add(`${c},${r}`);
      out.push([c, r]);
    }
    return out;
  }, [seed, keyMove]);
  const grid = interpolate(frame, [0, 40], [0, 1], {...clamp, easing: easeOut});
  const k = frame - keyMoveAt;
  const land = interpolate(k, [0, 6], [0, 1], clamp);
  const wave = interpolate(k, [0, 45], [0, 1], clamp);
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 19; i++) {
    const d = interpolate(grid, [i / 40, i / 40 + 0.5], [0, 1], clamp);
    lines.push(<line key={`h${i}`} x1={ox} y1={oy + i * step} x2={ox + size * d} y2={oy + i * step} />);
    lines.push(<line key={`v${i}`} x1={ox + i * step} y1={oy} x2={ox + i * step} y2={oy + size * d} />);
  }
  const star = [3, 9, 15];
  const [kc, kr] = keyMove;
  const kx = ox + kc * step;
  const ky = oy + kr * step;
  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <defs>
          <radialGradient id="stoneGrad">
            <stop offset="0%" stopColor={palette.golgiAmber} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.golgiAmber} stopOpacity={0} />
          </radialGradient>
        </defs>
        <g stroke="rgba(207,243,241,0.28)" strokeWidth={1}>{lines}</g>
        {star.flatMap((a) => star.map((b) => <circle key={`${a}-${b}`} cx={ox + a * step} cy={oy + b * step} r={3} fill="rgba(207,243,241,0.4)" opacity={grid} />))}
        {stones.map(([c, r], i) => {
          const t = interpolate(frame, [40 + i * 2, 46 + i * 2], [0, 1], clamp);
          const black = i % 2 === 0;
          return t > 0 ? (
            <circle key={i} cx={ox + c * step} cy={oy + r * step} r={step * 0.46 * t} fill={black ? palette.siliconNight : palette.nightText} stroke={black ? 'rgba(207,243,241,0.55)' : 'none'} strokeWidth={1.2} />
          ) : null;
        })}
        {land > 0 ? (
          <g>
            <circle cx={kx} cy={ky} r={step * (0.5 + wave * 6)} fill="none" stroke={palette.golgiAmber} strokeWidth={2} opacity={(1 - wave) * 0.8} />
            <circle cx={kx} cy={ky} r={step * 1.6} fill="url(#stoneGrad)" opacity={0.6 * land} />
            <circle cx={kx} cy={ky} r={step * 0.46 * (1.4 - 0.4 * land)} fill={palette.siliconNight} stroke={palette.golgiAmber} strokeWidth={1.6} opacity={land} />
            <text x={kx} y={ky + 7} textAnchor="middle" style={{fontFamily: fonts.nightNum, fontSize: 20}} fill={palette.golgiAmber} opacity={interpolate(k, [10, 25], [0, 1], clamp)}>
              {label}
            </text>
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
