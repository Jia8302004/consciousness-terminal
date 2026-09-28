import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeIn, palette} from '../theme';
import {fonts} from '../fonts';

// The climax. Words from the film float on a ring. One word at a time "looks at" all the others:
// arcs whose brightness is its attention weight. The looking accelerates until every word attends
// to every other at once and the ring fills with light (cut to a Flash at `allAt + ~40`).
export const AttentionField: React.FC<{tokens: string[]; allAt?: number; seed?: string}> = ({tokens, allAt = 230, seed = 'attn'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.585;
  const rx = width * 0.34;
  const ry = height * 0.27;
  const n = tokens.length;
  const pos = useMemo(() => tokens.map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, a};
  }), [tokens, n, cx, cy, rx, ry]);
  // attention weights: softmax over random logits, fixed per (query, key)
  const weights = useMemo(
    () =>
      tokens.map((_, q) => {
        const logits = tokens.map((__, k) => (k === q ? -9 : random(`${seed}-${q}-${k}`) * 4));
        const m = Math.max(...logits);
        const ex = logits.map((l) => Math.exp(l - m));
        const s = ex.reduce((a, b) => a + b, 0);
        return ex.map((e) => e / s);
      }),
    [tokens, seed],
  );

  // accelerating query sweep: position along tokens grows ~quadratically
  const sweep = interpolate(frame, [20, allAt], [0, n * 3.5], {...clamp, easing: easeIn});
  const q = Math.floor(sweep) % n;
  const qFrac = sweep - Math.floor(sweep);
  const all = interpolate(frame, [allAt, allAt + 40], [0, 1], clamp);
  const appear = interpolate(frame, [0, 30], [0, 1], clamp);

  const arc = (a: {x: number; y: number}, b: {x: number; y: number}) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const pull = 0.55; // bend the arc toward the centre
    return `M ${a.x} ${a.y} Q ${mx + (cx - mx) * pull} ${my + (cy - my) * pull} ${b.x} ${b.y}`;
  };

  // widen > 1 draws a faint halo copy (a glow without SVG blur filters)
  const arcs = (widen: number) => {
  const out: React.ReactNode[] = [];
  if (frame >= 20) {
    const queries = all > 0 ? tokens.map((_, i) => i) : [q];
    queries.forEach((qi) => {
      weights[qi].forEach((w, k) => {
        if (k === qi) return;
        const strength = all > 0 ? w * all * 1.4 : w * Math.sin(Math.min(1, qFrac * 1.2) * Math.PI);
        if (strength < 0.02) return;
        const color = interpolateColors(Math.min(1, w * 3), [0, 1], [palette.phosphor, palette.golgiAmber]);
        out.push(<path key={`${qi}-${k}`} d={arc(pos[qi], pos[k])} fill="none" stroke={color} strokeWidth={(0.6 + w * 7) * widen} opacity={Math.min(0.9, strength * 2.2)} />);
      });
    });
  }
  return out;
  };

  const core = interpolate(frame, [allAt - 30, allAt + 50], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: appear}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 26% at 50% 58.5%, rgba(207,243,241,${0.35 * core}), transparent 70%)`, backgroundPosition: 'center'}} />
      <svg width={width} height={height}>
        <g opacity={0.12}>{arcs(5)}</g>
        <g>{arcs(1)}</g>
      </svg>
      {tokens.map((t, i) => {
        const active = all > 0 || i === q;
        const cjk = /[\u3400-\u9fff]/.test(t);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos[i].x,
              top: pos[i].y,
              transform: 'translate(-50%, -50%)',
              fontFamily: cjk ? fonts.nightZh : fonts.nightEn,
              fontSize: cjk ? 30 : 24,
              color: active ? palette.nightText : 'rgba(233,228,218,0.5)',
              textShadow: active ? '0 0 16px rgba(207,243,241,0.8)' : undefined,
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
