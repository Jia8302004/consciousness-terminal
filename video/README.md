# 心智之问 → 智能革命

一段约 2 分钟的 1080p 动画，讲述从认知科学的争论到人工智能革命爆发的历史线索（1943—2022）。

- `scene.html`：动画场景。所有画面都由 `setTime(t)` 决定，直接用浏览器打开就能实时预览。
- `render.mjs`：用 Playwright 逐帧截图，交给 ffmpeg 编码成 MP4。
- `out/mind-to-machine.mp4`：渲染好的成片。

```bash
node render.mjs --stills 10,60,110   # 导出指定秒数的截图，用于预览
FFMPEG=/path/to/ffmpeg node render.mjs   # 完整渲染
```

修改内容：编辑 `scene.html` 里的 `EVENTS`（事件）、`ACTS`（幕）、`LINKS`（启发连线）即可。
