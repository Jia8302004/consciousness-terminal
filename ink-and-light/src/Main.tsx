import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {FPS, TRANSITION, frames, sb, startOf, type Line} from './storyboard';
import {clamp, palette, type World} from './theme';
import {fonts} from './fonts';
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
import {GoBoard} from './components/GoBoard';
import {AttentionField} from './components/AttentionField';
import {TwoMinds} from './components/TwoMinds';
import {Flash} from './components/Flash';
import {NovelSentence} from './components/NovelSentence';
import {ChineseRoom} from './components/ChineseRoom';
import {
  ChapterCard,
  ChatWindow,
  ElectrodeTrace,
  ErrorBars,
  IceShatter,
  ImitationGame,
  LonePoint,
  MicroscopeField,
  PerceptronMachine,
  ProposalPage,
  SkinnerBox,
  Snow,
  StarsToNeurons,
  SynapseInset,
  XORPlane,
  type Motif,
} from './components/Imagery';

const Night: React.FC<{children: React.ReactNode}> = ({children}) => <AbsoluteFill style={{background: palette.siliconNight}}>{children}</AbsoluteFill>;
const Pos: React.FC<{style: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => <div style={{position: 'absolute', ...style}}>{children}</div>;

// Two captions per scene: `a` from `start`, `b` from `split`, each fading out before the next.
type Place = {kind: 'bl'; bottom?: number; left?: number} | {kind: 'tl'; top?: number; left?: number} | {kind: 'bc'; bottom?: number} | {kind: 'tc'; top?: number};
const Wrap: React.FC<{p: Place; children: React.ReactNode}> = ({p, children}) => {
  if (p.kind === 'bl') return <Pos style={{left: p.left ?? 140, bottom: p.bottom ?? 150}}>{children}</Pos>;
  if (p.kind === 'tl') return <Pos style={{left: p.left ?? 140, top: p.top ?? 110}}>{children}</Pos>;
  if (p.kind === 'bc') return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: p.bottom ?? 110}}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{alignItems: 'center', paddingTop: p.top ?? 60}}>{children}</AbsoluteFill>;
};
const Pair: React.FC<{world: World; a: Line; b: Line; d: number; split: number; start?: number; p: Place; pb?: Place; size?: number; sizeB?: number}> = ({world, a, b, d, split, start = 15, p, pb, size, sizeB}) => {
  const align = p.kind === 'bc' || p.kind === 'tc' ? 'center' : 'left';
  const alignB = (pb ?? p).kind === 'bc' || (pb ?? p).kind === 'tc' ? 'center' : 'left';
  return (
    <>
      <Wrap p={p}>
        <Caption world={world} {...a} align={align} size={size} delay={start} exitAt={split - 25 - start} />
      </Wrap>
      <Wrap p={pb ?? p}>
        <Caption world={world} {...b} align={alignB} size={sizeB ?? size} delay={split} exitAt={d - 35 - split} />
      </Wrap>
    </>
  );
};
const Credit: React.FC<{text: string; delay?: number; center?: boolean}> = ({text, delay = 40, center}) =>
  center ? (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 60}}>
      <FigureLabel world="night" credit={text} delay={delay} />
    </AbsoluteFill>
  ) : (
    <Pos style={{left: 140, bottom: 90}}>
      <FigureLabel world="night" credit={text} align="left" delay={delay} />
    </Pos>
  );

// The same neuron appears in the neuron, logic and 1956 scenes so the drawing carries across the cuts.
const useCajal = () => {
  const {width, height} = useVideoConfig();
  return {cx: width * 0.27, cy: height * 0.5, scale: 1.0};
};

// ---------------------------------------------------------------------------------------------
const ColdOpen: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <Night>
      <StarsToNeurons linkAt={70} />
      <LonePoint x={width / 2} y={height * 0.36} opacity={interpolate(f, [8, 16, 60, 110], [0, 1, 1, 0.35], clamp)} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(7,11,20,0.9) 0%, rgba(7,11,20,0.5) 25%, transparent 45%)'}} />
      <Pair world="night" {...sb.coldOpen} d={d} split={122} start={20} p={{kind: 'bc', bottom: 170}} size={48} />
    </Night>
  );
};

const Chapter: React.FC<{k: 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5'; world: World; motif: Motif}> = ({k, world, motif}) => {
  const c = sb[k];
  const inner = <ChapterCard world={world} num={c.num} title={c.title} en={c.en} motif={motif} />;
  return world === 'paper' ? (
    <AbsoluteFill>
      <PaperGround />
      {inner}
    </AbsoluteFill>
  ) : (
    <Night>
      <AbsoluteFill style={{opacity: 0.25}}>
        <NeuralDust seed={k} rate={0.2} count={90} color={motif === 'snow' ? palette.frost : undefined} />
      </AbsoluteFill>
      {motif === 'snow' ? <Snow count={60} opacity={0.6} /> : null}
      {inner}
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
      <MicroscopeField cx={c.cx} cy={c.cy} r={455} />
      <Pos style={{left: c.cx - 300, width: 600, top: height * 0.9}}>
        <FigureLabel world="paper" {...sb.neuron.fig} delay={150} />
      </Pos>
      <SynapseInset x={width * 0.62} y={height * 0.56} size={240} delay={175} />
      <Pair world="paper" {...sb.neuron} d={d} split={165} start={25} p={{kind: 'tl', left: width * 0.535, top: height * 0.24}} size={40} />
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
      <LogicUnit cx={width * 0.42} cy={height * 0.36} r={82} delay={20} fireAt={125} />
      <Pos style={{left: width * 0.42 - 300, width: 600, top: height * 0.56}}>
        <FigureLabel world="paper" {...sb.logic.fig} delay={90} />
      </Pos>
      <Pair world="paper" {...sb.logic} d={d} split={165} start={20} p={{kind: 'bc', bottom: 110}} />
    </AbsoluteFill>
  );
};

const Question: React.FC<{d: number}> = ({d}) => {
  const {height} = useVideoConfig();
  return (
    <AbsoluteFill>
      <PaperGround />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: height * 0.07}}>
        <Typewriter text={sb.question.typed} delay={10} perChar={4} size={72} />
        <FigureLabel world="paper" credit={sb.question.fig.credit} delay={90} style={{marginTop: 8}} />
      </AbsoluteFill>
      <ImitationGame delay={70} />
      <Pair world="paper" {...sb.question} d={d} split={150} start={40} p={{kind: 'bc', bottom: 60}} size={42} />
    </AbsoluteFill>
  );
};

// Climax 1: the proposal page sinks, the paper sinks into night, the ink ignites into light.
const IGN_LIT = 175;
const Ignition: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const c = useCajal();
  const {width, height} = useVideoConfig();
  const dark = interpolate(f, [90, 150], [0, 1], clamp);
  const lit = interpolate(f, [110, IGN_LIT], [0, 1], clamp);
  const pulses = f > IGN_LIT - 10 ? 1.4 : 0;
  return (
    <AbsoluteFill>
      <PaperGround dark={dark} />
      <AbsoluteFill style={{opacity: interpolate(f, [150, 210], [0, 0.6], clamp)}}>
        <NeuralDust seed="ign" rate={1.2} />
      </AbsoluteFill>
      <InkNeuron {...c} delay={-999} lit={lit} pulses={pulses} opacity={interpolate(f, [0, 100, 140], [0.18, 0.18, 1], clamp)} />
      <AbsoluteFill style={{opacity: interpolate(f, [100, 150], [0, 1], clamp)}}>
        <InkNeuron seed="n2" cx={width * 0.62} cy={height * 0.36} scale={0.8} delay={-999} lit={lit} pulses={pulses} opacity={0.85} />
        <InkNeuron seed="n3" cx={width * 0.8} cy={height * 0.62} scale={0.95} delay={-999} lit={lit} pulses={pulses} opacity={0.75} />
      </AbsoluteFill>
      <ProposalPage text={sb.ignition.page} outAt={78} />
      <Flash at={IGN_LIT - 5} rise={8} fall={45} color={palette.golgiAmber} />
      {/* a soft scrim so the caption never fights the glowing branches */}
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(7,11,20,0.92) 0%, rgba(7,11,20,0.6) 22%, transparent 42%)', opacity: interpolate(f, [160, 190], [0, 1], clamp)}} />
      <Pos style={{left: 140, top: height * 0.4}}>
        <Caption world="paper" {...sb.ignition.a} delay={10} exitAt={75} />
      </Pos>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 130}}>
        <Caption world="night" {...sb.ignition.b} align="center" delay={IGN_LIT + 5} exitAt={d - 35 - IGN_LIT - 5} />
      </AbsoluteFill>
      <Credit center text={sb.ignition.credit} delay={IGN_LIT + 30} />
    </AbsoluteFill>
  );
};

// The behaviourism debate: a rat pressing a lever vs. a sentence no one taught.
const BEH_SPLIT = 175;
const Behavior: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <Night>
      <AbsoluteFill style={{opacity: 0.3}}>
        <NeuralDust seed="beh" rate={0.6} count={140} />
      </AbsoluteFill>
      <SkinnerBox x={width * 0.08} y={height * 0.14} dim={interpolate(f, [BEH_SPLIT, BEH_SPLIT + 40], [1, 0.3], clamp)} />
      <NovelSentence sentence={sb.behavior.sentence} gloss={sb.behavior.sentenceEn} assembleAt={BEH_SPLIT + 15} mech={false} />
      <Pair world="night" {...sb.behavior} d={d} split={BEH_SPLIT} p={{kind: 'bl'}} />
      <Credit text={sb.behavior.credit} delay={60} />
    </Night>
  );
};

const Seeing: React.FC<{d: number}> = ({d}) => {
  const {height} = useVideoConfig();
  return (
    <Night>
      <SeeingInLayers assembleAt={150} />
      <ElectrodeTrace x={140} y={height * 0.66} w={520} h={80} until={150} />
      <Pair world="night" {...sb.seeing} d={d} split={150} p={{kind: 'tl'}} />
      <Credit text={sb.seeing.credit} delay={40} />
    </Night>
  );
};

// 1958: warm hope. The perceptron reads a letter; the press promises the moon.
const Hype: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const q = sb.hype.quote;
  const shown = Math.floor(interpolate(f, [60, 60 + q.length * 1.1], [0, q.length], clamp));
  return (
    <Night>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 40%, rgba(211,154,58,0.16) 0%, transparent 60%)'}} />
      <PerceptronMachine x={150} y={height * 0.12} />
      <Pos style={{left: width * 0.56, top: height * 0.2, width: width * 0.36}}>
        <div style={{fontFamily: fonts.paperEn, fontStyle: 'italic', fontSize: 40, lineHeight: 1.35, color: palette.golgiAmber, textShadow: '0 0 20px rgba(211,154,58,0.35)'}}>{q.slice(0, shown)}</div>
        <FigureLabel world="night" credit={sb.hype.credit} align="left" delay={100} style={{marginTop: 18}} />
      </Pos>
      <Pair world="night" {...sb.hype} d={d} split={115} p={{kind: 'bl'}} />
    </Night>
  );
};

// 1969: XOR defeats the single layer; the network freezes, the lights go out, snow falls.
const FALL_NET = 165;
const Fall: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const planeOut = interpolate(f, [FALL_NET, FALL_NET + 30], [1, 0], clamp);
  return (
    <Night>
      <AbsoluteFill style={{opacity: planeOut}}>
        <XORPlane cx={width * 0.5} cy={height * 0.38} size={360} failAt={125} />
      </AbsoluteFill>
      <Sequence from={FALL_NET}>
        <AbsoluteFill style={{opacity: interpolate(f, [FALL_NET, FALL_NET + 30, 250, d], [0, 1, 1, 0.45], clamp)}}>
          <LayeredNetwork seed="fall" frostAt={45} backAt={99999} />
        </AbsoluteFill>
      </Sequence>
      <Snow from={FALL_NET + 30} />
      <Pair world="night" {...sb.fall} d={d} split={FALL_NET} p={{kind: 'bl'}} />
      <Credit text={sb.fall.credit} delay={40} />
    </Night>
  );
};

// The Chinese Room, in the frozen night.
const Room: React.FC<{d: number}> = ({d}) => (
  <Night>
    <AbsoluteFill style={{opacity: 0.3}}>
      <NeuralDust seed="room" rate={0.25} count={140} color={palette.frost} />
    </AbsoluteFill>
    <Snow count={80} opacity={0.55} seed="snow2" />
    <ChineseRoom start={30} cycle={72} />
    <Pair world="night" {...sb.room} d={d} split={150} start={20} p={{kind: 'bl'}} />
    <Credit text={sb.room.credit} delay={50} />
  </Night>
);

// Climax 2 — 1986: the error flows back, the ice cracks and shatters, XOR is solved.
const THAW_SHATTER = 140;
const Thaw: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <Night>
      <LayeredNetwork frostAt={-60} backAt={75} />
      <Snow opacity={interpolate(f, [THAW_SHATTER - 10, THAW_SHATTER + 20], [0.8, 0], clamp)} seed="snow3" />
      <IceShatter crackAt={95} at={THAW_SHATTER} />
      <XORPlane cx={width * 0.87} cy={height * 0.3} size={180} solved={interpolate(f, [THAW_SHATTER + 30, THAW_SHATTER + 60], [0, 1], clamp)} delay={THAW_SHATTER + 30} />
      <Pair world="night" {...sb.thaw} d={d} split={THAW_SHATTER + 20} start={20} p={{kind: 'bl'}} />
      <Credit text={sb.thaw.credit} delay={70} />
    </Night>
  );
};

const Bloom: React.FC<{d: number}> = ({d}) => {
  const {width, height} = useVideoConfig();
  return (
    <Night>
      <NetworkBloom />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,11,20,0.9) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(7,11,20,0.85) 0%, transparent 45%)'}} />
      <ErrorBars x={width * 0.5} y={height * 0.12} delay={30} />
      <Pair world="night" {...sb.bloom} d={d} split={140} start={10} p={{kind: 'bl'}} sizeB={60} />
      <Credit text={sb.bloom.credit} delay={30} />
    </Night>
  );
};

const Go: React.FC<{d: number}> = ({d}) => (
  <Night>
    <AbsoluteFill style={{transform: 'translateX(190px) scale(0.9)'}}>
      <GoBoard keyMoveAt={140} />
    </AbsoluteFill>
    <Pair world="night" {...sb.go} d={d} split={125} p={{kind: 'tl', top: 420}} size={40} />
    <Credit text={sb.go.credit} delay={60} />
  </Night>
);

// Climax 3 — every word attends to every other; flash; the old question typed into a chat window.
const ATTN_FLASH = 200;
const Attention: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {height} = useVideoConfig();
  return (
    <Night>
      <AbsoluteFill style={{opacity: interpolate(f, [ATTN_FLASH, ATTN_FLASH + 1], [1, 0.12], clamp)}}>
        <AttentionField tokens={sb.attention.tokens} allAt={ATTN_FLASH - 50} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 50}}>
        <Caption world="night" {...sb.attention.a} align="center" delay={20} exitAt={ATTN_FLASH - 70} />
      </AbsoluteFill>
      <Flash at={ATTN_FLASH} rise={10} fall={40} />
      <ChatWindow q={sb.attention.chatQ} a={sb.attention.chatA} delay={ATTN_FLASH + 15} y={height * 0.2} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150}}>
        <Caption world="night" {...sb.attention.b} align="center" size={48} delay={ATTN_FLASH + 40} exitAt={d - ATTN_FLASH - 75} />
      </AbsoluteFill>
      <Credit text={sb.attention.credit} delay={60} />
    </Night>
  );
};

// Ending: the two minds; then the dark closes in and a single point of light remains — and goes out.
const Minds: React.FC<{d: number}> = ({d}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const close = interpolate(f, [d - 110, d - 70], [0, 1], clamp);
  return (
    <Night>
      <TwoMinds digitiseAt={25} threadsAt={110} />
      <AbsoluteFill style={{background: palette.siliconNight, opacity: close}} />
      <LonePoint x={width / 2} y={height * 0.4} opacity={interpolate(f, [d - 80, d - 65, d - 40, d - 18], [0, 1, 1, 0], clamp)} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
        <Caption world="night" {...sb.twoMinds.a} align="center" delay={15} exitAt={100} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
        <Caption world="night" {...sb.twoMinds.b} align="center" delay={140} exitAt={95} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
        <Caption world="night" {...sb.twoMinds.c} align="center" size={56} delay={260} exitAt={d - 260 - 40} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 46, opacity: 1 - close}}>
        <FigureLabel world="night" credit={sb.twoMinds.credit} delay={200} />
      </AbsoluteFill>
    </Night>
  );
};

export const Main: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const cut = () => <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TRANSITION})} />;
  const S = (k: Parameters<typeof frames>[0], el: React.ReactNode) => <TransitionSeries.Sequence durationInFrames={frames(k)}>{el}</TransitionSeries.Sequence>;

  const keys = [
    {frame: startOf('neuron') + 40, year: 1888},
    {frame: startOf('logic') + 20, year: 1943},
    {frame: startOf('question') + 20, year: 1950},
    {frame: startOf('ignition') + 15, year: 1956},
    {frame: startOf('behavior') + 20, year: 1957},
    {frame: startOf('behavior') + BEH_SPLIT, year: 1959},
    {frame: startOf('hype') + 10, year: 1958},
    {frame: startOf('fall') + 10, year: 1969},
    {frame: startOf('fall') + FALL_NET + 20, year: 1974},
    {frame: startOf('room') + 20, year: 1980},
    {frame: startOf('thaw') + 20, year: 1986},
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
        {S('ch1', <Chapter k="ch1" world="paper" motif="microscope" />)}
        {cut()}
        {S('neuron', <Neuron d={frames('neuron')} />)}
        {cut()}
        {S('logic', <Logic d={frames('logic')} />)}
        {cut()}
        {S('ch2', <Chapter k="ch2" world="paper" motif="question" />)}
        {cut()}
        {S('question', <Question d={frames('question')} />)}
        {cut()}
        {S('ignition', <Ignition d={frames('ignition')} />)}
        {cut()}
        {S('ch3', <Chapter k="ch3" world="night" motif="fork" />)}
        {cut()}
        {S('behavior', <Behavior d={frames('behavior')} />)}
        {cut()}
        {S('seeing', <Seeing d={frames('seeing')} />)}
        {cut()}
        {S('ch4', <Chapter k="ch4" world="night" motif="snow" />)}
        {cut()}
        {S('hype', <Hype d={frames('hype')} />)}
        {cut()}
        {S('fall', <Fall d={frames('fall')} />)}
        {cut()}
        {S('room', <Room d={frames('room')} />)}
        {cut()}
        {S('thaw', <Thaw d={frames('thaw')} />)}
        {cut()}
        {S('ch5', <Chapter k="ch5" world="night" motif="burst" />)}
        {cut()}
        {S('bloom', <Bloom d={frames('bloom')} />)}
        {cut()}
        {S('go', <Go d={frames('go')} />)}
        {cut()}
        {S('attention', <Attention d={frames('attention')} />)}
        {cut()}
        {S('twoMinds', <Minds d={frames('twoMinds')} />)}
      </TransitionSeries>
      <YearTicker keys={keys} nightFrom={startOf('ignition') + 120} />
      {sb.music ? (
        <Audio src={staticFile(sb.music)} volume={(f) => interpolate(f, [0, FPS * 2, durationInFrames - FPS * 3, durationInFrames], [0, 0.8, 0.8, 0], clamp)} />
      ) : null}
    </AbsoluteFill>
  );
};
