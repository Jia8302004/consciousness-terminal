import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOut, palette, precise} from '../theme';
import {fonts} from '../fonts';

// The behaviourism debate as an image.
//  Left: a mechanical grid of "刺激 → 反应" pairs blinking in lock-step (the stimulus–response view).
//  Right: loose characters drift in the dark; at `assembleAt` some of them fly into a sentence
//  nobody ever taught — the productivity of language. The rest keep drifting.
export const NovelSentence: React.FC<{sentence: string; gloss?: string; assembleAt?: number; seed?: string}> = ({sentence, gloss, assembleAt = 135, seed = 'novel'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // the mechanical side dims out as the sentence appears
  const mech = interpolate(frame, [10, 40], [0, 1], clamp) * interpolate(frame, [assembleAt - 20, assembleAt + 30], [1, 0.18], clamp);
  const pairs = 6;

  const chars = Array.from(sentence);
  const pool = '天水风我你他走看说花猫月亮借了把的是在小大有光夜山雨书门叫跑飞梦';
  const floaters = useMemo(
    () =>
      // jittered grid (7 x 5 cells) so characters never pile on top of each other;
      // cells are dealt out in a scrambled order so the sentence's characters start far apart
      Array.from({length: 35}, (_, i) => {
        const cell = (i * 17) % 35;
        const col = cell % 7;
        const row = Math.floor(cell / 7);
        return {
        ch: i < chars.length ? chars[i] : pool[Math.floor(random(`${seed}c${i}`) * pool.length)],
        x: width * (0.52 + (col + 0.2 + random(`${seed}x${i}`) * 0.6) * (0.4 / 7)),
        y: height * (0.16 + (row + 0.2 + random(`${seed}y${i}`) * 0.6) * (0.6 / 5)),
        vx: (random(`${seed}vx${i}`) - 0.5) * 0.12,
        vy: (random(`${seed}vy${i}`) - 0.5) * 0.1,
        size: 26 + random(`${seed}s${i}`) * 18,
        a: 0.18 + random(`${seed}a${i}`) * 0.3,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sentence, seed, width, height],
  );

  const slot = 74;
  const sx0 = width * 0.73 - ((chars.length - 1) * slot) / 2;
  const sy = height * 0.48;

  return (
    <AbsoluteFill>
      {/* stimulus -> response, stamped out like a machine */}
      <div style={{position: 'absolute', left: width * 0.1, top: height * 0.2, opacity: mech}}>
        {Array.from({length: pairs}, (_, i) => {
          const beat = Math.floor(frame / 18) % pairs === i;
          return (
            <div key={i} style={{fontFamily: fonts.nightZh, fontWeight: 300, fontSize: 30, color: beat ? palette.phosphor : palette.frost, opacity: beat ? 0.95 : 0.4, letterSpacing: '0.2em', marginBottom: 26, whiteSpace: 'nowrap'}}>
              刺激 <span style={{fontFamily: fonts.nightEn}}>→</span> 反应
            </div>
          );
        })}
      </div>

      {floaters.map((c, i) => {
        const inSentence = i < chars.length;
        const t = frame / 30;
        const fx = c.x + Math.sin(t * 0.7 + i) * 14 + c.vx * frame;
        const fy = c.y + Math.cos(t * 0.5 + i * 1.7) * 10 + c.vy * frame;
        const k = inSentence ? interpolate(frame, [assembleAt + i * 4, assembleAt + i * 4 + 36], [0, 1], {...clamp, easing: precise}) : 0;
        const x = fx + (sx0 + i * slot - fx) * k;
        const y = fy + (sy - fy) * k;
        const appear = interpolate(frame, [15 + (i % 10) * 4, 45 + (i % 10) * 4], [0, 1], clamp);
        const dimOthers = inSentence ? 1 : interpolate(frame, [assembleAt, assembleAt + 40], [1, 0.28], clamp);
        const size = c.size + (58 - c.size) * k;
        const color = k > 0.5 ? palette.golgiAmber : palette.nightText;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              fontFamily: fonts.nightZh,
              fontWeight: 300,
              fontSize: size,
              color,
              opacity: appear * dimOthers * (c.a + (1 - c.a) * k),
              textShadow: k > 0.5 ? `0 0 ${18 * k}px rgba(211,154,58,0.7)` : undefined,
            }}
          >
            {c.ch}
          </div>
        );
      })}
      {gloss ? (
        <div
          style={{
            position: 'absolute',
            left: width * 0.73,
            top: sy + 62,
            transform: 'translateX(-50%)',
            fontFamily: fonts.nightEn,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 17,
            color: 'rgba(233,228,218,0.5)',
            whiteSpace: 'nowrap',
            opacity: interpolate(frame, [assembleAt + chars.length * 4 + 40, assembleAt + chars.length * 4 + 70], [0, 1], {...clamp, easing: easeOut}),
          }}
        >
          {gloss}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
