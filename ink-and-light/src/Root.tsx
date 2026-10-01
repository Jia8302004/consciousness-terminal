import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {Cover} from './Cover';
import {FPS, totalFrames} from './storyboard';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={totalFrames} fps={FPS} width={1920} height={1080} />
    <Composition id="Cover" component={Cover} durationInFrames={60} fps={FPS} width={1080} height={1920} />
  </>
);
