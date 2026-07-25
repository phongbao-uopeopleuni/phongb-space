/**
 * Sinh anh xem truoc public/og-image.png (1200x630) tu SVG bang sharp.
 *
 * Chay: npm run og
 *
 * Vi sao phai la PNG that thay vi SVG hay data URI: crawler cua Facebook, Zalo va
 * LinkedIn khong render SVG va khong doc data URI. Chung tai mot file anh bitmap
 * qua URL tuyet doi, khong hon.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;

// Dung dung bang mau cua design system
const C = {
  bg: '#0b0e14',
  surface: '#10141c',
  line: '#1e2430',
  fg: '#e6eaf2',
  muted: '#94a0b3',
  accent: '#4ade80',
};

/**
 * Chi dinh ten font cu the, KHONG dung alias 'sans-serif' / 'monospace': librsvg tra
 * alias qua fontconfig, va o weight 400 no de roi vao mot font serif khong co glyph
 * dau tieng Viet — chu bi thay the tung ky tu, trong rat chap va.
 * Neu render tren may khac (Linux/macOS) ma chu doi kieu, them ten font co san o day.
 */
const SANS = 'Segoe UI, Arial, Helvetica, DejaVu Sans, sans-serif';
const MONO = 'Consolas, Courier New, DejaVu Sans Mono, monospace';

/** Escape ky tu XML — ten va tieu de co dau tieng Viet, khong duoc de lot & < > */
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TITLE_LINES = ['Thiết kế website cho', 'nhà hàng, homestay', 'và tiệm dịch vụ'];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <!-- Luoi mo dang blueprint, giong nen hero cua trang -->
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="${C.muted}" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <mask id="gridMask">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/>
    </mask>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" mask="url(#gridMask)"/>

  <!-- Khung terminal -->
  <rect x="64" y="56" width="${WIDTH - 128}" height="${HEIGHT - 112}" rx="16"
        fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>

  <!-- Thanh tieu de gia cua terminal -->
  <line x1="64" y1="112" x2="${WIDTH - 64}" y2="112" stroke="${C.line}" stroke-width="2"/>
  <circle cx="100" cy="84" r="6" fill="${C.line}"/>
  <circle cx="122" cy="84" r="6" fill="${C.line}"/>
  <circle cx="144" cy="84" r="6" fill="${C.accent}"/>
  <text x="180" y="90" font-family="${MONO}" font-size="18" fill="${C.muted}">bao-phong</text>

  <!-- Nhan phu de dang comment code -->
  <text x="112" y="176" font-family="${MONO}" font-size="22" fill="${C.accent}">// thiet-ke-website</text>

  <!-- Tieu de chinh -->
  ${TITLE_LINES.map(
    (line, i) =>
      `<text x="112" y="${248 + i * 62}" font-family="${SANS}" font-size="54" font-weight="700" fill="${C.fg}">${esc(line)}</text>`,
  ).join('\n  ')}

  <!--
    Dong so lieu dung sans-serif, KHONG dung monospace: font mono mac dinh cua may
    render thuong thieu glyph dau tieng Viet nen bi thay the tung ky tu, trong rat chap va.
    Monospace chi danh cho phan ASCII (// comment, $ lenh, bao-phong).
    Viet lien mot dong: SVG khong gop khoang trang/xuong dong nhu HTML.
  -->
  <text x="112" y="470" font-family="${SANS}" font-size="24" fill="${C.muted}"><tspan fill="${C.accent}" font-weight="600">5</tspan> website đã bàn giao<tspan fill="${C.muted}" opacity="0.5">&#160;·&#160;</tspan><tspan fill="${C.accent}" font-weight="600">2</tspan> quốc gia<tspan fill="${C.muted}" opacity="0.5">&#160;·&#160;</tspan>Việt Nam &amp; Hoa Kỳ</text>

  <!-- Dong lien he + con tro terminal (ve tinh) -->
  <text x="112" y="524" font-family="${MONO}" font-size="22" fill="${C.fg}"><tspan fill="${C.accent}">$</tspan> zalo 077 575 3003</text>
  <rect x="368" y="506" width="10" height="24" fill="${C.accent}"/>
</svg>`;

await mkdir(dirname(OUT), { recursive: true });

// `density` cao hon mac dinh de chu khong bi ram khi rasterize
const png = await sharp(Buffer.from(svg), { density: 144 })
  .resize(WIDTH, HEIGHT, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(OUT, png);

console.log(`og-image.png da tao: ${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB`);
console.log(`-> ${OUT}`);
