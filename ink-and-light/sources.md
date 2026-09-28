# 《墨与光：从心智之争到人工智能》史实出处

每条对应 `src/storyboard.ts` 里的一句文案或一个图注。改文案时同步更新本文件。
叙事结构、全部中英文文案、"墨与光"视觉概念与配色字体为 skill 作者（Claude）的原创设计。

| 场景 | 文案/画面中的事实 | 出处 |
|---|---|---|
| 冷开场 | 大脑约有 860 亿个神经元 | F. A. C. Azevedo et al. (2009), "Equal numbers of neuronal and nonneuronal cells make the human brain an isotropically scaled-up primate brain", *Journal of Comparative Neurology* 513（约 860 亿） |
| 神经元 | 一百多年前有人把神经元一笔一笔画下来 | Santiago Ramón y Cajal 用高尔基染色法观察并手绘神经组织（1888 年起），与 Camillo Golgi 共获 1906 年诺贝尔生理学或医学奖 |
| 神经元 | 神经元彼此分离，中间隔着缝隙 | 卡哈尔提出的神经元学说；"突触"一词由 C. S. Sherrington 于 1897 年提出；突触间隙在 1950 年代由电子显微镜证实（如 Palay & Palade、De Robertis & Bennett, 1954–55） |
| 神经元 | 画面中的神经元 | 程序生成，风格仿卡哈尔手绘，并非复制其原图 |
| 阈值单元 | 细胞"攒够了就放电"；这种单元组成的网络能计算 | W. S. McCulloch & W. Pitts (1943), "A Logical Calculus of the Ideas Immanent in Nervous Activity", *Bulletin of Mathematical Biophysics* 5 |
| 图灵之问 | "Can machines think?" 是论文开篇的问题；提出图灵测试 | A. M. Turing (1950), "Computing Machinery and Intelligence", *Mind* 59(236)，首句即提出考虑这个问题；文中提出的"模仿游戏"即后来所称的图灵测试 |
| 1956 | 研究心智的人和制造机器的人走到一起 | 1956 年夏达特茅斯会议（"artificial intelligence" 一词出自 McCarthy、Minsky、Rochester、Shannon 1955 年的会议提案）；George A. Miller 在 "The cognitive revolution: a historical perspective"（*Trends in Cognitive Sciences*, 2003）中把认知科学的诞生定在 1956 年 9 月 11 日 MIT 信息论研讨会。"走进同一个房间"是修辞 |
| 心智之争 | 斯金纳认为心智只是"刺激—反应"；1959 年乔姆斯基反驳：孩子能说出从没听过的句子，大脑里必有规则 | 行为主义代表 B. F. Skinner, *Verbal Behavior* (1957)；N. Chomsky (1959), "A Review of B. F. Skinner's Verbal Behavior", *Language* 35(1)，以语言的创造性（能产出和理解新句子）批评刺激-反应解释，常被视为认知革命的标志之一 |
| 心智之争 | 画面中的句子“月亮把我的猫借走了” | 为本片虚构的示意句，用来表示“从没听过的新句子”，并非乔姆斯基原文中的例句 |
| 分层视觉 | 在猫的大脑里发现视觉由简单特征逐层组合 | D. H. Hubel & T. N. Wiesel (1959), *Journal of Physiology* 148；1962 年论文提出简单/复杂细胞层级；二人获 1981 年诺贝尔奖 |
| 分层视觉 | 机器照着这张图纸学会了看 | K. Fukushima (1980), "Neocognitron", *Biological Cybernetics* 36（明确受 Hubel–Wiesel 启发）；Y. LeCun et al. (1989), "Backpropagation Applied to Handwritten Zip Code Recognition", *Neural Computation* 1 |
| 寒冬 | 一本书证明最简单的网络连“异或”都学不会 | M. Minsky & S. Papert, *Perceptrons* (1969) 证明单层感知机无法表示异或（XOR）等线性不可分函数；多层网络不受此限，但当时缺乏有效的训练方法 |
| 寒冬 | 漫长的冬天 | 通常指 1970 年代的第一次 AI 寒冬；M. Minsky & S. Papert, *Perceptrons* (1969) 与英国 Lighthill 报告 (1973) 常被视为诱因。年份读数 1969 对应《Perceptrons》 |
| 中文屋 | 屋里的人照规则回答中文却不懂中文；会摆弄符号是否等于理解 | J. R. Searle (1980), "Minds, Brains, and Programs", *Behavioral and Brain Sciences* 3(3)。卡片上的问答为示意。片中只提问，不对思想实验下结论 |
| 回流 | 把错误倒着传回去 | D. E. Rumelhart, G. E. Hinton & R. J. Williams (1986), "Learning representations by back-propagating errors", *Nature* 323。反向传播的数学思想更早已有人提出（如 S. Linnainmaa 1970、P. Werbos 1974），1986 年论文使其在神经网络中广为采用 |
| 疯长 | AlexNet 在图像识别大赛中遥遥领先（top-5 错误率约 15.3%，第二名约 26.2%）；约 6000 万参数 | A. Krizhevsky, I. Sutskever & G. E. Hinton (2012), "ImageNet Classification with Deep Convolutional Neural Networks", NeurIPS（文中称约 6000 万参数） |
| 第 37 手 | AlphaGo 以 4 比 1 战胜李世石；第 37 手连职业棋手一时都没看懂 | 2016 年 3 月 AlphaGo 对李世石第二局第 37 手，当时解说与职业棋手普遍感到意外；DeepMind 相关报道与 D. Silver et al. (2016), *Nature* 529 描述了 AlphaGo 系统。棋盘为示意，并非真实棋局 |
| 注意力 | 2017 年谷歌研究者提出 Transformer，每个词"注意"其他所有词 | A. Vaswani et al. (2017), "Attention Is All You Need", NeurIPS（Transformer 与自注意力）。画面中的注意力权重为示意 |
| 注意力 | 它开口说话了 | OpenAI 于 2022 年 11 月 30 日发布 ChatGPT。"开口说话"是修辞 |
| 两个大脑 | 我们仍说不清它在想什么 | 大模型可解释性仍是开放研究问题（修辞性概括） |
| 两个大脑 | 它理解吗？符号与连接，哪一个才是心智？ | 开放问题，片中不作结论。符号主义与联结主义之争：J. A. Fodor & Z. W. Pylyshyn (1988), "Connectionism and cognitive architecture: A critical analysis", *Cognition* 28；P. Smolensky (1988), "On the proper treatment of connectionism", *Behavioral and Brain Sciences* 11 等回应。相关讨论：J. Searle (1980) "Minds, Brains, and Programs"（中文屋）；T. Nagel (1974) "What Is It Like to Be a Bat?"；D. Chalmers (1995) "Facing Up to the Problem of Consciousness"（困难问题） |
| 两个大脑 | 大脑点云 | 程序生成，非真实脑扫描数据 |
