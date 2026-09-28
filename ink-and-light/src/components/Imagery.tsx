import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeIn, easeOut, organic, palette, precise, worldColors, type World} from '../theme';
import {fonts} from '../fonts';

// Supporting images for the story. Everything here is illustrative and deterministic.

const draw = (frame: number, a: number, b: number, easing = organic) => interpolate(frame, [a, b], [0, 1], {...clamp, easing});
const stroke = (k: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - k});

// ---------------------------------------------------------------------------------------------
// Cold open: a field of stars; slowly the nearest ones join up — the sky becomes a neural net.
export const StarsToNeurons: React.FC<{linkAt?: number; seed?: string}> = ({linkAt = 90, seed = 'stars'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const stars = useMemo(
    () =>
      Array.from({length: 150}, (_, i) => ({
        x: random(`${seed}x${i}`) * width,
        y: random(`${seed}y${i}`) * height,
        r: 0.6 + random(`${seed}r${i}`) ** 3 * 2.6,
        tw: random(`${seed}t${i}`) * 6.28,
      })),
    [seed, width, height],
  );
  const links = useMemo(() => {
    const out: {a: number; b: number; d: number}[] = [];
    stars.forEach((s, i) => {
      const near = stars
        .map((t, j) => ({j, d: Math.hypot(s.x - t.x, s.y - t.y)}))
        .filter((o) => o.j > i && o.d < 150)
        .sort((p, q) => p.d - q.d)
        .slice(0, 2);
      near.forEach((o) => out.push({a: i, b: o.j, d: o.d}));
    });
    return out;
  }, [stars]);
  const zoom = interpolate(frame, [0, 240], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      <svg width={width} height={height}>
        {links.map((l, i) => {
          const k = draw(frame, linkAt + (i % 40) * 2, linkAt + (i % 40) * 2 + 40);
          if (k <= 0) return null;
          const a = stars[l.a];
          const b = stars[l.b];
          const pulse = Math.max(0, Math.sin(frame / 9 + i * 1.3)) ** 12;
          return <path key={i} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={pulse > 0.3 ? palette.golgiAmber : palette.phosphor} strokeWidth={0.8} fill="none" opacity={0.18 + pulse * 0.5} {...stroke(k)} />;
        })}
        {stars.map((s, i) => {
          const on = draw(frame, 5 + (i % 30) * 2, 25 + (i % 30) * 2);
          const tw = 0.55 + 0.45 * Math.sin(frame / 14 + s.tw);
          return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={palette.nightText} opacity={on * tw * 0.8} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Chapter interstitial: a drawn motif, chapter number, title, small italic English.
export type Motif = 'microscope' | 'question' | 'fork' | 'snow' | 'burst';

const motifPaths = (m: Motif): string[] => {
  if (m === 'microscope')
    return [
      'M 55 180 H 150',
      'M 100 180 V 165 M 78 165 H 132',
      'M 118 165 C 158 140 158 88 120 66',
      'M 84 30 L 124 100',
      'M 76 36 L 94 26 M 116 104 L 134 94',
      'M 70 128 H 130',
      'M 100 128 V 142',
    ];
  if (m === 'question') return ['M 66 72 C 66 30 134 30 134 72 C 134 100 100 104 100 132 V 146', 'M 100 168 V 174'];
  if (m === 'fork')
    return [
      'M 18 100 H 80',
      'M 80 100 H 180',
      'M 80 100 C 110 100 118 60 150 52 M 150 52 L 182 40 M 150 52 L 180 66',
      'M 80 100 C 110 100 118 140 150 148 M 150 148 L 182 136 M 150 148 L 180 162',
      'M 116 76 L 138 90 M 116 124 L 138 112',
    ];
  if (m === 'snow') {
    const out: string[] = [];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 - Math.PI / 2;
      const p = (r: number, da = 0) => `${(100 + Math.cos(a + da) * r).toFixed(1)} ${(100 + Math.sin(a + da) * r).toFixed(1)}`;
      out.push(`M 100 100 L ${p(78)}`);
      out.push(`M ${p(40)} L ${p(58, 0.35)} M ${p(40)} L ${p(58, -0.35)}`);
      out.push(`M ${p(60)} L ${p(72, 0.22)} M ${p(60)} L ${p(72, -0.22)}`);
    }
    return out;
  }
  const out: string[] = [];
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const r0 = 22;
    const r1 = k % 2 ? 62 : 88;
    out.push(`M ${(100 + Math.cos(a) * r0).toFixed(1)} ${(100 + Math.sin(a) * r0).toFixed(1)} L ${(100 + Math.cos(a) * r1).toFixed(1)} ${(100 + Math.sin(a) * r1).toFixed(1)}`);
  }
  return out;
};

export const ChapterCard: React.FC<{world: World; num: string; title: string; en: string; motif: Motif}> = ({world, num, title, en, motif}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const c = worldColors(world);
  const paper = world === 'paper';
  const color = paper ? palette.ironGall : motif === 'snow' ? palette.frost : motif === 'burst' ? palette.golgiAmber : palette.phosphor;
  const paths = motifPaths(motif);
  const scale = interpolate(frame, [0, 110], [1, 1.04]);
  const numT = draw(frame, 18, 45, easeOut);
  const lineT = draw(frame, 22, 60, easeOut);
  const titleT = draw(frame, 30, 60, easeOut);
  const enT = draw(frame, 48, 75, easeOut);
  const spin = motif === 'snow' ? frame * 0.15 : motif === 'burst' ? frame * 0.1 : 0;
  const burstPulse = motif === 'burst' ? interpolate(frame, [30, 36, 70], [0, 1, 0.3], clamp) : 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${scale})`}}>
        <svg width={200} height={200} viewBox="0 0 200 200" style={{overflow: 'visible', marginBottom: 36}}>
          {!paper ? <circle cx={100} cy={100} r={90} fill={color} opacity={0.06 + burstPulse * 0.2} /> : null}
          <g transform={`rotate(${spin} 100 100)`} stroke={color} strokeWidth={paper ? 2.2 : 1.6} strokeLinecap="round" fill="none">
            {paths.map((d, i) => (
              <path key={i} d={d} {...stroke(draw(frame, 4 + i * 4, 40 + i * 4))} />
            ))}
          </g>
          {motif === 'burst' ? <circle cx={100} cy={100} r={9} fill={palette.phosphor} opacity={draw(frame, 20, 30)} /> : null}
        </svg>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: numT}}>
          <div style={{width: 90 * lineT, height: 1, background: c.faint}} />
          <div style={{fontFamily: paper ? fonts.paperZh : fonts.nightZh, fontWeight: paper ? 400 : 300, fontSize: 26, letterSpacing: '0.5em', color: c.dim, marginRight: '-0.5em'}}>{num}</div>
          <div style={{width: 90 * lineT, height: 1, background: c.faint}} />
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: paper ? fonts.paperZh : fonts.nightZh,
            fontWeight: paper ? 400 : 300,
            fontSize: 84,
            letterSpacing: '0.12em',
            color: c.text,
            opacity: titleT,
            filter: `blur(${(1 - titleT) * 6}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        <div style={{marginTop: 18, fontFamily: paper ? fonts.paperEn : fonts.nightEn, fontStyle: 'italic', fontWeight: 300, fontSize: 28, color: c.dim, opacity: enT}}>{en}</div>
      </div>
      <div style={{position: 'absolute', width, height, pointerEvents: 'none', background: paper ? 'radial-gradient(ellipse at center, transparent 55%, rgba(43,33,25,0.18) 100%)' : 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Neuron scene: the view down a microscope (dark rim around a lit circle) and a synapse inset.
export const MicroscopeField: React.FC<{cx: number; cy: number; r: number; delay?: number}> = ({cx, cy, r, delay = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = draw(frame, delay, delay + 40);
  const rr = r * (1.25 - 0.25 * t);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle ${rr}px at ${cx}px ${cy}px, transparent 88%, rgba(43,33,25,0.22) 93%, rgba(43,33,25,0.5) 100%)`, opacity: t}} />
      <svg width={width} height={height} style={{position: 'absolute'}}>
        <circle cx={cx} cy={cy} r={rr} fill="none" stroke={palette.ironGall} strokeWidth={2} opacity={0.5 * t} />
        <circle cx={cx} cy={cy} r={rr + 10} fill="none" stroke={palette.ironGall} strokeWidth={0.8} opacity={0.35 * t} />
        {[0, 1, 2, 3].map((k) => {
          const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
          return <line key={k} x1={cx + Math.cos(a) * (rr + 4)} y1={cy + Math.sin(a) * (rr + 4)} x2={cx + Math.cos(a) * (rr + 22)} y2={cy + Math.sin(a) * (rr + 22)} stroke={palette.ironGall} strokeWidth={1} opacity={0.4 * t} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Two terminals face each other across a gap; small signal dots cross the gap.
export const SynapseInset: React.FC<{x: number; y: number; size?: number; delay?: number}> = ({x, y, size = 260, delay = 0}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const t = draw(local, 0, 30);
  const ink = palette.ironGall;
  const s = size / 200;
  const dots = Array.from({length: 7}, (_, i) => {
    const p = ((local * 0.018 + i / 7) % 1 + 1) % 1;
    return {x: 100 + (random(`syn${i}`) - 0.5) * 50, y: 84 + p * 36, a: Math.sin(p * Math.PI)};
  });
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size, opacity: t}}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx={100} cy={100} r={96} fill="rgba(221,211,190,0.6)" stroke={ink} strokeWidth={1.4 / s} />
        <path d="M 30 20 C 60 30 50 70 60 80 C 70 88 130 88 140 80 C 150 70 140 30 170 20" fill="none" stroke={ink} strokeWidth={2 / s} {...stroke(draw(local, 0, 30))} />
        <path d="M 30 180 C 60 170 50 128 64 122 C 80 116 120 116 136 122 C 150 128 140 170 170 180" fill="none" stroke={ink} strokeWidth={2 / s} {...stroke(draw(local, 8, 38))} />
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={72 + k * 14} cy={64 - (k % 2) * 8} r={5} fill="none" stroke={ink} strokeWidth={1} opacity={t * 0.6} />
        ))}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={3} fill={palette.golgiAmber} opacity={local > 30 ? d.a : 0} />
        ))}
      </svg>
      <div style={{position: 'absolute', top: size + 6, width: size, textAlign: 'center', fontFamily: fonts.paperZh, fontSize: 20, color: 'rgba(43,33,25,0.7)', letterSpacing: '0.2em', opacity: t}}>
        突触的缝隙 <span style={{fontFamily: fonts.paperEn, fontStyle: 'italic', letterSpacing: 0}}>· the synaptic gap</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// The imitation game: two closed doors, a judge in front, slips of paper going back and forth.
export const ImitationGame: React.FC<{delay?: number}> = ({delay = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const local = frame - delay;
  const t = draw(local, 0, 40);
  const ink = palette.ironGall;
  const doorW = 150;
  const doorH = 250;
  const top = height * 0.34;
  const doors = [
    {x: width * 0.33, label: 'A', spill: palette.golgiAmber},
    {x: width * 0.67, label: 'B', spill: '#9FC7C4'},
  ];
  const jx = width * 0.5;
  const jy = top + doorH + 10;
  // a slip travels judge -> door -> judge, alternating doors
  const cyc = 60;
  const n = Math.floor(Math.max(0, local - 40) / cyc);
  const k = local < 40 ? -1 : ((local - 40) % cyc) / cyc;
  const door = doors[n % 2];
  const go = k < 0.5 ? k / 0.5 : 1 - (k - 0.5) / 0.5;
  const sx = jx + (door.x - jx) * precise(go);
  const sy = jy - 60 + (top + doorH * 0.55 - (jy - 60)) * precise(go);
  return (
    <AbsoluteFill style={{opacity: t}}>
      <svg width={width} height={height}>
        {doors.map((d, i) => (
          <g key={i}>
            <rect x={d.x - doorW / 2 - 14} y={top - 14} width={doorW + 28} height={doorH + 14} fill="none" stroke={ink} strokeWidth={1.6} {...stroke(draw(local, i * 8, 40 + i * 8))} />
            <rect x={d.x - doorW / 2} y={top} width={doorW} height={doorH} fill="rgba(43,33,25,0.1)" stroke={ink} strokeWidth={1.2} />
            {/* light leaking under the door hints at who (or what) is inside */}
            <rect x={d.x - doorW / 2} y={top + doorH - 2} width={doorW} height={6} fill={d.spill} opacity={0.35 + 0.25 * Math.sin(local / 11 + i * 2)} />
            <circle cx={d.x + doorW / 2 - 22} cy={top + doorH / 2} r={5} fill="none" stroke={ink} strokeWidth={1.4} />
            <rect x={d.x - 30} y={top + doorH * 0.5} width={60} height={8} fill={ink} opacity={0.55} />
            <text x={d.x} y={top - 30} textAnchor="middle" style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 34}} fill={ink}>
              {d.label}
            </text>
          </g>
        ))}
        {/* the judge, seen from behind */}
        <g fill={ink} opacity={0.88}>
          <circle cx={jx} cy={jy - 40} r={26} />
          <path d={`M ${jx - 70} ${jy + 70} Q ${jx - 64} ${jy - 8} ${jx} ${jy - 12} Q ${jx + 64} ${jy - 8} ${jx + 70} ${jy + 70} Z`} />
        </g>
        <text x={jx} y={jy - 90} textAnchor="middle" style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 46}} fill={palette.golgiAmber} opacity={draw(local, 50, 70)}>
          ?
        </text>
        {k >= 0 ? <rect x={sx - 18} y={sy - 12} width={36} height={24} fill="#EDE6D6" stroke={ink} strokeWidth={1} opacity={Math.sin(go * Math.PI) > 0.05 ? 1 : 0} transform={`rotate(${(go - 0.5) * 20} ${sx} ${sy})`} /> : null}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// 1956: the typed title page of the Dartmouth proposal, which sinks into the dark.
export const ProposalPage: React.FC<{text: string; outAt: number}> = ({text, outAt}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const inT = draw(frame, 0, 25, easeOut);
  const out = interpolate(frame, [outAt, outAt + 50], [0, 1], {...clamp, easing: easeIn});
  const shown = Math.floor(interpolate(frame, [8, 8 + text.length * 0.8], [0, text.length], clamp));
  const w = 620;
  const h = 800;
  return (
    <div
      style={{
        position: 'absolute',
        left: width * 0.7 - w / 2,
        top: height * 0.5 - h / 2,
        width: w,
        height: h,
        background: '#E7DFCC',
        boxShadow: '0 20px 60px rgba(43,33,25,0.35)',
        transform: `translateY(${out * 120}px) rotate(${-3 + out * 6}deg) scale(${1 - out * 0.15})`,
        opacity: inT * (1 - out),
        padding: '90px 70px',
        boxSizing: 'border-box',
        fontFamily: '"Courier New", "DejaVu Sans Mono", monospace',
        color: palette.ironGall,
      }}
    >
      <div style={{fontSize: 24, lineHeight: 1.6, letterSpacing: '0.08em', textAlign: 'center'}}>{text.slice(0, shown)}</div>
      <div style={{marginTop: 70, display: 'flex', flexDirection: 'column', gap: 16, opacity: 0.5}}>
        {Array.from({length: 12}, (_, i) => (
          <div key={i} style={{height: 3, width: `${70 + random(`pp${i}`) * 30}%`, background: palette.ironGall, opacity: draw(frame, 20 + i * 2, 30 + i * 2)}} />
        ))}
      </div>
      <div style={{position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center', fontSize: 20, opacity: 0.7}}>August 31, 1955</div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Behaviourism: an operant chamber — the light comes on, the lever is pressed, a pellet drops.
export const SkinnerBox: React.FC<{x: number; y: number; dim?: number}> = ({x, y, dim = 1}) => {
  const frame = useCurrentFrame();
  const t = draw(frame, 5, 45);
  const cyc = 42;
  const p = (frame % cyc) / cyc;
  const light = p < 0.3 ? 1 : 0.15;
  const press = interpolate(p, [0.25, 0.35, 0.5], [0, 1, 0], clamp);
  const pellet = interpolate(p, [0.4, 0.62], [0, 1], clamp);
  const line = palette.frost;
  const W = 440;
  const H = 300;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: t * dim}}>
      <svg width={W + 40} height={H + 110} style={{overflow: 'visible'}}>
        <rect x={0} y={0} width={W} height={H} fill="none" stroke={line} strokeWidth={1.6} {...stroke(t)} />
        <line x1={0} y1={H - 30} x2={W} y2={H - 30} stroke={line} strokeWidth={1} opacity={0.5} />
        {/* light */}
        <circle cx={W - 90} cy={50} r={36} fill={palette.golgiAmber} opacity={light * 0.25} />
        <circle cx={W - 90} cy={50} r={13} fill={light > 0.5 ? palette.golgiAmber : 'none'} stroke={palette.golgiAmber} strokeWidth={1.4} />
        <text x={W - 90} y={105} textAnchor="middle" style={{fontFamily: fonts.nightZh, fontSize: 20}} fill={palette.frost} opacity={0.8}>
          刺激
        </text>
        {/* lever */}
        <rect x={W - 40} y={H - 120} width={40} height={10} fill={line} opacity={0.6} />
        <line x1={W - 40} y1={H - 115} x2={W - 90} y2={H - 115 + press * 18} stroke={palette.phosphor} strokeWidth={5} strokeLinecap="round" />
        {/* food tray and pellet */}
        <rect x={W - 150} y={H - 44} width={50} height={14} fill="none" stroke={line} strokeWidth={1.2} />
        <circle cx={W - 125} cy={H - 140 + pellet * 94} r={5} fill={palette.golgiAmber} opacity={pellet > 0 && pellet < 1 ? 1 : pellet >= 1 ? 0.6 : 0} />
        <text x={W - 125} y={H + 36} textAnchor="middle" style={{fontFamily: fonts.nightZh, fontSize: 20}} fill={palette.frost} opacity={0.8}>
          奖励
        </text>
        {/* the rat */}
        <g transform={`translate(${W - 190 + press * 14}, ${H - 58})`} fill={palette.nightText} opacity={0.85}>
          <ellipse cx={0} cy={0} rx={46} ry={24} />
          <ellipse cx={46} cy={-10} rx={20} ry={14} />
          <circle cx={48} cy={-24} r={7} />
          <path d="M -44 6 C -80 10 -100 -6 -130 4" stroke={palette.nightText} strokeWidth={3} fill="none" />
        </g>
        <text x={W - 70} y={H - 132} textAnchor="middle" style={{fontFamily: fonts.nightZh, fontSize: 20}} fill={palette.frost} opacity={0.8}>
          反应
        </text>
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Hubel & Wiesel: the electrode's audio trace — spikes when the bar hits the cell's preference.
export const ElectrodeTrace: React.FC<{x: number; y: number; w?: number; h?: number; pref?: number; until?: number}> = ({x, y, w = 560, h = 90, pref = Math.PI / 2, until = 99999}) => {
  const frame = useCurrentFrame();
  const t = draw(frame, 10, 40) * (1 - interpolate(frame, [until - 10, until + 30], [0, 1], clamp));
  const N = 140; // samples across the trace = the last N frames
  const pts: string[] = [];
  let spiking = 0;
  for (let i = 0; i < N; i++) {
    const f = frame - (N - 1 - i);
    const theta = (Math.sin(f / 38) * 0.5 + 0.5) * Math.PI;
    let d = Math.abs(pref - theta);
    d = Math.min(d, Math.PI - d);
    const rate = Math.exp(-(d * d) / 0.05);
    const spike = f >= 0 && random(`sp${f}`) < rate * 0.7 ? 1 : 0;
    if (i === N - 1) spiking = rate;
    const noise = (random(`nz${f}`) - 0.5) * 0.12;
    const v = spike ? -0.95 : noise;
    pts.push(`${((i / (N - 1)) * w).toFixed(1)},${(h / 2 + v * (h / 2)).toFixed(1)}`);
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: t}}>
      <svg width={w} height={h} style={{overflow: 'visible'}}>
        <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="rgba(207,243,241,0.12)" />
        <polyline points={pts.join(' ')} fill="none" stroke={palette.golgiAmber} strokeWidth={1.4} opacity={0.9} />
        <circle cx={w + 16} cy={h / 2} r={6} fill={palette.golgiAmber} opacity={0.3 + spiking * 0.7} />
      </svg>
      <div style={{fontFamily: fonts.nightEn, fontSize: 15, color: 'rgba(233,228,218,0.45)', marginTop: 6}}>electrode · one cell in the visual cortex</div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// 1958: the perceptron — a 20x20 grid of photocells lights up in the shape of a letter,
// wires carry the signal to a row of lamps. Warm, hopeful.
const LETTER = ['..####..', '.##..##.', '##....##', '##....##', '########', '##....##', '##....##', '##....##'];
export const PerceptronMachine: React.FC<{x: number; y: number}> = ({x, y}) => {
  const frame = useCurrentFrame();
  const n = 20;
  const cell = 22;
  const size = n * cell;
  const on = (i: number, j: number) => {
    const r = Math.floor((j - 5) / 1.25);
    const c = Math.floor((i - 5) / 1.25);
    return r >= 0 && r < 8 && c >= 0 && c < 8 && LETTER[r][c] === '#';
  };
  const scan = interpolate(frame, [30, 110], [0, 1], clamp);
  const lamps = 6;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: draw(frame, 0, 30)}}>
      <svg width={size + 420} height={size + 40} style={{overflow: 'visible'}}>
        <rect x={-14} y={-14} width={size + 28} height={size + 28} fill="none" stroke={palette.golgiAmber} strokeWidth={1.2} opacity={0.5} />
        {Array.from({length: n * n}, (_, k) => {
          const i = k % n;
          const j = Math.floor(k / n);
          const lit = on(i, j) && j / n < scan;
          const fl = lit ? 0.75 + 0.25 * Math.sin(frame / 5 + k) : 0;
          return <circle key={k} cx={i * cell + cell / 2} cy={j * cell + cell / 2} r={lit ? 7 : 4} fill={lit ? palette.golgiAmber : 'rgba(233,228,218,0.14)'} opacity={lit ? fl : 1} />;
        })}
        {Array.from({length: 14}, (_, k) => {
          const y0 = (k + 0.5) * (size / 14);
          const ly = size * 0.2 + (k % lamps) * (size * 0.12);
          const flow = ((frame * 0.03 + k * 0.17) % 1 + 1) % 1;
          return (
            <g key={k}>
              <path d={`M ${size + 20} ${y0} C ${size + 150} ${y0} ${size + 200} ${ly} ${size + 320} ${ly}`} fill="none" stroke={palette.golgiAmber} strokeWidth={0.8} opacity={0.25 * scan} />
              <circle cx={size + 20 + flow * 300} cy={y0 + (ly - y0) * precise(flow)} r={2.2} fill={palette.golgiAmber} opacity={scan * 0.8} />
            </g>
          );
        })}
        {Array.from({length: lamps}, (_, k) => {
          const ly = size * 0.2 + k * (size * 0.12);
          const lit = scan > 0.95 && (k === 1 || frame % 40 < 20 === (k % 2 === 0));
          return (
            <g key={k}>
              <circle cx={size + 340} cy={ly} r={26} fill={palette.golgiAmber} opacity={lit ? 0.25 : 0} />
              <circle cx={size + 340} cy={ly} r={10} fill={lit ? palette.golgiAmber : 'none'} stroke={palette.golgiAmber} strokeWidth={1.2} />
            </g>
          );
        })}
      </svg>
      <div style={{fontFamily: fonts.nightEn, fontSize: 15, color: 'rgba(233,228,218,0.45)', marginTop: 10}}>400 photocells → adjustable weights → output lamps  (illustrative)</div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// 1969: XOR on a plane. A single straight line swings around trying to separate the two
// classes and always gets one wrong; then a red cross.
export const XORPlane: React.FC<{cx: number; cy: number; size?: number; failAt?: number; solved?: number; delay?: number}> = ({cx, cy, size = 380, failAt = 150, solved = 0, delay = 0}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const t = draw(local, 0, 30);
  const half = size / 2;
  const P = (u: number, v: number) => ({x: cx - half * 0.6 + u * half * 1.2, y: cy + half * 0.6 - v * half * 1.2});
  const pts = [
    {u: 0, v: 0, c: 0},
    {u: 1, v: 1, c: 0},
    {u: 0, v: 1, c: 1},
    {u: 1, v: 0, c: 1},
  ];
  // the line: through a point that wanders, at an angle that swings
  const trying = solved > 0 ? 0 : interpolate(local, [30, 45, failAt - 10, failAt], [0, 1, 1, 0.35], clamp);
  const ang = local * 0.045;
  const ox = cx + Math.sin(local * 0.031) * half * 0.25;
  const oy = cy + Math.cos(local * 0.027) * half * 0.25;
  const L = half * 1.1;
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  const side = (x: number, y: number) => ((x - ox) * nx + (y - oy) * ny > 0 ? 1 : 0);
  const cross = interpolate(local, [failAt, failAt + 12], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{position: 'absolute', inset: 0, opacity: t}}>
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <rect x={cx - half} y={cy - half} width={size} height={size} fill="rgba(207,243,241,0.03)" stroke="rgba(207,243,241,0.3)" strokeWidth={1} />
        {solved > 0 ? (
          <g opacity={solved}>
            {/* a curved band along the diagonal: the two classes are separated */}
            <path
              d={`M ${P(-0.15, 0.25).x} ${P(-0.15, 0.25).y} C ${P(0.3, 0.55).x} ${P(0.3, 0.55).y} ${P(0.45, 0.75).x} ${P(0.45, 0.75).y} ${P(0.75, 1.15).x} ${P(0.75, 1.15).y} L ${P(1.15, 0.75).x} ${P(1.15, 0.75).y} C ${P(0.75, 0.45).x} ${P(0.75, 0.45).y} ${P(0.55, 0.3).x} ${P(0.55, 0.3).y} ${P(0.25, -0.15).x} ${P(0.25, -0.15).y} Z`}
              fill={palette.phosphor}
              opacity={0.12}
              stroke={palette.phosphor}
              strokeWidth={1.6}
            />
          </g>
        ) : null}
        {trying > 0 ? <line x1={ox - Math.cos(ang) * L} y1={oy - Math.sin(ang) * L} x2={ox + Math.cos(ang) * L} y2={oy + Math.sin(ang) * L} stroke={palette.nightText} strokeWidth={2} opacity={trying * 0.8} /> : null}
        {pts.map((p, i) => {
          const q = P(p.u, p.v);
          // with a straight line, points on the "wrong" side flash red
          const wrong = trying > 0.5 && pts.some((o) => o.c === p.c && side(P(o.u, o.v).x, P(o.u, o.v).y) !== side(q.x, q.y));
          const col = p.c ? palette.golgiAmber : palette.phosphor;
          return (
            <g key={i}>
              {wrong ? <circle cx={q.x} cy={q.y} r={30} fill="none" stroke="#D2544A" strokeWidth={2} opacity={0.8} /> : null}
              {p.c ? <circle cx={q.x} cy={q.y} r={16} fill={col} /> : <circle cx={q.x} cy={q.y} r={15} fill="none" stroke={col} strokeWidth={3} />}
              <text x={q.x} y={q.y + (p.v ? -34 : 50)} textAnchor="middle" style={{fontFamily: fonts.nightEn, fontSize: 18}} fill="rgba(233,228,218,0.5)">
                ({p.u},{p.v})
              </text>
            </g>
          );
        })}
        {cross > 0 && solved === 0 ? (
          <g stroke="#D2544A" strokeWidth={10} strokeLinecap="round" opacity={0.9}>
            <line x1={cx - half * 0.5} y1={cy - half * 0.5} x2={cx - half * 0.5 + half * cross} y2={cy - half * 0.5 + half * cross} />
            <line x1={cx + half * 0.5} y1={cy - half * 0.5} x2={cx + half * 0.5 - half * cross} y2={cy - half * 0.5 + half * cross} />
          </g>
        ) : null}
      </svg>
      <div style={{position: 'absolute', left: cx - half, top: cy + half + 16, width: size, textAlign: 'center', fontFamily: fonts.nightEn, fontSize: 18, color: 'rgba(233,228,218,0.55)'}}>
        XOR · 异或 {solved > 0 ? '— separated' : '— one straight line cannot split it'}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Snow drifting through the winter scenes.
export const Snow: React.FC<{from?: number; count?: number; seed?: string; opacity?: number}> = ({from = 0, count = 140, seed = 'snow', opacity = 1}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const flakes = useMemo(
    () =>
      Array.from({length: count}, (_, i) => ({
        x: random(`${seed}x${i}`) * width,
        y0: random(`${seed}y${i}`) * height,
        v: 0.8 + random(`${seed}v${i}`) * 1.8,
        r: 1 + random(`${seed}r${i}`) * 2.4,
        ph: random(`${seed}p${i}`) * 6.28,
      })),
    [count, seed, width, height],
  );
  const t = interpolate(frame, [from, from + 45], [0, 1], clamp) * opacity;
  if (t <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: t, pointerEvents: 'none'}}>
      <svg width={width} height={height}>
        {flakes.map((f, i) => {
          const y = (f.y0 + frame * f.v) % (height + 20);
          const x = f.x + Math.sin(frame / 40 + f.ph) * 24;
          return <circle key={i} cx={x} cy={y - 10} r={f.r} fill="#DCE8F2" opacity={0.25 + f.r * 0.15} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// 1986: the ice cracks from the centre, then shatters outward in shards.
export const IceShatter: React.FC<{crackAt: number; at: number; seed?: string}> = ({crackAt, at, seed = 'ice'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width * 0.5;
  const cy = height * 0.45;
  const cracks = useMemo(
    () =>
      Array.from({length: 11}, (_, i) => {
        let a = (i / 11) * Math.PI * 2 + random(`${seed}a${i}`) * 0.4;
        let x = cx;
        let y = cy;
        const pts = [`M ${x} ${y}`];
        const steps = 7;
        for (let s = 0; s < steps; s++) {
          a += (random(`${seed}j${i}-${s}`) - 0.5) * 0.7;
          const len = 60 + random(`${seed}l${i}-${s}`) * 120;
          x += Math.cos(a) * len;
          y += Math.sin(a) * len;
          pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
        }
        return pts.join(' ');
      }),
    [cx, cy, seed],
  );
  const shards = useMemo(
    () =>
      Array.from({length: 70}, (_, i) => {
        const a = random(`${seed}sa${i}`) * Math.PI * 2;
        const d = 60 + random(`${seed}sd${i}`) * Math.max(width, height) * 0.55;
        const s = 20 + random(`${seed}ss${i}`) * 70;
        const p = [0, 1, 2].map((k) => {
          const aa = (k / 3) * Math.PI * 2 + random(`${seed}sp${i}${k}`) * 1.4;
          return `${(Math.cos(aa) * s).toFixed(1)},${(Math.sin(aa) * s).toFixed(1)}`;
        });
        return {x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, a, p: p.join(' '), spin: (random(`${seed}r${i}`) - 0.5) * 720, v: 0.7 + random(`${seed}v${i}`) * 0.8};
      }),
    [cx, cy, seed, width, height],
  );
  const crack = draw(frame, crackAt, at, easeIn);
  const burst = interpolate(frame, [at, at + 45], [0, 1], {...clamp, easing: easeOut});
  const pane = frame < at ? interpolate(frame, [0, 20], [0, 1], clamp) : 0;
  const glow = interpolate(frame, [at - 4, at + 2, at + 50], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={width} height={height}>
        {/* the pane of ice over the frozen network */}
        <rect x={0} y={0} width={width} height={height} fill="rgba(142,163,184,0.10)" opacity={pane} />
        <g stroke="rgba(230,240,248,0.85)" strokeWidth={1.6} fill="none" opacity={frame < at ? 1 : 0}>
          {cracks.map((d, i) => (
            <path key={i} d={d} {...stroke(crack)} />
          ))}
        </g>
        {frame >= at
          ? shards.map((s, i) => {
              const k = burst * s.v;
              const x = s.x + Math.cos(s.a) * k * 600;
              const y = s.y + Math.sin(s.a) * k * 600 + k * k * 200;
              return <polygon key={i} points={s.p} transform={`translate(${x} ${y}) rotate(${s.spin * k})`} fill="rgba(200,220,236,0.16)" stroke="rgba(230,240,248,0.7)" strokeWidth={1} opacity={1 - burst} />;
            })
          : null}
        <circle cx={cx} cy={cy} r={60 + 900 * burst} fill="none" stroke={palette.golgiAmber} strokeWidth={3} opacity={glow * 0.8} />
      </svg>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, rgba(211,154,58,${0.55 * glow}) 0%, transparent 60%)`}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// 2012: the ImageNet error rates as two bars.
export const ErrorBars: React.FC<{x: number; y: number; delay?: number}> = ({x, y, delay = 0}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const rows = [
    {label: '第二名  runner-up', v: 26.2, col: palette.frost},
    {label: 'AlexNet', v: 15.3, col: palette.golgiAmber},
  ];
  const scale = 18; // px per percentage point
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: draw(local, 0, 20)}}>
      <div style={{fontFamily: fonts.nightEn, fontSize: 16, color: 'rgba(233,228,218,0.5)', marginBottom: 14}}>ImageNet 2012 · top-5 error</div>
      {rows.map((r, i) => {
        const k = draw(local, 10 + i * 25, 55 + i * 25, precise);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14}}>
            <div style={{width: 190, fontFamily: fonts.nightEn, fontSize: 18, color: 'rgba(233,228,218,0.75)', textAlign: 'right'}}>{r.label}</div>
            <div style={{width: r.v * scale * k, height: 24, background: r.col, opacity: 0.85, boxShadow: i ? `0 0 18px ${palette.golgiAmber}` : undefined}} />
            <div style={{fontFamily: fonts.nightNum, fontSize: 22, color: r.col, opacity: k}}>{(r.v * k).toFixed(1)}%</div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// 2022: an illustrative chat window. The question from 1950 is typed in; the answer appears.
export const ChatWindow: React.FC<{q: string; a: string; delay?: number; y: number}> = ({q, a, delay = 0, y}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const local = frame - delay;
  const t = draw(local, 0, 20, easeOut);
  const qn = Math.floor(interpolate(local, [15, 15 + Array.from(q).length * 3], [0, Array.from(q).length], clamp));
  const aStart = 15 + Array.from(q).length * 3 + 20;
  const an = Math.floor(interpolate(local, [aStart, aStart + Array.from(a).length * 2.2], [0, Array.from(a).length], clamp));
  const W = 860;
  const thinking = local > aStart - 18 && local < aStart;
  return (
    <div
      style={{
        position: 'absolute',
        left: width / 2 - W / 2,
        top: y,
        width: W,
        padding: '26px 32px',
        boxSizing: 'border-box',
        border: '1px solid rgba(207,243,241,0.3)',
        borderRadius: 16,
        background: 'rgba(12,18,30,0.85)',
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        boxShadow: '0 0 60px rgba(207,243,241,0.08)',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <div style={{padding: '10px 20px', borderRadius: 12, background: 'rgba(207,243,241,0.12)', fontFamily: fonts.nightZh, fontWeight: 400, fontSize: 30, color: palette.nightText, minHeight: 42}}>
          {Array.from(q).slice(0, qn).join('')}
        </div>
      </div>
      <div style={{marginTop: 20, display: 'flex', gap: 16, alignItems: 'flex-start', opacity: local > aStart - 20 ? 1 : 0}}>
        <div style={{width: 16, height: 16, marginTop: 12, borderRadius: '50%', background: palette.golgiAmber, boxShadow: `0 0 14px ${palette.golgiAmber}`, opacity: thinking ? 0.4 + 0.6 * Math.abs(Math.sin(local / 5)) : 1}} />
        <div style={{fontFamily: fonts.nightZh, fontWeight: 300, fontSize: 30, color: palette.nightText, lineHeight: 1.5}}>
          {Array.from(a).slice(0, an).join('')}
          <span style={{opacity: Math.floor(local / 12) % 2 ? 0 : 0.7}}>▍</span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// A single point of light: opens the film and closes it.
export const LonePoint: React.FC<{x: number; y: number; opacity: number; size?: number}> = ({x, y, opacity, size = 120}) => (
  <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${palette.phosphor} 0%, rgba(211,154,58,0.6) 12%, transparent 60%)`, opacity}} />
);
