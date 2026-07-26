/**
 * Hinh khoi logo dung chung cho favicon va anh og.
 *
 * Toa do phai khop voi src/components/Logo.tsx — sua mot ben thi sua ca ben kia,
 * neu khong logo tren trang va logo tren tab trinh duyet se lech nhau.
 */

export const OUTLINE =
  'M9 1.25 H22.4 L30.75 9.6 V23 A7.75 7.75 0 0 1 23 30.75 H9 A7.75 7.75 0 0 1 1.25 23 V9 A7.75 7.75 0 0 1 9 1.25 Z';
export const CHEVRON = 'M9.6 11.9 L14.2 16.5 L9.6 21.1';
// Con tro nam thap hon dinh duoi cua chevron mot chut: bam sat qua thi doc ra `>-`
// thay vi `>_`, mat cam giac dau nhac lenh terminal.
export const CURSOR = { x: 16.4, y: 19.4, w: 6.8, h: 2.5, r: 1.25 };

/**
 * @param {object} o
 * @param {string} o.fill      mau nen con chip
 * @param {string} o.stroke    mau vien con chip (de 'none' neu khong can)
 * @param {string} o.glyph     mau dau nhac lenh
 * @param {number} [o.scale]   he so phong to, mac dinh 1 (viewBox 32x32)
 */
export function markSvg({ fill, stroke, glyph, scale = 1 }) {
  const s = 32 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 32 32">
  <path d="${OUTLINE}" fill="${fill}"${stroke === 'none' ? '' : ` stroke="${stroke}" stroke-width="1.5"`}/>
  <path d="${CHEVRON}" fill="none" stroke="${glyph}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="${CURSOR.x}" y="${CURSOR.y}" width="${CURSOR.w}" height="${CURSOR.h}" rx="${CURSOR.r}" fill="${glyph}"/>
</svg>`;
}

export const COLORS = {
  bg: '#0b0e14',
  surface: '#10141c',
  line: '#1e2430',
  fg: '#e6eaf2',
  muted: '#94a0b3',
  accent: '#4ade80',
  onAccent: '#06130b',
};
