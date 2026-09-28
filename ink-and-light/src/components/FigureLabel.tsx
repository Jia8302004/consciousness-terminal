import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, easeOut, worldColors, type World} from '../theme';
import {fonts} from '../fonts';

// Who/when goes here, small — never in the main caption.
// paper: a plate caption ("图一　神经元" + italic credit), like a figure in an old atlas.
// night: a lowercase code-comment style credit ("// hubel & wiesel, 1959").
export const FigureLabel: React.FC<{world: World; zh?: string; credit: string; delay?: number; align?: 'left' | 'center' | 'right'; style?: React.CSSProperties}> = ({
  world,
  zh,
  credit,
  delay = 0,
  align = 'center',
  style,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 30], [0, 1], {...clamp, easing: easeOut});
  const c = worldColors(world);
  if (world === 'paper') {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', gap: 6, opacity: t, ...style}}>
        {zh ? <div style={{fontFamily: fonts.paperZh, fontSize: 22, color: c.text, letterSpacing: '0.3em'}}>{zh}</div> : null}
        <div style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 19, color: c.dim}}>{credit}</div>
      </div>
    );
  }
  return (
    <div style={{fontFamily: fonts.nightEn, fontSize: 17, color: c.faint, opacity: t, textAlign: align, whiteSpace: 'nowrap', ...style}}>
      {'// '}
      {credit}
      {zh ? `  ${zh}` : ''}
    </div>
  );
};
