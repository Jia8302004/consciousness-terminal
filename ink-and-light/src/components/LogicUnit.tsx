import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, organic, palette} from '../theme';
import {fonts} from '../fonts';

// The neuron as a threshold unit (after McCulloch & Pitts, 1943), drawn as an ink diagram:
// three inputs with weights, a summing body with a threshold, one output.
// `fire` (0..1) lights the output once the inputs "add up".
export const LogicUnit: React.FC<{cx: number; cy: number; r?: number; delay?: number; fireAt?: number}> = ({cx, cy, r = 90, delay = 0, fireAt = 150}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const draw = (a: number, b: number) => interpolate(local, [a, b], [0, 1], {...clamp, easing: organic});
  const body = draw(0, 40);
  const ins = draw(25, 75);
  const out = draw(60, 100);
  const text = draw(80, 120);
  const fire = interpolate(frame, [fireAt, fireAt + 8, fireAt + 40], [0, 1, 0.35], clamp);
  const fired = frame >= fireAt + 4;
  const inputs = [-0.9, 0, 0.9];
  const ink = palette.ironGall;
  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={ink} strokeWidth={1.2} />
        </marker>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ink} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - body} />
      {inputs.map((k, i) => {
        const y = cy + k * r * 0.75;
        const x0 = cx - r * 3.2;
        const x1 = cx - Math.sqrt(Math.max(0, r * r - (y - cy) ** 2));
        return (
          <g key={i}>
            <path d={`M ${x0} ${y} L ${x1 - 4} ${y}`} stroke={ink} strokeWidth={1.4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ins} markerEnd={ins > 0.95 ? 'url(#arrow)' : undefined} />
            <text x={x0 - 18} y={y + 8} textAnchor="end" style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 30}} fill={ink} opacity={text}>
              x{String.fromCharCode(0x2081 + i)}
            </text>
            <text x={(x0 + x1) / 2} y={y - 12} textAnchor="middle" style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 22}} fill={ink} opacity={text * 0.7}>
              w{String.fromCharCode(0x2081 + i)}
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 12} textAnchor="middle" style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 38}} fill={ink} opacity={text}>
        Σ ≥ θ
      </text>
      <path d={`M ${cx + r} ${cy} L ${cx + r * 3} ${cy}`} stroke={ink} strokeWidth={1.8} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - out} markerEnd={out > 0.95 ? 'url(#arrow)' : undefined} />
      <text x={cx + r * 3 + 22} y={cy + 12} style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 38}} fill={ink} opacity={text}>
        {fired ? '1' : '0'}
      </text>
      <circle cx={cx + r * 3 + 34} cy={cy} r={34 + 18 * fire} fill={palette.golgiAmber} opacity={fire * 0.35} />
    </svg>
  );
};
