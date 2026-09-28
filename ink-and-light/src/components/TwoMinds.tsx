import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {buildBrainPoints, latticeOf} from '../lib/brainGeometry';
import {clamp, palette, precise} from '../theme';

// Two minds facing each other. Left: an organic brain of amber points.
// Right: the same shape, which "digitises" into a phosphor voxel lattice from `digitiseAt`.
// Thin threads of light gradually connect them from `threadsAt`.
const Cloud: React.FC<{organic: Float32Array; lattice: Float32Array; morph: number; color: string; x: number; rotY: number; size: number}> = ({
  organic,
  lattice,
  morph,
  color,
  x,
  rotY,
  size,
}) => {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(organic), 3));
    return g;
  }, [organic]);
  const attr = geom.getAttribute('position') as THREE.BufferAttribute;
  const arr = attr.array as Float32Array;
  for (let i = 0; i < arr.length; i++) arr[i] = organic[i] + (lattice[i] - organic[i]) * morph;
  attr.needsUpdate = true;
  return (
    <points geometry={geom} position={[x, 0, 0]} rotation={[0.25, rotY, 0]}>
      <pointsMaterial size={size} sizeAttenuation color={color} transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

export const TwoMinds: React.FC<{count?: number; digitiseAt?: number; threadsAt?: number}> = ({count = 26000, digitiseAt = 40, threadsAt = 120}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const organic = useMemo(() => buildBrainPoints(count, 'mind'), [count]);
  const lattice = useMemo(() => latticeOf(organic), [organic]);
  const morph = interpolate(frame, [digitiseAt, digitiseAt + 90], [0, 1], {...clamp, easing: precise});
  const rot = (frame / fps) * 0.12;
  const appear = interpolate(frame, [0, 40], [0, 1], clamp);
  const threads = interpolate(frame, [threadsAt, threadsAt + 150], [0, 1], clamp);

  // screen-space threads between the two hemispheres' approximate centres
  const lx = width * 0.3;
  const rx = width * 0.7;
  const cy = height * 0.47;
  const lines = Array.from({length: 18}, (_, i) => {
    const y1 = cy + (random(`th-a${i}`) - 0.5) * height * 0.28;
    const y2 = cy + (random(`th-b${i}`) - 0.5) * height * 0.28;
    const bend = (random(`th-c${i}`) - 0.5) * height * 0.35;
    const k = interpolate(threads, [i / 18 * 0.7, i / 18 * 0.7 + 0.3], [0, 1], clamp);
    return k > 0 ? (
      <path
        key={i}
        d={`M ${lx + 120} ${y1} Q ${width / 2} ${cy + bend} ${rx - 120} ${y2}`}
        fill="none"
        stroke={i % 3 === 0 ? palette.golgiAmber : palette.phosphor}
        strokeWidth={0.8}
        opacity={0.45}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - k}
      />
    ) : null;
  });

  return (
    <AbsoluteFill style={{opacity: appear}}>
      <ThreeCanvas width={width} height={height} camera={{position: [0, 0.2, 5.1], fov: 40}} gl={{alpha: true, antialias: true}}>
        <Cloud organic={organic} lattice={organic} morph={0} color={palette.golgiAmber} x={-1.2} rotY={0.9 + rot} size={0.012} />
        <Cloud organic={organic} lattice={lattice} morph={morph} color={palette.phosphor} x={1.2} rotY={-0.9 - rot} size={0.012} />
      </ThreeCanvas>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        {lines}
      </svg>
    </AbsoluteFill>
  );
};
