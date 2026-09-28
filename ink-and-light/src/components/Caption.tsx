import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, organic, easeOut, worldColors, type World} from '../theme';
import {enFont, zhFont} from '../fonts';

// Bilingual caption whose entrance depends on the world:
//  paper -> characters soak in like ink (slow, slight blur, no movement)
//  night -> characters switch on like light (sharper, with a brief glow)
// Use "\n" in zh to break lines deliberately; never let the browser wrap Chinese on its own.
export const Caption: React.FC<{
  world: World;
  zh: string;
  en?: string;
  delay?: number;
  exitAt?: number; // frames after delay; omit to hold until the scene ends
  align?: 'left' | 'center';
  size?: number;
  style?: React.CSSProperties;
}> = ({world, zh, en, delay = 0, exitAt, align = 'left', size, style}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const c = worldColors(world);
  const paper = world === 'paper';
  const zhSize = size ?? (paper ? 50 : 44);
  const stagger = paper ? 3 : 2;
  const lines = zh.split('\n');
  const total = Array.from(zh.replace(/\n/g, '')).length;

  const exit = exitAt === undefined ? 1 : interpolate(local, [exitAt, exitAt + 20], [1, 0], clamp);
  const exitBlur = exitAt === undefined ? 0 : interpolate(local, [exitAt, exitAt + 20], [0, 8], clamp);
  const enT = interpolate(local - (total * stagger + 10), [0, 30], [0, 1], {...clamp, easing: easeOut});

  let idx = 0;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        gap: paper ? 16 : 14,
        opacity: exit,
        filter: `blur(${exitBlur}px)`,
        ...style,
      }}
    >
      <div style={{fontFamily: zhFont(world), fontWeight: paper ? 400 : 300, fontSize: zhSize, letterSpacing: paper ? '0.06em' : '0.08em', lineHeight: 1.4, color: c.text}}>
        {lines.map((line, li) => (
          <div key={li} style={{whiteSpace: 'nowrap'}}>
            {Array.from(line).map((ch) => {
              const i = idx++;
              const p = interpolate(local - i * stagger, [0, paper ? 26 : 16], [0, 1], {...clamp, easing: paper ? organic : easeOut});
              const glow = paper ? 0 : Math.max(0, 1 - Math.abs(p - 0.7) * 3);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    opacity: p,
                    filter: `blur(${(1 - p) * (paper ? 3 : 8)}px)`,
                    textShadow: glow > 0 ? `0 0 ${14 * glow}px rgba(207,243,241,${0.8 * glow})` : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {en ? (
        <div
          style={{
            fontFamily: enFont(world),
            fontStyle: 'italic',
            fontWeight: 300,
            // Chinese leads; English is a quiet italic gloss underneath.
            fontSize: paper ? zhSize * 0.46 : zhSize * 0.45,
            letterSpacing: paper ? '0.01em' : '0.01em',
            color: c.dim,
            opacity: enT,
            filter: `blur(${(1 - enT) * 3}px)`,
            maxWidth: 1100,
          }}
        >
          {en}
        </div>
      ) : null}
    </div>
  );
};
