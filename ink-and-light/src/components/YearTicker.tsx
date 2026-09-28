import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, precise, palette} from '../theme';
import {fonts} from '../fonts';

export type YearKey = {frame: number; year: number | null}; // null = hide

// The film's time spine: one year readout in the top-right that rolls from key to key.
// It is set in italic Fell on paper and in Plex Mono at night, cross-fading at `nightFrom`.
export const YearTicker: React.FC<{keys: YearKey[]; nightFrom: number; roll?: number}> = ({keys, nightFrom, roll = 40}) => {
  const frame = useCurrentFrame();
  let value: number | null = null;
  let visible = 0;
  let prev: number | null = null;
  for (const k of keys) {
    if (frame < k.frame) break;
    const into = frame - k.frame;
    if (k.year === null) {
      visible = interpolate(into, [0, 20], [1, 0], clamp) * (value === null ? 0 : 1);
    } else if (prev === null) {
      value = k.year;
      visible = interpolate(into, [0, 24], [0, 1], clamp);
    } else {
      value = Math.round(interpolate(into, [0, roll], [prev, k.year], {...clamp, easing: precise}));
      visible = 1;
    }
    if (k.year !== null) prev = k.year;
    else prev = null;
  }
  if (value === null || visible <= 0) return null;
  const night = interpolate(frame, [nightFrom, nightFrom + 30], [0, 1], clamp);
  const base: React.CSSProperties = {position: 'absolute', top: 84, right: 120, fontSize: 40, letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums'};
  return (
    <>
      <div style={{...base, fontFamily: fonts.paperNum, fontStyle: 'italic', color: palette.ironGall, opacity: visible * (1 - night) * 0.85}}>{value}</div>
      <div style={{...base, fontFamily: fonts.nightNum, fontWeight: 300, color: palette.phosphor, opacity: visible * night * 0.8}}>{value}</div>
    </>
  );
};
