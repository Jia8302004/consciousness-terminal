import React, {useMemo} from 'react';
import {AbsoluteFill, random, useVideoConfig} from 'remotion';
import {sb} from './storyboard';
import {palette} from './theme';
import {fonts} from './fonts';
import {PaperGround} from './components/PaperGround';
import {InkNeuron} from './components/InkNeuron';
import {NeuralDust} from './components/NeuralDust';

// Vertical cover (1080x1920). The same neuron crosses a torn edge: above, iron-gall ink on old
// paper; below, the paper is gone and the cell glows in the night. Everything that matters sits in
// the central 3:4 band (y 240..1680) so the Douyin profile-grid crop keeps it.
const SEAM = 760;

export const Cover: React.FC = () => {
  const {width, height} = useVideoConfig();
  const neuron = {cx: width * 0.5, cy: SEAM, scale: 1.3};

  // torn paper edge: a jagged line with a gentle slope, fibres sticking out here and there
  const edge = useMemo(() => {
    const pts: [number, number][] = [];
    const N = 90;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * width;
      const base = SEAM - 30 + (i / N) * 60 + Math.sin(i * 0.23) * 14;
      const jag = (random(`tear${i}`) - 0.5) * 22 + (random(`tearb${i}`) > 0.86 ? 16 : 0);
      pts.push([x, base + jag]);
    }
    return pts;
  }, [width]);
  const clip = `polygon(0px 0px, ${width}px 0px, ${edge
    .slice()
    .reverse()
    .map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`)
    .join(', ')})`;
  const edgeLine = edge.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <AbsoluteFill style={{background: palette.siliconNight}}>
      {/* ---- night ---- */}
      <AbsoluteFill style={{opacity: 0.55}}>
        <NeuralDust seed="cover" rate={1} count={220} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 40% at 50% ${SEAM + 60}px, rgba(211,154,58,0.22) 0%, transparent 70%)`}} />
      <InkNeuron seed="cajal" {...neuron} delay={-999} lit={1} pulses={1.4} />
      {/* scrim so the title reads over the glowing axon */}
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, transparent 52%, rgba(7,11,20,0.7) 62%, rgba(7,11,20,0.82) 80%, rgba(7,11,20,0.95) 100%)'}} />

      {/* ---- paper, torn off at the cell body ---- */}
      <AbsoluteFill style={{clipPath: clip}}>
        <PaperGround />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 70% at 50% 40%, transparent 55%, rgba(43,33,25,0.28) 100%)'}} />
        <InkNeuron seed="cajal" {...neuron} delay={-999} />
      </AbsoluteFill>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <polyline points={edgeLine} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={14} transform="translate(0 8)" style={{filter: 'blur(6px)'}} />
        <polyline points={edgeLine} fill="none" stroke="#EFE7D4" strokeWidth={3} opacity={0.9} />
        <polyline points={edgeLine} fill="none" stroke={palette.golgiAmber} strokeWidth={1.2} opacity={0.6} transform="translate(0 3)" />
      </svg>

      {/* paper text */}
      <div style={{position: 'absolute', top: 92, width, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
          <div style={{width: 120, height: 1.5, background: 'rgba(43,33,25,0.5)'}} />
          <div style={{fontFamily: fonts.paperZh, fontSize: 58, letterSpacing: '0.32em', marginRight: '-0.32em', color: palette.ironGall}}>{sb.cover.kicker}</div>
          <div style={{width: 120, height: 1.5, background: 'rgba(43,33,25,0.5)'}} />
        </div>
        <div style={{marginTop: 14, fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 30, color: 'rgba(43,33,25,0.62)'}}>{sb.cover.kickerEn}</div>
      </div>
      <div style={{position: 'absolute', left: 70, top: 600, fontFamily: fonts.paperZh, fontSize: 24, letterSpacing: '0.3em', color: 'rgba(43,33,25,0.7)'}}>
        {sb.cover.plate}
        <div style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 20, letterSpacing: 0, marginTop: 4, color: 'rgba(43,33,25,0.55)'}}>after S. Ramón y Cajal</div>
      </div>
      <div style={{position: 'absolute', right: 70, top: 600, fontFamily: fonts.paperNum, fontStyle: 'italic', fontSize: 52, color: 'rgba(43,33,25,0.8)'}}>1888</div>
      <div style={{position: 'absolute', right: 70, top: SEAM + 70, fontFamily: fonts.nightNum, fontWeight: 300, fontSize: 48, color: palette.phosphor, opacity: 0.85}}>2022</div>

      {/* night text */}
      <div style={{position: 'absolute', top: 1030, width, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            fontFamily: fonts.nightZh,
            fontWeight: 400,
            fontSize: 162,
            lineHeight: 1.12,
            letterSpacing: '0.06em',
            color: '#F4EFE6',
            textAlign: 'center',
            textShadow: '0 0 30px rgba(207,243,241,0.45), 0 0 80px rgba(211,154,58,0.3), 0 4px 24px rgba(0,0,0,0.8)',
          }}
        >
          <div style={{transform: 'translateX(-80px)'}}>{sb.cover.title1}</div>
          <div>
            能思考<span style={{color: palette.golgiAmber, textShadow: '0 0 40px rgba(211,154,58,0.8), 0 4px 24px rgba(0,0,0,0.8)'}}>吗？</span>
          </div>
        </div>
        <div style={{marginTop: 34, width: 640, height: 1, background: 'linear-gradient(to right, transparent, rgba(207,243,241,0.6), transparent)'}} />
        <div style={{marginTop: 28, fontFamily: fonts.nightZh, fontWeight: 300, fontSize: 44, letterSpacing: '0.1em', color: palette.nightText}}>{sb.cover.sub}</div>
        <div style={{marginTop: 14, fontFamily: fonts.nightEn, fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: 'rgba(233,228,218,0.6)'}}>{sb.cover.subEn}</div>
        <div style={{marginTop: 34, padding: '12px 30px', border: '1px solid rgba(207,243,241,0.35)', borderRadius: 40, fontFamily: fonts.nightZh, fontWeight: 300, fontSize: 28, letterSpacing: '0.12em', color: 'rgba(207,243,241,0.85)'}}>
          {sb.cover.path}
        </div>
      </div>
    </AbsoluteFill>
  );
};
