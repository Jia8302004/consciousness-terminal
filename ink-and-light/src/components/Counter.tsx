import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeIn, easeOut, worldColors, type World} from '../theme';
import {fonts} from '../fonts';

const group = (n: number) => Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');

// Accelerating number with a lowercase unit, e.g. model parameters.
export const Counter: React.FC<{world?: World; from: number; to: number; delay?: number; duration: number; unit?: string; size?: number; style?: React.CSSProperties}> = ({
  world = 'night',
  from,
  to,
  delay = 0,
  duration,
  unit,
  size = 58,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const c = worldColors(world);
  const v = interpolate(local, [0, duration], [from, to], {...clamp, easing: easeIn});
  const appear = interpolate(local, [0, 16], [0, 1], {...clamp, easing: easeOut});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, opacity: appear, ...style}}>
      <div style={{fontFamily: world === 'paper' ? fonts.paperNum : fonts.nightNum, fontStyle: world === 'paper' ? 'italic' : 'normal', fontWeight: 300, fontSize: size, color: c.text, fontVariantNumeric: 'tabular-nums'}}>{group(v)}</div>
      {unit ? <div style={{fontFamily: world === 'paper' ? fonts.paperEn : fonts.nightEn, fontStyle: world === 'paper' ? 'italic' : 'normal', fontSize: 15, color: c.faint}}>{unit}</div> : null}
    </div>
  );
};
