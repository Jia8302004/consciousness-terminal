import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {FPS, TRANSITION, frames, sb, startOf} from './storyboard';
import {clamp, palette} from './theme';
import {Caption} from './components/Caption';
import {FigureLabel} from './components/FigureLabel';
import {YearTicker} from './components/YearTicker';
import {PaperGround} from './components/PaperGround';
import {InkNeuron} from './components/InkNeuron';
import {LogicUnit} from './components/LogicUnit';
import {Typewriter} from './components/Typewriter';
import {NeuralDust} from './components/NeuralDust';
import {SeeingInLayers} from './components/SeeingInLayers';
import {LayeredNetwork} from './components/LayeredNetwork';
import {NetworkBloom} from './components/NetworkBloom';
import {Counter} from './components/Counter';
import {GoBoard} from './components/GoBoard';
import {AttentionField} from './components/AttentionField';
import {TwoMinds} from './components/TwoMinds';
import {TitleSplit} from './components/TitleSplit';
import {Flash} from './components/Flash';
import {NovelSentence} from './components/NovelSentence';
import {ChineseRoom} from './components/ChineseRoom';

const Night: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: palette.siliconNight}}>{children}</AbsoluteFill>;
const Pos: React.FC<{style: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => <div style={{position: 'absolute', ...style}}>{children}</div>;

// The same neuron appears in scenes 2, 3 and 5 so the drawing carries across the cuts.
const useCajal = () => {
  const {width, height} = useVideoConfig();
  return {cx: width * 0.3, cy: height * 0.5, scale: 1.15};
};

const ColdOpen: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const first = interpolate(f, [10, 18, 40], [0, 1, 0.3], clamp);
  return (
    <Night>
      <AbsoluteFill style={{opacity: interpolate(f, [40, 110], [0, 1], clamp)}}>
        <NeuralDust rate={0.8} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: width / 2 - 60, top: height * 0.34 - 60, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${palette.phosphor} 0%, rgba(211,154,58,0.6) 12%, transparent 60%)`, opacity: first}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 190}}>
        <Caption world="night" {...sb.coldOpen.a} align="center" delay={30} exitAt={105} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 190}}>
        <Caption world="night" {...sb.coldOpen.b} align="center" size={52} delay={160} exitAt={d - 175} />
      </AbsoluteFill>
    </Night>
  );
};

const Neuron: React.FC<{d: number}> = ({d}) => {
  const c = useCajal();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      <PaperGround />
      <InkNeuron {...c} delay={10} grow={170} />
      <Pos style={{left: c.cx - 300, width: 600, top: height * 0.88}}>
        <FigureLabel world="paper" {...sb.neuron.fig} delay={150} />
      </Pos>
      <Pos style={{left: width * 0.56, top: height * 0.36}}>
        <Caption world="paper" {...sb.neuron.a} delay={45} exitAt={140} />
      </Pos>
      <Pos style={{left: width * 0.56, top: height * 0.36}}>
        <Caption world="paper" {...sb.neuron.b} delay={200} exitAt={d - 225} />
      </Pos>
    </AbsoluteFill>
  );
};

const Logic: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const c = useCajal();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      <PaperGround />
      <InkNeuron {...c} delay={-999} opacity={interpolate(f, [0, 40], [1, 0.08], clamp)} />
      <LogicUnit cx={width * 0.42} cy={height * 0.38} r={82} delay={20} fireAt={150} />
      <Pos style={{left: width * 0.42 - 300, width: 600, top: height * 0.6}}>
        <FigureLabel world="paper" {...sb.logic.fig} delay={90} />
      </Pos>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
        <Caption world="paper" {...sb.logic.a} align="center" delay={30} exitAt={115} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
        <Caption world="paper" {...sb.logic.b} align="center" delay={165} exitAt={d - 190} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Question: React.FC<{d: number}> = ({d}) => {
  const {height} = useVideoConfig();
  return (
    <AbsoluteFill>
      <PaperGround />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: height * 0.3}}>
        <Typewriter text={sb.question.typed} delay={15} perChar={4} size={88} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 230}}>
        <Caption world="paper" {...sb.question.a} align="center" delay={100} exitAt={d - 125} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90}}>
        <FigureLabel world="paper" {...sb.question.fig} delay={120} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// The one bold transition of the film: paper sinks into night, the ink ignites into light.
const Ignition: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const c = useCajal();
  const {width, height} = useVideoConfig();
  const dark = interpolate(f, [30, 100], [0, 1], clamp);
  const lit = interpolate(f, [55, 125], [0, 1], clamp);
  const pulses = f > 120 ? 1.4 : 0;
  return (
    <AbsoluteFill>
      <PaperGround dark={dark} />
      <AbsoluteFill style={{opacity: interpolate(f, [110, 170], [0, 0.6], clamp)}}>
        <NeuralDust seed="ign" rate={1.2} />
      </AbsoluteFill>
      <InkNeuron {...c} delay={-999} lit={lit} pulses={pulses} />
      <InkNeuron seed="n2" cx={width * 0.62} cy={height * 0.36} scale={0.8} delay={-999} lit={lit} pulses={pulses} opacity={0.85} />
      <InkNeuron seed="n3" cx={width * 0.8} cy={height * 0.62} scale={0.95} delay={-999} lit={lit} pulses={pulses} opacity={0.75} />
      {/* a soft scrim so the caption never fights the glowing branches */}
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(7,11,20,0.92) 0%, rgba(7,11,20,0.6) 22%, transparent 42%)', opacity: interpolate(f, [120, 150], [0, 1], clamp)}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 130}}>
        <Caption world="night" {...sb.ignition.a} align="center" delay={140} exitAt={d - 160} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70}}>
        <FigureLabel world="night" credit={sb.ignition.credit} delay={170} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Seeing: React.FC<{d: number}> = ({d}) => (
  <Night>
    <SeeingInLayers assembleAt={165} />
    <Pos style={{left: 140, top: 110}}>
      <Caption world="night" {...sb.seeing.a} delay={20} exitAt={130} />
    </Pos>
    <Pos style={{left: 140, top: 110}}>
      <Caption world="night" {...sb.seeing.b} delay={200} exitAt={d - 225} />
    </Pos>
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={sb.seeing.credit} align="left" delay={40} />
    </Pos>
  </Night>
);

// The behaviourism debate: stimulus -> response vs. a sentence no one taught.
const Behavior: React.FC<{d: number}> = ({d}) => (
  <Night>
    <AbsoluteFill style={{opacity: 0.35}}>
      <NeuralDust seed="beh" rate={0.6} count={160} />
    </AbsoluteFill>
    <NovelSentence sentence={sb.behavior.sentence} gloss={sb.behavior.sentenceEn} assembleAt={130} />
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.behavior.a} delay={20} exitAt={95} />
    </Pos>
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.behavior.b} delay={145} exitAt={d - 170} />
    </Pos>
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={sb.behavior.credit} align="left" delay={60} />
    </Pos>
  </Night>
);

// Winter: forward waves run, then everything freezes.
const Winter: React.FC<{d: number}> = ({d}) => (
  <Night>
    <LayeredNetwork frostAt={105} backAt={99999} />
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.winter.a} delay={15} exitAt={95} />
    </Pos>
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.winter.b} delay={140} exitAt={d - 160} />
    </Pos>
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={sb.winter.credit} align="left" delay={40} />
    </Pos>
  </Night>
);

// The Chinese Room, in the frozen night.
const Room: React.FC<{d: number}> = ({d}) => (
  <Night>
    <AbsoluteFill style={{opacity: 0.3}}>
      <NeuralDust seed="room" rate={0.25} count={140} color={palette.frost} />
    </AbsoluteFill>
    <ChineseRoom start={30} cycle={72} />
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.room.a} delay={25} exitAt={100} />
    </Pos>
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.room.b} delay={150} exitAt={d - 170} />
    </Pos>
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={sb.room.credit} align="left" delay={50} />
    </Pos>
  </Night>
);

// Thaw: the frozen network, then the error flows backwards and the ice melts.
const Thaw: React.FC<{d: number}> = ({d}) => (
  <Night>
    <LayeredNetwork frostAt={-60} backAt={55} />
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.thaw.a} delay={30} exitAt={d - 60} />
    </Pos>
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={sb.thaw.credit} align="left" delay={70} />
    </Pos>
  </Night>
);

const Bloom: React.FC<{d: number}> = ({d}) => (
  <Night>
    <NetworkBloom />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,11,20,0.9) 100%)'}} />
    <Pos style={{left: 140, bottom: 140}}>
      <Caption world="night" {...sb.bloom.a} delay={20} exitAt={d - 50} />
    </Pos>
    <Pos style={{right: 120, bottom: 120}}>
      <Counter {...sb.bloom.counter} delay={15} duration={d - 50} />
    </Pos>
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={sb.bloom.credit} align="left" delay={30} />
    </Pos>
  </Night>
);

const Go: React.FC<{d: number}> = ({d}) => (
  <Night>
    <GoBoard keyMoveAt={125} />
    <Pos style={{left: 140, top: 400}}>
      <Caption world="night" {...sb.go.a} delay={135} exitAt={d - 155} />
    </Pos>
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={sb.go.credit} align="left" delay={150} />
    </Pos>
  </Night>
);

const ATTN_FLASH = 285;
const Attention: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  return (
    <Night>
      <AbsoluteFill style={{opacity: interpolate(f, [ATTN_FLASH, ATTN_FLASH + 1], [1, 0.25], clamp)}}>
        <AttentionField tokens={sb.attention.tokens} allAt={ATTN_FLASH - 50} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 50}}>
        <Caption world="night" {...sb.attention.a} align="center" delay={30} exitAt={ATTN_FLASH - 60} />
      </AbsoluteFill>
      <Flash at={ATTN_FLASH} rise={10} fall={40} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Caption world="night" {...sb.attention.b} align="center" size={56} delay={ATTN_FLASH + 25} exitAt={d - ATTN_FLASH - 50} />
      </AbsoluteFill>
      <Pos style={{left: 140, bottom: 90}}>
        <FigureLabel world="night" credit={sb.attention.credit} align="left" delay={60} />
      </Pos>
    </Night>
  );
};

const Minds: React.FC<{d: number}> = ({d}) => (
  <Night>
    <TwoMinds digitiseAt={30} threadsAt={140} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
      <Caption world="night" {...sb.twoMinds.a} align="center" delay={20} exitAt={120} />
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
      <Caption world="night" {...sb.twoMinds.b} align="center" delay={165} exitAt={140} />
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
      <Caption world="night" {...sb.twoMinds.c} align="center" size={52} delay={345} exitAt={d - 345 - 25} />
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 46}}>
      <FigureLabel world="night" credit={sb.twoMinds.credit} delay={380} />
    </AbsoluteFill>
  </Night>
);

export const Main: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const cut = () => <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION})} />;
  const S = (k: Parameters<typeof frames>[0], el: React.ReactNode) => <TransitionSeries.Sequence durationInFrames={frames(k)}>{el}</TransitionSeries.Sequence>;

  const keys = [
    {frame: startOf('neuron') + 40, year: 1888},
    {frame: startOf('logic') + 20, year: 1943},
    {frame: startOf('question') + 20, year: 1950},
    {frame: startOf('ignition') + 70, year: 1956},
    {frame: startOf('behavior') + 20, year: 1959},
    {frame: startOf('winter') + 20, year: 1969},
    {frame: startOf('room') + 20, year: 1980},
    {frame: startOf('thaw') + 40, year: 1986},
    {frame: startOf('bloom') + 10, year: 2012},
    {frame: startOf('go') + 10, year: 2016},
    {frame: startOf('attention') + 20, year: 2017},
    {frame: startOf('attention') + ATTN_FLASH, year: 2022},
    {frame: startOf('twoMinds') + 10, year: null},
  ];

  return (
    <AbsoluteFill style={{background: palette.siliconNight}}>
      <TransitionSeries>
        {S('coldOpen', <ColdOpen d={frames('coldOpen')} />)}
        {cut()}
        {S('neuron', <Neuron d={frames('neuron')} />)}
        {cut()}
        {S('logic', <Logic d={frames('logic')} />)}
        {cut()}
        {S('question', <Question d={frames('question')} />)}
        {cut()}
        {S('ignition', <Ignition d={frames('ignition')} />)}
        {cut()}
        {S('behavior', <Behavior d={frames('behavior')} />)}
        {cut()}
        {S('seeing', <Seeing d={frames('seeing')} />)}
        {cut()}
        {S('winter', <Winter d={frames('winter')} />)}
        {cut()}
        {S('room', <Room d={frames('room')} />)}
        {cut()}
        {S('thaw', <Thaw d={frames('thaw')} />)}
        {cut()}
        {S('bloom', <Bloom d={frames('bloom')} />)}
        {cut()}
        {S('go', <Go d={frames('go')} />)}
        {cut()}
        {S('attention', <Attention d={frames('attention')} />)}
        {cut()}
        {S('twoMinds', <Minds d={frames('twoMinds')} />)}
        {cut()}
        {S('title', <TitleSplit {...sb.title} />)}
      </TransitionSeries>
      <YearTicker keys={keys} nightFrom={startOf('ignition') + 60} />
      {sb.music ? (
        <Audio src={staticFile(sb.music)} volume={(f) => interpolate(f, [0, FPS * 2, durationInFrames - FPS * 3, durationInFrames], [0, 0.8, 0.8, 0], clamp)} />
      ) : null}
    </AbsoluteFill>
  );
};
