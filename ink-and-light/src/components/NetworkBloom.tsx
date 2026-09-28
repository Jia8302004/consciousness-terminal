import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, palette, precise} from '../theme';

// "The networks began to grow": one small net, then the camera pulls back to reveal it is one tile
// in an ever larger lattice of nets, each flickering with activity.
const Tile: React.FC<{seed: string; t: number; lod: boolean}> = ({seed, t, lod}) => {
  if (lod) {
    // far away: a tile is just a flickering smudge — keeps thousands of tiles cheap to draw
    const act = Math.max(0, Math.sin(t * 3 + random(`${seed}lod`) * 6.28));
    return (
      <g>
        <rect x={0} y={-60} width={180} height={120} fill={act > 0.9 ? palette.golgiAmber : palette.phosphor} opacity={0.1 + act * 0.25} />
        <line x1={0} y1={0} x2={180} y2={0} stroke={palette.phosphor} strokeWidth={6} opacity={0.35} />
      </g>
    );
  }
  const layers = [3, 5, 5, 3];
  const pts = layers.map((n, li) => Array.from({length: n}, (_, k) => ({x: li * 60, y: (k - (n - 1) / 2) * 34})));
  const lines: React.ReactNode[] = [];
  pts.slice(0, -1).forEach((L, li) =>
    L.forEach((a, i) =>
      pts[li + 1].forEach((b, j) => {
        const act = Math.max(0, Math.sin(t * 3 + random(`${seed}${li}${i}${j}`) * 6.28));
        lines.push(<line key={`${li}-${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={act > 0.9 ? palette.golgiAmber : palette.phosphor} strokeWidth={1} opacity={0.15 + act * 0.45} />);
      }),
    ),
  );
  return (
    <g>
      {lines}
      {pts.flat().map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={palette.phosphor} opacity={0.8} />
      ))}
    </g>
  );
};

export const NetworkBloom: React.FC<{fromScale?: number; toScale?: number; grid?: number}> = ({fromScale = 3.2, toScale = 0.09, grid = 41}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames, fps} = useVideoConfig();
  // zoom in log-space so every second feels like the same "order of magnitude" of pull-back
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {...clamp, easing: precise});
  const s = fromScale * Math.pow(toScale / fromScale, p);
  const t = frame / fps;
  const pitch = 240;
  const half = Math.floor(grid / 2);
  // only draw tiles that can be on screen at the current scale
  const visible = Math.min(half, Math.ceil(width / 2 / (pitch * s)) + 1);
  const tiles = useMemo(() => {
    const out: {i: number; j: number}[] = [];
    for (let i = -half; i <= half; i++) for (let j = -half; j <= half; j++) out.push({i, j});
    return out;
  }, [half]);
  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2} ${height / 2}) scale(${s}) translate(-90 0)`}>
          {tiles
            .filter(({i, j}) => Math.abs(i) <= visible && Math.abs(j) <= visible * 0.7)
            .map(({i, j}) => (
              <g key={`${i}_${j}`} transform={`translate(${i * pitch} ${j * pitch * 0.75})`} opacity={i === 0 && j === 0 ? 1 : interpolate(s, [fromScale * 0.25, fromScale * 0.6], [0.9, 0], clamp)}>
                <Tile seed={`${i}_${j}`} t={t + (i * 7 + j * 3) * 0.1} lod={pitch * s < 70} />
              </g>
            ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
