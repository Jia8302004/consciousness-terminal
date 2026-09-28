# 墨与光：从心智之争到人工智能

2 分 00 秒、1080p 的 Remotion 视频。开场是旧纸上的墨线神经元，1956 年纸面沉入黑夜，墨线被点亮成光。
全片沿一根悬念线展开："放电的细胞，能被写成一台机器吗？"途中经过三场心智之争：行为主义与认知主义、《感知机》引发的寒冬、中文屋；
每一幕都写清人物、年份和事件，并以章节标签分为五章；结尾以"它，真的理解吗？"收尾。

- `src/storyboard.ts`：所有文案（中文为主，英文为斜体小字）与每幕时长
- `src/Main.tsx`：15 个场景的编排与年份读数
- `src/components/NovelSentence.tsx`、`ChineseRoom.tsx`：为"争论"线新增的两个场景组件
- `sources.md`：每条史实的出处
- `CUES.md`：配乐卡点表（两个"大声"时刻：0:35.5 点亮、1:40.8 闪白）
- `out/ink-and-light.mp4`：成片（无声）

```bash
npm install
npx remotion studio                                # 预览
npx remotion still src/index.ts Main out/a.png --frame=1420 --scale=0.5
npx remotion render src/index.ts Main out/ink-and-light.mp4 --crf=18
```
在无法下载 Remotion 浏览器的环境中，加 `--browser-executable=<本地 chromium headless_shell 路径>`。
字体通过 @fontsource 打包到本地，渲染时不依赖网络。
