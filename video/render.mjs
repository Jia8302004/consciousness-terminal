// 逐帧渲染 scene.html → MP4
// 用法：
//   node render.mjs                      # 完整渲染到 out/mind-to-machine.mp4
//   node render.mjs --stills 3,20,60     # 只导出指定秒数的截图，用于预览
// 依赖：playwright（Chromium）、ffmpeg（可用 FFMPEG 环境变量指定路径）
import { createRequire } from "node:module";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  const globalRoot = execSync("npm root -g").toString().trim();
  ({ chromium } = require(path.join(globalRoot, "playwright")));
}

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "out");
mkdirSync(outDir, { recursive: true });

const args = process.argv.slice(2);
const stillsArg = args.includes("--stills") ? args[args.indexOf("--stills") + 1] : null;
const FPS = Number(process.env.FPS || 30);
const FFMPEG = process.env.FFMPEG || "ffmpeg";

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch({
  args: ["--ignore-certificate-errors-spki-list", "--font-render-hinting=none"],
  ...(proxy ? { proxy: { server: proxy } } : {}),
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, "scene.html")).href + "?render");
await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
const fontsOk = await page.evaluate(() => document.fonts.check('900 40px "Noto Serif SC"', "心智"));
console.log(`字体加载：${fontsOk ? "Noto 字体" : "回退到本地字体"}`);
const duration = await page.evaluate(() => window.DURATION);

if (stillsArg) {
  for (const s of stillsArg.split(",").map(Number)) {
    await page.evaluate((t) => window.setTime(t), s);
    const file = path.join(outDir, `still-${String(s).padStart(5, "0")}.png`);
    await page.screenshot({ path: file });
    console.log("已导出", file);
  }
  await browser.close();
  process.exit(0);
}

const total = Math.ceil(duration * FPS);
const outFile = path.join(outDir, "mind-to-machine.mp4");
console.log(`时长 ${duration.toFixed(1)}s，共 ${total} 帧 → ${outFile}`);

const ff = spawn(FFMPEG, [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", outFile,
], { stdio: ["pipe", "inherit", "inherit"] });

const t0 = Date.now();
for (let i = 0; i < total; i++) {
  await page.evaluate((t) => window.setTime(t), i / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % (FPS * 5) === 0) {
    const el = (Date.now() - t0) / 1000;
    console.log(`帧 ${i}/${total}  (${el.toFixed(0)}s)`);
  }
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("完成：", outFile);
