/**
 * PNG の「画像外周に繋がる近白ピクセル」を透明化（バッジ外の白背景用）。
 * 使い方: node scripts/make-badge-transparent.mjs <入力.png> <出力.png>
 */
import sharp from "sharp";
import { argv } from "node:process";

const [,, input, output] = argv;
if (!input || !output) {
  console.error("Usage: node scripts/make-badge-transparent.mjs <in.png> <out.png>");
  process.exit(1);
}

const WHITE = 245;
const MIN_A = 200;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const buf = Buffer.from(data);

const idx = (x, y) => (y * w + x) * 4;
const seen = new Uint8Array(w * h);
const stack = [];

function isNearWhite(i) {
  return buf[i + 3] >= MIN_A && buf[i] >= WHITE && buf[i + 1] >= WHITE && buf[i + 2] >= WHITE;
}

for (let x = 0; x < w; x++) {
  stack.push([x, 0], [x, h - 1]);
}
for (let y = 0; y < h; y++) {
  stack.push([0, y], [w - 1, y]);
}

while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= w || y >= h) continue;
  const p = y * w + x;
  if (seen[p]) continue;
  const i = idx(x, y);
  if (!isNearWhite(i)) continue;
  seen[p] = 1;
  buf[i + 3] = 0;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
  .png()
  .toFile(output);

console.log("Wrote", output);
