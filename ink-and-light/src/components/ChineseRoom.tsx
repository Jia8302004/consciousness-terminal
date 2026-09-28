import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, palette, precise} from '../theme';
import {fonts} from '../fonts';

// Searle's Chinese Room, drawn as a lit box in the frozen night.
// Cards with Chinese questions slide in through the left slot; after the man inside consults
// his rule book (its pages flick), an answer slides out on the right. Everything is illustrative.
const EXCHANGES: [string, string][] = [
  ['你好吗', '很好'],
  ['天冷吗', '很冷'],
  ['你懂吗', '懂'],
];

export const ChineseRoom: React.FC<{cycle?: number; start?: number}> = ({cycle = 70, start = 30}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width * 0.64;
  const cy = height * 0.42;
  const W = 560;
  const H = 360;
  const d = 90; // perspective depth inset
  const L = cx - W / 2;
  const R = cx + W / 2;
  const T = cy - H / 2;
  const B = cy + H / 2;
  const draw = interpolate(frame, [0, 40], [0, 1], {...clamp, easing: easeOut});
  const lightOn = interpolate(frame, [25, 55], [0, 1], clamp);
  const line = palette.frost;

  const local = frame - start;
  const n = Math.max(0, Math.floor(local / cycle));
  const k = local < 0 ? -1 : (local % cycle) / cycle;
  const ex = EXCHANGES[n % EXCHANGES.length];
  const slotY = cy + 20;

  // card in: from far left to the left slot during k in [0, 0.35]
  const inT = interpolate(k, [0, 0.35], [0, 1], {...clamp, easing: precise});
  const inX = interpolate(inT, [0, 1], [L - 360, L - 10]);
  const inVis = k >= 0 && k < 0.42 ? interpolate(k, [0.34, 0.42], [1, 0], clamp) : 0;
  // answer out: from the right slot outward during k in [0.6, 0.95]
  const outT = interpolate(k, [0.6, 0.95], [0, 1], {...clamp, easing: precise});
  const outX = interpolate(outT, [0, 1], [R + 10, R + 300]);
  const outVis = k >= 0.6 ? interpolate(k, [0.6, 0.66, 0.92, 1], [0, 1, 1, 0], clamp) : 0;
  // the rule book pages flick while the man "computes"
  const flick = k > 0.4 && k < 0.6 ? Math.floor(frame / 3) % 3 : 0;

  const Card: React.FC<{x: number; text: string; opacity: number}> = ({x, text, opacity}) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: slotY - 26,
        transform: 'translateX(-50%)',
        padding: '8px 16px',
        background: palette.cajalPaper,
        color: palette.ironGall,
        fontFamily: fonts.paperZh,
        fontSize: 30,
        letterSpacing: '0.12em',
        borderRadius: 2,
        boxShadow: '0 0 18px rgba(207,243,241,0.18)',
        opacity,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );

  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="roomLight" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor={palette.golgiAmber} stopOpacity={0.55} />
            <stop offset="100%" stopColor={palette.golgiAmber} stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* warm light inside the room */}
        <rect x={L + d} y={T + d * 0.6} width={W - 2 * d} height={H - 1.2 * d * 0.6 - 10} fill="url(#roomLight)" opacity={lightOn} />
        <g stroke={line} strokeWidth={1.4} fill="none" opacity={0.85 * draw}>
          {/* front opening and back wall */}
          <rect x={L} y={T} width={W} height={H} strokeDasharray={2 * (W + H)} strokeDashoffset={2 * (W + H) * (1 - draw)} />
          <rect x={L + d} y={T + d * 0.6} width={W - 2 * d} height={H - d * 1.2} opacity={0.7} />
          <line x1={L} y1={T} x2={L + d} y2={T + d * 0.6} />
          <line x1={R} y1={T} x2={R - d} y2={T + d * 0.6} />
          <line x1={L} y1={B} x2={L + d} y2={B - d * 0.6} />
          <line x1={R} y1={B} x2={R - d} y2={B - d * 0.6} />
        </g>
        {/* the two slots */}
        <g stroke={palette.phosphor} strokeWidth={3} opacity={draw}>
          <line x1={L - 2} y1={slotY - 32} x2={L - 2} y2={slotY + 32} />
          <line x1={R + 2} y1={slotY - 32} x2={R + 2} y2={slotY + 32} />
        </g>
        {/* the man and his rule book */}
        <g opacity={lightOn}>
          <circle cx={cx} cy={cy - 30} r={26} fill={palette.siliconNight} />
          <path d={`M ${cx - 60} ${B - d * 0.6} Q ${cx - 56} ${cy + 4} ${cx} ${cy + 2} Q ${cx + 56} ${cy + 4} ${cx + 60} ${B - d * 0.6} Z`} fill={palette.siliconNight} />
          <g transform={`translate(${cx}, ${cy + 58})`}>
            <path d="M -74 0 L -4 -12 L -4 28 L -74 40 Z" fill={palette.cajalPaper} opacity={0.9} />
            <path d="M 74 0 L 4 -12 L 4 28 L 74 40 Z" fill={palette.cajalPaper} opacity={0.9} />
            {[0, 1, 2].map((r) => (
              <g key={r} stroke={palette.ironGall} strokeWidth={1.4} opacity={0.6}>
                <line x1={-64} y1={4 + r * 10 + flick} x2={-14} y2={-4 + r * 10 + flick} />
                <line x1={14} y1={-4 + r * 10 - flick} x2={64} y2={4 + r * 10 - flick} />
              </g>
            ))}
          </g>
        </g>
      </svg>
      {k >= 0 ? <Card x={inX} text={ex[0]} opacity={inVis} /> : null}
      {k >= 0 ? <Card x={outX} text={ex[1]} opacity={outVis} /> : null}
      <div style={{position: 'absolute', left: L - 250, top: slotY + 40, fontFamily: fonts.nightEn, fontSize: 15, color: 'rgba(233,228,218,0.4)', opacity: draw}}>in</div>
      <div style={{position: 'absolute', left: R + 220, top: slotY + 40, fontFamily: fonts.nightEn, fontSize: 15, color: 'rgba(233,228,218,0.4)', opacity: draw}}>out</div>
    </AbsoluteFill>
  );
};
