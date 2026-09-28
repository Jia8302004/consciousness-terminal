import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, worldColors, type World} from '../theme';
import {zhFont} from '../fonts';

// Small chapter marker in the top-left corner, so viewers always know which part of the story they are in.
// Absolute timing (it sits outside the TransitionSeries): visible from `from` for `dur` frames.
export const ChapterLabel: React.FC<{text: string; from: number; dur: number; world: World}> = ({text, from, dur, world}) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  if (local < -5 || local > dur + 30) return null;
  const t = interpolate(local, [0, 25], [0, 1], {...clamp, easing: easeOut}) * interpolate(local, [dur - 10, dur + 15], [1, 0], clamp);
  const c = worldColors(world);
  return (
    <div style={{position: 'absolute', left: 64, top: 50, display: 'flex', alignItems: 'center', gap: 14, opacity: t}}>
      <div style={{width: 36 * t, height: 1.5, background: world === 'paper' ? c.text : 'rgba(207,243,241,0.7)'}} />
      <div style={{fontFamily: zhFont(world), fontWeight: world === 'paper' ? 400 : 300, fontSize: 26, letterSpacing: '0.18em', color: c.dim, whiteSpace: 'nowrap'}}>{text}</div>
    </div>
  );
};
