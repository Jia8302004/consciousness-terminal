import '@fontsource/zcool-xiaowei/chinese-simplified-400.css';
import '@fontsource/zcool-xiaowei/latin-400.css';
import '@fontsource/noto-serif-sc/chinese-simplified-300.css';
import '@fontsource/noto-serif-sc/latin-300.css';
import '@fontsource/noto-serif-sc/chinese-simplified-400.css';
import '@fontsource/im-fell-english/latin-400.css';
import '@fontsource/im-fell-english/latin-400-italic.css';
import '@fontsource/ibm-plex-mono/latin-300.css';
import '@fontsource/ibm-plex-mono/latin-300-italic.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import {continueRender, delayRender} from 'remotion';
import type {World} from './theme';
import {allText} from './storyboard';

// Typography changes with the history: the paper world is set like an old printed plate
// (ZCOOL XiaoWei + IM Fell English italic); the night world is set like code
// (Noto Serif SC Light + IBM Plex Mono italic for the small English line).
// Fonts are bundled from @fontsource (served locally, no network at render time).
// Chinese fonts are split by unicode-range, so we explicitly load the glyphs we use.
const specs = [
  `400 50px "ZCOOL XiaoWei"`,
  `300 44px "Noto Serif SC"`,
  `400 44px "Noto Serif SC"`,
  `italic 400 30px "IM Fell English"`,
  `400 30px "IM Fell English"`,
  `italic 300 20px "IBM Plex Mono"`,
  `300 20px "IBM Plex Mono"`,
  `400 20px "IBM Plex Mono"`,
];
if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  Promise.all(specs.map((s) => document.fonts.load(s, allText)))
    .catch((e) => console.warn('font load', e))
    .finally(() => continueRender(handle));
}

export const fonts = {
  paperZh: `"ZCOOL XiaoWei", 'Noto Serif CJK SC', serif`,
  paperEn: `"IM Fell English", Georgia, serif`,
  paperNum: `"IM Fell English", Georgia, serif`,
  nightZh: `"Noto Serif SC", 'Noto Serif CJK SC', serif`,
  nightEn: `"IBM Plex Mono", 'DejaVu Sans Mono', monospace`,
  nightNum: `"IBM Plex Mono", 'DejaVu Sans Mono', monospace`,
};

export const zhFont = (w: World) => (w === 'paper' ? fonts.paperZh : fonts.nightZh);
export const enFont = (w: World) => (w === 'paper' ? fonts.paperEn : fonts.nightEn);
