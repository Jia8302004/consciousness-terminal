import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, organic, palette} from '../theme';
import {fonts} from '../fonts';

// Closing card: the frame is split — paper on the left, night on the right — and the title sits
// across the seam, so the same characters are half ink and half light. The seam then softens.
export const TitleSplit: React.FC<{title: string; subtitle?: string; subtitleEn?: string}> = ({title, subtitle, subtitleEn}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const seam = interpolate(frame, [0, 40], [width, width / 2], {...clamp, easing: organic});
  const t = interpolate(frame, [20, 60], [0, 1], {...clamp, easing: organic});
  const sub = interpolate(frame, [60, 95], [0, 1], clamp);
  const titleStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: fonts.paperZh,
    fontSize: 150,
    letterSpacing: '0.35em',
    paddingLeft: '0.35em', // optically re-centre tracked text
    opacity: t,
    filter: `blur(${(1 - t) * 6}px)`,
  };
  const leftClip = `inset(0 ${width - seam}px 0 0)`;
  const rightClip = `inset(0 0 0 ${seam}px)`;
  return (
    <AbsoluteFill style={{background: palette.siliconNight}}>
      <AbsoluteFill style={{background: palette.cajalPaper, clipPath: leftClip}} />
      <div style={{...titleStyle, color: palette.ironGall, clipPath: leftClip}}>{title}</div>
      <div style={{...titleStyle, color: palette.phosphor, clipPath: rightClip, textShadow: '0 0 24px rgba(207,243,241,0.7)'}}>{title}</div>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 250, gap: 14, flexDirection: 'column'}}>
        {subtitle ? (
          <div style={{fontFamily: fonts.nightZh, fontSize: 30, letterSpacing: '0.3em', color: 'rgba(233,228,218,0.85)', mixBlendMode: 'difference', opacity: sub}}>{subtitle}</div>
        ) : null}
        {subtitleEn ? (
          <div style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 26, color: 'rgba(233,228,218,0.7)', mixBlendMode: 'difference', opacity: sub}}>{subtitleEn}</div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
