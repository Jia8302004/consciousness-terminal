# 从心智之争到人工智能

2 分 40 秒、1080p 的 Remotion 视频。开场星空连成神经网络；前两章在旧纸上（卡哈尔的神经元、阈值单元、图灵的两扇门）；
1956 年达特茅斯提案页沉下，纸面沉入黑夜，墨线被点亮成光。之后是心智之争（斯金纳箱 vs. 乔姆斯基）、分层视觉、
寒冬与复苏（1958 感知机的狂热 → 1969 异或失败、灯灭、下雪 → 中文屋 → 1986 反向传播，冰层炸裂），最后是爆发（AlexNet、第 37 手、注意力、ChatGPT）。
五个章节各有一幕过场，画面上不叠章节标签。结尾以"它，真的理解吗？"和一个熄灭的光点收尾。

- `src/storyboard.ts`：所有文案（中文为主，英文为斜体小字）与每幕时长
- `src/Main.tsx`：20 个场景（含 5 个章节过场）的编排与年份读数
- `src/components/Imagery.tsx`：星空、章节过场、显微镜、两扇门、提案页、斯金纳箱、电极、感知机、异或平面、雪、冰裂、错误率、聊天窗口
- `src/components/NovelSentence.tsx`、`ChineseRoom.tsx`：新句子与中文屋
- `sources.md`：每条史实的出处
- `CUES.md`：配乐卡点表（三个高潮：0:48.8 点亮、1:51.3 冰裂、2:21.7 闪白）
- `out/ink-and-light.mp4`：成片（无声）

```bash
npm install
npx remotion studio                                # 预览
npx remotion still src/index.ts Main out/a.png --frame=3340 --scale=0.5
npx remotion render src/index.ts Main out/ink-and-light.mp4 --crf=18
```
在无法下载 Remotion 浏览器的环境中，加 `--browser-executable=<本地 chromium headless_shell 路径>`。
字体通过 @fontsource 打包到本地，渲染时不依赖网络。
