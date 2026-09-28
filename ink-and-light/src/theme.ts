import {Easing, interpolateColors} from 'remotion';

// "Ink and Light": two visual worlds.
// PAPER = the human tradition of studying the mind (19th-c. plates, manuscripts, iron-gall ink).
// NIGHT = computation (silicon night, phosphor light). Biology keeps one warm signal colour in both.
export const palette = {
  cajalPaper: '#DDD3BE', // aged rag paper — darker and greyer than a generic cream on purpose
  paperShade: '#C7BA9E',
  ironGall: '#2B2119', // brown-black ink
  golgiAmber: '#D39A3A', // the amber of Golgi-stained tissue: the colour of biological signal
  siliconNight: '#070B14', // deep blue-black
  phosphor: '#CFF3F1', // cold pale light of machines
  frost: '#8EA3B8', // the AI winter
  nightText: '#E9E4DA',
};

export type World = 'paper' | 'night';

export const worldColors = (w: World) =>
  w === 'paper'
    ? {bg: palette.cajalPaper, text: palette.ironGall, dim: 'rgba(43,33,25,0.62)', faint: 'rgba(43,33,25,0.38)', line: 'rgba(43,33,25,0.45)'}
    : {bg: palette.siliconNight, text: palette.nightText, dim: 'rgba(233,228,218,0.66)', faint: 'rgba(233,228,218,0.42)', line: 'rgba(207,243,241,0.35)'};

// Ink -> light colour ramp for anything that "ignites" (t = 0 ink, 1 light).
export const inkToLight = (t: number, light = palette.phosphor) => interpolateColors(t, [0, 0.5, 1], [palette.ironGall, palette.golgiAmber, light]);

// Motion has two temperaments: organic (paper/biology) and precise (night/machine).
export const organic = Easing.bezier(0.33, 0, 0.1, 1); // slow settle, like ink soaking in
export const precise = Easing.bezier(0.7, 0, 0.3, 1); // symmetric, mechanical
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
