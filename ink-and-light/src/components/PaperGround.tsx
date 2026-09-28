import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {palette} from '../theme';

// Aged rag paper. The texture is a pre-rendered image (scripts/make_paper.py -> public/paper.jpg):
// live SVG noise filters looked the same but made every paper frame ~10x slower to render.
// `dark` (0..1) sinks the sheet into the night world — used for the 1956 ignition.
export const PaperGround: React.FC<{dark?: number}> = ({dark = 0}) => (
  <AbsoluteFill style={{background: palette.cajalPaper}}>
    <Img src={staticFile('paper.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: palette.siliconNight, opacity: dark}} />
  </AbsoluteFill>
);
