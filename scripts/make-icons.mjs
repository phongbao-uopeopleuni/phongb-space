/**
 * Sinh favicon va apple-touch-icon tu cung hinh khoi logo.
 *
 * Chay: npm run icons
 *
 * Bien the mau khac trang: o co 16px, con chip nen toi + glyph xanh gan nhu bien mat
 * tren tab trinh duyet. Nen favicon dung nen mau nhan + glyph toi cho tuong phan manh.
 */
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { COLORS, markSvg } from './logo-shape.mjs';

const PUBLIC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public');

// Bien the tab: nen xanh nhan dac, glyph mau toi — noi bat tren ca theme sang va toi
const iconSvg = markSvg({ fill: COLORS.accent, stroke: 'none', glyph: COLORS.onAccent });

// Bien the trong trang: chip toi, vien manh, glyph xanh — khop voi giao dien
const inlineSvg = markSvg({ fill: COLORS.surface, stroke: COLORS.line, glyph: COLORS.accent });

const outputs = [
  // SVG la favicon chinh: net o moi co, trinh duyet hien dai deu doc duoc
  { file: 'favicon.svg', svg: iconSvg },
  { file: 'logo-mark.svg', svg: inlineSvg },
  // PNG du phong cho trinh duyet cu va cho Zalo/Facebook khi lay icon trang
  { file: 'favicon-32.png', svg: iconSvg, size: 32 },
  { file: 'favicon-192.png', svg: iconSvg, size: 192 },
  // apple-touch-icon khong ho tro trong suot, nen phai la PNG dac
  { file: 'apple-touch-icon.png', svg: iconSvg, size: 180 },
];

for (const out of outputs) {
  const path = resolve(PUBLIC_DIR, out.file);

  if (!out.size) {
    await writeFile(path, out.svg, 'utf8');
    console.log(`${out.file} (svg)`);
    continue;
  }

  const png = await sharp(Buffer.from(out.svg), { density: 384 })
    .resize(out.size, out.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(path, png);
  console.log(`${out.file} (${out.size}x${out.size}, ${(png.length / 1024).toFixed(1)} KB)`);
}

console.log(`-> ${PUBLIC_DIR}`);
