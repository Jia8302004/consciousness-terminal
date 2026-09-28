// Timing and words for the film. Edit here first.
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
    a: {zh: '你的大脑里，\n约有860亿个神经元。', en: 'Your brain holds some 86 billion neurons.'},
    b: {zh: '它们如何产生思想？\n机器，能复制这个过程吗？', en: 'How do they make thought? Could a machine do the same?'},
  },
  ch1: {seconds: 3.5, num: '第一章', title: '大脑是什么做的？', en: 'What is the brain made of?'},
  neuron: {
    seconds: 11,
    a: {zh: '19世纪末，西班牙医生卡哈尔在显微镜下，\n画出了一个个独立的神经元。', en: 'In the late 1800s, Santiago Ramón y Cajal drew, under the microscope, one separate neuron after another.'},
    b: {zh: '细胞之间隔着细小的缝隙，\n信号，就在缝隙间传递。', en: 'Between the cells lie tiny gaps — and signals leap across them.'},
    fig: {zh: '图一　神经元', credit: 'after S. Ramón y Cajal, c. 1890s'},
  },
  logic: {
    seconds: 11,
    a: {zh: '1943年，麦卡洛克和皮茨把神经元\n画成一个开关：信号够了，就放电。', en: '1943: McCulloch and Pitts drew the neuron as a switch — enough input, and it fires.'},
    b: {zh: '他们证明：这样的开关连成网络，\n能完成任何逻辑运算。大脑，第一次被写成了数学。', en: 'Networks of such switches can compute any logic. The brain was written as mathematics.'},
    fig: {zh: '图二　阈值单元', credit: 'after W. McCulloch & W. Pitts, 1943'},
  },
  ch2: {seconds: 3.5, num: '第二章', title: '机器能思考吗？', en: 'Can machines think?'},
  question: {
    seconds: 10,
    typed: 'Can machines think?',
    a: {zh: '1950年，英国数学家图灵在论文开篇发问：\n机器能思考吗？', en: '1950: Alan Turing opened a paper with a question — can machines think?'},
    b: {zh: '他提出一个游戏：隔着门和对方文字交谈，\n如果分不清门后是人还是机器——这就是“图灵测试”。', en: 'His game: talk in writing through a door. If you cannot tell human from machine — that is the Turing test.'},
    fig: {zh: '图三', credit: 'A. M. Turing, “Computing Machinery and Intelligence”, 1950'},
  },
  ignition: {
    seconds: 11,
    a: {zh: '1956年夏天，达特茅斯会议\n第一次提出了“人工智能”。', en: 'Summer 1956: the Dartmouth workshop first named “artificial intelligence”.'},
    b: {zh: '同年秋天，麻省理工的一场研讨会上，认知科学诞生。\n研究心智与制造机器，从此并肩前行。', en: 'That autumn, at an MIT symposium, cognitive science was born. Minds and machines now travelled together.'},
    page: 'A PROPOSAL FOR THE DARTMOUTH SUMMER RESEARCH PROJECT ON ARTIFICIAL INTELLIGENCE',
    credit: 'mccarthy, minsky, rochester & shannon, 1955 proposal  ·  mit symposium on information theory, 1956',
  },
  ch3: {seconds: 3.5, num: '第三章', title: '心智之争', en: 'The battle over the mind'},
  behavior: {
    seconds: 12,
    a: {zh: '心理学家斯金纳认为：心智只是“刺激—反应”，\n说话也不过是模仿、奖励、再重复。', en: 'Psychologist B. F. Skinner: the mind is stimulus and response; speech is imitation, reward, repetition.'},
    b: {zh: '1959年，乔姆斯基反驳：孩子能说出从没听过的句子，\n模仿解释不了——大脑里必有规则。', en: '1959: Noam Chomsky replied that children say sentences they never heard. The brain must have rules.'},
    sentence: '月亮把我的猫借走了',
    sentenceEn: '“the moon borrowed my cat”  (a sentence never heard before)',
    credit: 'skinner, verbal behavior, 1957  ·  chomsky, review, 1959',
  },
  seeing: {
    seconds: 10,
    a: {zh: '同年，休伯尔和威塞尔在猫的大脑里发现：\n有的细胞，只对特定方向的线条放电。', en: 'That year Hubel and Wiesel found cells in the cat’s brain that fire only for lines at one angle.'},
    b: {zh: '看见，是一层一层拼起来的。\n这张图纸，后来教会了机器“看”。', en: 'Seeing is assembled layer by layer — a blueprint that later taught machines to see.'},
    credit: 'hubel & wiesel, 1959  →  fukushima, 1980  →  lecun et al., 1989',
  },
  ch4: {seconds: 3.5, num: '第四章', title: '寒冬与复苏', en: 'Winter, and thaw'},
  hype: {
    seconds: 8,
    a: {zh: '1958年，罗森布拉特造出了会学习的“感知机”。', en: '1958: Frank Rosenblatt built the perceptron, a machine that learns.'},
    b: {zh: '报纸预言：它终将能走、能说、能看，\n甚至意识到自己的存在。', en: 'The press predicted it would walk, talk, see — even be conscious of its existence.'},
    quote: '“…walk, talk, see, write, reproduce itself and be conscious of its existence.”',
    credit: 'the new york times, 8 july 1958 (reporting the u.s. navy)',
  },
  fall: {
    seconds: 11,
    a: {zh: '1969年，明斯基和佩珀特证明：\n单层感知机，连“异或”都分不开。', en: '1969: Minsky and Papert proved a single-layer perceptron cannot even separate XOR.'},
    b: {zh: '资金撤走，灯一盏盏熄灭——\n神经网络，进入了十多年的寒冬。', en: 'Funding left. The lights went out one by one — a winter of more than a decade.'},
    credit: 'minsky & papert, perceptrons, 1969',
  },
  room: {
    seconds: 10,
    a: {zh: '寒冬里，“符号派”占了上风：智能就是规则。\n1980年，哲学家塞尔提出“中文屋”——', en: 'In the winter, symbols ruled: intelligence as rules. In 1980 John Searle proposed the Chinese Room —'},
    b: {zh: '照着规则摆弄中文的人，懂中文吗？\n只会处理符号的计算机，真的“理解”吗？', en: 'does someone following rules for Chinese understand Chinese? Does a symbol-shuffling computer understand?'},
    credit: 'searle, “minds, brains, and programs”, 1980',
  },
  thaw: {
    seconds: 11,
    a: {zh: '1986年，辛顿等人推广“反向传播”：\n把错误，一层层倒传回去——', en: '1986: Hinton and colleagues popularised backpropagation — send the error back, layer by layer —'},
    b: {zh: '冰层裂开了。多层网络学会了学习，\n“异或”，也迎刃而解。', en: 'The ice cracked. Multi-layer networks could learn — and XOR was solved.'},
    credit: 'rumelhart, hinton & williams, 1986',
  },
  ch5: {seconds: 3.5, num: '第五章', title: '爆发', en: 'The explosion'},
  bloom: {
    seconds: 8,
    a: {zh: '2012年，辛顿团队的AlexNet在图像识别大赛中，\n以约15%的错误率，远超第二名的26%。', en: '2012: Hinton’s team’s AlexNet won ImageNet with ~15% error; the runner-up had 26%.'},
    b: {zh: '深度学习，爆发了。', en: 'Deep learning exploded.'},
    credit: 'krizhevsky, sutskever & hinton, 2012',
  },
  go: {
    seconds: 8.5,
    a: {zh: '2016年，AlphaGo以4比1战胜李世石。', en: '2016: AlphaGo beat Lee Sedol, 4–1.'},
    b: {zh: '第37手，连职业棋手都一时看不懂。', en: 'Move 37 baffled professionals at first.'},
    credit: 'alphago vs. lee sedol, game 2, 2016  (board is illustrative)',
  },
  attention: {
    seconds: 13,
    a: {zh: '2017年，谷歌提出Transformer：\n让每个词都“注意”其他所有词。', en: '2017: Google researchers introduced the Transformer — every word attends to every other.'},
    b: {zh: '2022年，ChatGPT发布，两个月用户过亿。\n机器，开口说话了。', en: '2022: ChatGPT launched and passed 100 million users in two months. The machine began to speak.'},
    chatQ: '机器能思考吗？',
    chatA: '这是一个很古老的问题。一九五〇年，图灵……',
    credit: 'vaswani et al., 2017  →  chatgpt, 2022  (chat window is illustrative)',
    tokens: ['神经元', '卡哈尔', '缝隙', '开关', '图灵', 'Can', 'machines', 'think?', '1956', '刺激', '句子', '看见', '猫', '感知机', '异或', '冬天', '中文屋', '错误', '第37手', '注意'],
  },
  twoMinds: {
    seconds: 13,
    a: {zh: '从卡哈尔的一支笔，到会说话的机器，\n走过了一百多年。', en: 'From Cajal’s pen to machines that speak: more than a century.'},
    b: {zh: '符号与连接之争、中文屋的追问，\n至今没有答案。', en: 'Symbols versus connections, the Chinese Room — still unanswered.'},
    c: {zh: '它，真的理解吗？', en: 'Does it truly understand?'},
    credit: 'symbols vs. connections: fodor & pylyshyn, 1988 — still debated',
  },
};

export const order = ['coldOpen', 'ch1', 'neuron', 'logic', 'ch2', 'question', 'ignition', 'ch3', 'behavior', 'seeing', 'ch4', 'hype', 'fall', 'room', 'thaw', 'ch5', 'bloom', 'go', 'attention', 'twoMinds'] as const;
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
