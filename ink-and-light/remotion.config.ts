import {Config} from '@remotion/cli/config';

// WebGL (three.js / shaders) needs a real GL backend when rendering headless.
// "angle" works on most machines; if the render is black or crashes, try "swangle" (CPU, slow) or "vulkan".
Config.setChromiumOpenGlRenderer('angle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
