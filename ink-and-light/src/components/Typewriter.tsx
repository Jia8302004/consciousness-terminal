import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, worldColors, type World} from '../theme';
import {fonts} from '../fonts';

// Text typed one character at a time with a blinking caret. Good for a quoted question.
export const Typewriter: React.FC<{text: string; world?: World; delay?: number; perChar?: number; size?: number; style?: React.CSSProperties}> = ({
  text,
  world = 'paper',
  delay = 0,
  perChar = 4,
  size = 72,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  const shown = Math.floor(interpolate(local, [0, text.length * perChar], [0, text.length], clamp));
  const done = shown >= text.length;
  const caretOn = done ? Math.floor(local / 15) % 2 === 0 : true;
  const c = worldColors(world);
  return (
    <div style={{fontFamily: world === 'paper' ? fonts.paperEn : fonts.nightEn, fontStyle: world === 'paper' ? 'italic' : 'normal', fontSize: size, color: c.text, whiteSpace: 'pre', opacity: local >= 0 ? 1 : 0, ...style}}>
      {text.slice(0, shown)}
      <span style={{opacity: caretOn ? 0.8 : 0, marginLeft: 4}}>|</span>
    </div>
  );
};
