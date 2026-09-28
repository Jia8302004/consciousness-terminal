import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, palette} from '../theme';

export const Flash: React.FC<{at: number; rise?: number; fall?: number; color?: string}> = ({at, rise = 6, fall = 26, color = palette.phosphor}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - rise, at, at + fall], [0, 1, 0], clamp);
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};
