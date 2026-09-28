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
    seconds: 8,
    a: {zh: '你读到这行字的时候，\n脑中无数个细胞正在放电。', en: 'As you read this line, countless cells in your brain are firing.'},
    b: {zh: '它们，能被写成\n一台机器吗？', en: 'Could they be written down as a machine?'},
  },
  neuron: {
    seconds: 10,
    a: {zh: '一百多年前，有人把它们\n一笔一笔画了下来。', en: 'Over a century ago, someone drew them, line by line.'},
    b: {zh: '它们彼此分离，\n中间隔着一道极窄的缝隙。', en: 'Separate cells, divided by the narrowest of gaps.'},
    fig: {zh: '图一　神经元', credit: 'after S. Ramón y Cajal, c. 1890s'},
  },
  logic: {
    seconds: 9,
    a: {zh: '假如细胞只做一件事：\n攒够了，就放电。', en: 'Suppose a cell does one thing: when it has enough, it fires.'},
    b: {zh: '那么，一群这样的细胞，\n能不能计算？', en: 'Could a crowd of such cells compute?'},
    fig: {zh: '图二　阈值单元', credit: 'after W. McCulloch & W. Pitts, 1943'},
  },
  question: {
    seconds: 8,
    typed: 'Can machines think?',
    a: {zh: '有人把这个问题，\n写进了一篇论文的第一句。', en: 'Someone made it the opening question of a paper.'},
    fig: {zh: '图三', credit: 'A. M. Turing, “Computing Machinery and Intelligence”, 1950'},
  },
  ignition: {
    seconds: 9,
    a: {zh: '研究心智的人，和制造机器的人，\n走进了同一个房间。', en: 'Those who study minds and those who build machines walked into the same room.'},
    credit: 'dartmouth & mit, 1956',
  },
  behavior: {
    seconds: 9,
    a: {zh: '有人说，心智不过是\n刺激与反应。', en: 'Some said the mind is nothing but stimulus and response.'},
    b: {zh: '可一个孩子，怎么能说出\n他从没听过的句子？', en: 'Then how does a child say sentences no one ever taught it?'},
    sentence: '月亮把我的猫借走了',
    sentenceEn: '“the moon borrowed my cat”  (a sentence never heard before)',
    credit: 'chomsky, review of skinner’s “verbal behavior”, 1959',
  },
  seeing: {
    seconds: 10,
    a: {zh: '他们在猫的大脑里发现：\n看见，是一层一层拼起来的。', en: "In a cat's brain they found that seeing is assembled, layer by layer."},
    b: {zh: '后来，机器照着这张图纸，\n学会了看。', en: 'Later, machines learned to see from the same blueprint.'},
    credit: 'hubel & wiesel, 1959  →  fukushima, 1980  →  lecun et al., 1989',
  },
  winter: {
    seconds: 8,
    a: {zh: '一本书冷冷地证明：\n最简单的网络，连“异或”都学不会。', en: 'A book proved, coldly, that the simplest networks could not even learn XOR.'},
    b: {zh: '然后，是漫长的冬天。', en: 'Then came a long winter.'},
    credit: 'minsky & papert, perceptrons, 1969',
  },
  room: {
    seconds: 9,
    a: {zh: '屋里的人照着规则回答中文，\n却一个字也不懂。', en: 'The man in the room answers in Chinese by the rules, understanding not a word.'},
    b: {zh: '会摆弄符号，\n就等于理解吗？', en: 'Is shuffling symbols the same as understanding?'},
    credit: 'searle, “minds, brains, and programs”, 1980  (the chinese room)',
  },
  thaw: {
    seconds: 8,
    a: {zh: '直到一个朴素的想法：\n把错误，倒着传回去。', en: 'Until a simple idea: send the error backwards.'},
    credit: 'rumelhart, hinton & williams, 1986',
  },
  bloom: {
    seconds: 7,
    a: {zh: '于是，网络开始疯长。', en: 'And the networks began to grow.'},
    counter: {from: 1, to: 60_000_000, unit: 'parameters in alexnet, 2012'},
    credit: 'krizhevsky, sutskever & hinton, 2012',
  },
  go: {
    seconds: 8,
    a: {zh: '第37手。\n连职业棋手，一时都没看懂。', en: 'Move 37. Even professionals could not read it at first.'},
    credit: 'alphago vs. lee sedol, game 2, 2016  (board is illustrative)',
  },
  attention: {
    seconds: 13,
    a: {zh: '后来，机器学会了\n同时注视每一个词。', en: 'Then machines learned to attend to every word at once.'},
    b: {zh: '然后，它开口说话了。', en: 'And then it began to speak.'},
    credit: 'vaswani et al., 2017  →  chatgpt, 2022',
    // callbacks: words from earlier scenes, now all attending to each other
    tokens: ['你', '机器', '细胞', '墨', '缝隙', '放电', '计算', 'Can', 'machines', 'think?', '房间', '句子', '看见', '猫', '冬天', '符号', '错误', '第37手', '词', '注意'],
  },
  twoMinds: {
    seconds: 15,
    a: {zh: '我们花了一百多年，\n想弄懂大脑怎样产生思想。', en: 'We spent over a century trying to understand how a brain makes a mind.'},
    b: {zh: '如今，我们造出了会“思考”的东西，\n却同样说不清，它在想什么。', en: "Now we have built things that 'think', and we still cannot say what goes on inside."},
    c: {zh: '它理解吗？\n符号与连接，哪一个才是心智？', en: 'Does it understand? Symbols or connections — which is the mind?'},
    credit: 'symbols vs. connections: fodor & pylyshyn, 1988 — still debated',
  },
  title: {
    seconds: 7,
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
