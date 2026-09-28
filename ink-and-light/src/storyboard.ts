// Timing + words for "墨与光 / Ink and Light". Edit here first.
// Rules (see references/narrative.md): the main caption carries an idea or a question;
// names and years live in the small figure labels and the year ticker — never a list of names on screen.
// Every factual claim is sourced in ../sources.md.

export type Line = {zh: string; en: string};
export const FPS = 30;
export const TRANSITION = 20;

export const sb = {
  music: null as string | null, // e.g. 'music.mp3' in public/ (you must hold the rights)

  coldOpen: {
    seconds: 7.5,
    a: {zh: '你的大脑里，\n约有860亿个神经元。', en: 'Your brain holds some 86 billion neurons.'},
    b: {zh: '它们如何产生思想？\n机器，能复制这个过程吗？', en: 'How do they make thought? Could a machine do the same?'},
  },
  neuron: {
    seconds: 9.5,
    chapter: '第一章　大脑是什么做的？',
    a: {zh: '19世纪末，西班牙医生卡哈尔\n用染色法画出了神经元。', en: 'In the late 1800s, Santiago Ramón y Cajal stained brain tissue and drew its neurons.'},
    b: {zh: '他发现：大脑由无数独立的细胞组成，\n细胞之间隔着细小的缝隙。', en: 'The brain, he found, is made of separate cells divided by tiny gaps.'},
    fig: {zh: '图一　神经元', credit: 'after S. Ramón y Cajal, c. 1890s'},
  },
  logic: {
    seconds: 10,
    a: {zh: '1943年，麦卡洛克和皮茨把神经元\n简化成开关：信号够了，就放电。', en: '1943: McCulloch and Pitts modelled a neuron as a switch that fires past a threshold.'},
    b: {zh: '他们证明：这样的开关连成网络，\n能完成任何逻辑运算。', en: 'Networks of such switches, they showed, can compute any logical function.'},
    fig: {zh: '图二　阈值单元', credit: 'after W. McCulloch & W. Pitts, 1943'},
  },
  question: {
    seconds: 7,
    chapter: '第二章　机器能思考吗？',
    typed: 'Can machines think?',
    a: {zh: '1950年，英国数学家图灵发问：机器能思考吗？\n他提出了著名的“图灵测试”。', en: '1950: Alan Turing asked whether machines can think, and proposed the Turing test.'},
    fig: {zh: '图三', credit: 'A. M. Turing, “Computing Machinery and Intelligence”, 1950'},
  },
  ignition: {
    seconds: 8.8333,
    a: {zh: '1956年，达特茅斯会议提出“人工智能”，\n认知科学也在同年诞生。', en: '1956: the Dartmouth workshop named “artificial intelligence”; cognitive science was born the same year.'},
    credit: 'dartmouth & mit, 1956',
  },
  behavior: {
    seconds: 10.5,
    chapter: '第三章　心智之争',
    a: {zh: '心理学家斯金纳认为：\n心智只是“刺激—反应”。', en: 'The psychologist B. F. Skinner held that the mind is just stimulus and response.'},
    b: {zh: '1959年，乔姆斯基反驳：孩子能说出\n从没听过的句子，大脑里必有规则。', en: '1959: Noam Chomsky replied that children say sentences they never heard — the brain must have rules.'},
    sentence: '月亮把我的猫借走了',
    sentenceEn: '“the moon borrowed my cat”  (a sentence never heard before)',
    credit: 'chomsky, review of skinner’s “verbal behavior”, 1959',
  },
  seeing: {
    seconds: 8.5,
    a: {zh: '同年，休伯尔和威塞尔在猫的大脑中发现：\n视觉是一层层拼起来的。', en: 'That year Hubel and Wiesel found, in the cat’s brain, that vision is built up in layers.'},
    b: {zh: '这启发了后来识别图像的神经网络。', en: 'It inspired the image-recognising networks that came later.'},
    credit: 'hubel & wiesel, 1959  →  fukushima, 1980  →  lecun et al., 1989',
  },
  winter: {
    seconds: 8.5,
    chapter: '第四章　寒冬与复苏',
    a: {zh: '1969年，明斯基和佩珀特证明：\n单层感知机连“异或”都学不会。', en: '1969: Minsky and Papert proved a single-layer perceptron cannot even learn XOR.'},
    b: {zh: '神经网络，陷入十多年的寒冬。', en: 'Neural networks fell into a winter that lasted more than a decade.'},
    credit: 'minsky & papert, perceptrons, 1969',
  },
  room: {
    seconds: 9.5,
    a: {zh: '1980年，哲学家塞尔提出“中文屋”：\n只会照规则摆弄中文的人，懂中文吗？', en: '1980: John Searle’s Chinese Room — does someone following rules for Chinese understand Chinese?'},
    b: {zh: '那么，计算机真的“理解”吗？', en: 'And does a computer really understand?'},
    credit: 'searle, “minds, brains, and programs”, 1980  (the chinese room)',
  },
  thaw: {
    seconds: 8.5,
    a: {zh: '1986年，辛顿等人推广“反向传播”：\n把错误一层层倒传回去，网络学会了学习。', en: '1986: Hinton and colleagues popularised backpropagation — send the error back, layer by layer.'},
    credit: 'rumelhart, hinton & williams, 1986',
  },
  bloom: {
    seconds: 6.5,
    chapter: '第五章　爆发',
    a: {zh: '2012年，辛顿团队的AlexNet\n在图像识别大赛中遥遥领先，深度学习爆发。', en: '2012: Hinton’s team won ImageNet by a wide margin with AlexNet. Deep learning took off.'},
    counter: {from: 1, to: 60_000_000, unit: 'parameters in alexnet, 2012'},
    credit: 'krizhevsky, sutskever & hinton, 2012',
  },
  go: {
    seconds: 6.5,
    a: {zh: '2016年，AlphaGo以4比1战胜李世石。\n第37手，连职业棋手一时都没看懂。', en: '2016: AlphaGo beat Lee Sedol 4–1. Its move 37 baffled professionals at first.'},
    credit: 'alphago vs. lee sedol, game 2, 2016  (board is illustrative)',
  },
  attention: {
    seconds: 11,
    a: {zh: '2017年，谷歌提出Transformer：\n让每个词都“注意”其他所有词。', en: '2017: Google researchers introduced the Transformer — every word attends to every other.'},
    b: {zh: '2022年，ChatGPT发布，\n机器开口说话了。', en: '2022: ChatGPT was released. The machine began to speak.'},
    credit: 'vaswani et al., 2017  →  chatgpt, 2022',
    // callbacks: words from earlier scenes, now all attending to each other
    tokens: ['神经元', '卡哈尔', '缝隙', '开关', '图灵', 'Can', 'machines', 'think?', '1956', '刺激', '句子', '看见', '猫', '异或', '冬天', '中文屋', '错误', '第37手', '词', '注意'],
  },
  twoMinds: {
    seconds: 12,
    chapter: '尾声',
    a: {zh: '从卡哈尔到ChatGPT，\n走过了一百多年。', en: 'From Cajal to ChatGPT: more than a century.'},
    b: {zh: '乔姆斯基、塞尔的追问，符号与连接之争，\n至今没有答案。', en: 'Chomsky’s and Searle’s questions, symbols versus connections — still unresolved.'},
    c: {zh: '它，真的理解吗？', en: 'Does it truly understand?'},
    credit: 'symbols vs. connections: fodor & pylyshyn, 1988 — still debated',
  },
  title: {
    seconds: 5,
    title: '墨与光',
    subtitle: '从心智之争到人工智能',
    subtitleEn: 'Ink and Light: from the debates about mind to artificial minds',
  },
};

export const order = ['coldOpen', 'neuron', 'logic', 'question', 'ignition', 'behavior', 'seeing', 'winter', 'room', 'thaw', 'bloom', 'go', 'attention', 'twoMinds', 'title'] as const;
export type SceneKey = (typeof order)[number];
export const frames = (k: SceneKey) => Math.round(sb[k].seconds * FPS);
// absolute start frame of each scene inside the TransitionSeries
export const startOf = (k: SceneKey) => {
  let f = 0;
  for (const s of order) {
    if (s === k) return f;
    f += frames(s) - TRANSITION;
  }
  return f;
};
export const totalFrames = order.reduce((a, k) => a + frames(k), 0) - TRANSITION * (order.length - 1);

// every string drawn on screen, used to preload the split Chinese font subsets
const collect = (o: unknown): string => (typeof o === 'string' ? o : o && typeof o === 'object' ? Object.values(o).map(collect).join('') : '');
export const allText = Array.from(new Set(Array.from(collect(sb) + '0123456789，。？：“”—图一二三'))).join('');
