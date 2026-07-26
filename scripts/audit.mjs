/**
 * Chay Lighthouse tren ban build production dang duoc `npm run preview` phuc vu.
 *
 * Chay:  npm run build   (nen dat GITHUB_PAGES=true de giong ban deploy)
 *        npm run preview (o mot cua so khac)
 *        npm run audit
 *
 * Luu y khi doc ket qua: day la localhost, khong co do tre mang that va khong qua
 * CDN nhu GitHub Pages, nen diem tuyet doi se dep hon PageSpeed Insights. Cai dang
 * tin la CAC AUDIT CU THE — nhat la `render-blocking-resources` — vi chung phan anh
 * cau truc trang chu khong phai toc do duong truyen.
 */
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const URL_TARGET = process.argv[2] ?? 'http://localhost:4173/phongb-space/';
const FORM_FACTOR = process.argv[3] ?? 'mobile';

const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });

/**
 * Chan script cua phan mem diet virus tren may. Kaspersky chen
 * gc.kis.v2.scr.kaspersky-labs.com/main.js vao MOI trang http tren may nay va no chan
 * hien thi hon 2 giay — hoan toan khong ton tai tren may khach hay tren PageSpeed
 * Insights. Khong chan thi diem Performance do o local vo nghia.
 */
const BLOCKED = ['*kaspersky-labs.com*', '*scr.kaspersky*'];

const config =
  FORM_FACTOR === 'desktop'
    ? {
        blockedUrlPatterns: BLOCKED,
        formFactor: 'desktop',
        screenEmulation: { disabled: true },
        throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
      }
    : { blockedUrlPatterns: BLOCKED };

const runner = await lighthouse(
  URL_TARGET,
  { port: chrome.port, output: 'json', logLevel: 'error' },
  { extends: 'lighthouse:default', settings: config },
);

const lhr = runner.lhr;

// Dong Chrome sau khi da co ket qua. Tren Windows, chrome-launcher hay bao EPERM khi
// xoa thu muc tam — do la loi don dep, khong lam hong ket qua do duoc.
try {
  await chrome.kill();
} catch {
  /* bo qua */
}

if (lhr.runtimeError && lhr.runtimeError.code !== 'NO_ERROR') {
  console.error(`\nLighthouse khong chay duoc: ${lhr.runtimeError.code}`);
  console.error(lhr.runtimeError.message);
  process.exit(1);
}

console.log(`\n=== ${FORM_FACTOR.toUpperCase()} — ${URL_TARGET} ===`);
for (const c of Object.values(lhr.categories)) {
  console.log(`${c.title.padEnd(20)} ${Math.round(c.score * 100)}`);
}

console.log('\n--- chi so ---');
for (const id of [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
]) {
  const a = lhr.audits[id];
  if (a) console.log(`${a.title.padEnd(30)} ${a.displayValue}`);
}

console.log('\n--- audit chua dat ---');
let clean = true;
for (const [id, a] of Object.entries(lhr.audits)) {
  if (a.score === null || a.score >= 0.9) continue;
  if (a.scoreDisplayMode === 'notApplicable' || a.scoreDisplayMode === 'manual') continue;
  clean = false;
  console.log(`  ${id}: ${a.title}${a.displayValue ? ' — ' + a.displayValue : ''}`);
}
if (clean) console.log('  (khong co)');

// In chi tiet may audit hay phai soi. Lighthouse 13 doi ten sang *-insight nen thu ca hai.
for (const id of [
  'largest-contentful-paint-element',
  'render-blocking-insight',
  'render-blocking-resources',
  'image-delivery-insight',
  'label-content-name-mismatch',
]) {
  const a = lhr.audits[id];
  if (!a || a.score === null) continue;
  console.log(`\n--- ${id} (score=${a.score}) ${a.displayValue ?? ''} ---`);
  for (const item of a.details?.items ?? []) {
    const url = item.url ?? item.node?.snippet ?? JSON.stringify(item).slice(0, 120);
    const cost = item.wastedMs ? ` +${item.wastedMs}ms` : item.wastedBytes ? ` ${Math.round(item.wastedBytes / 1024)}KiB` : '';
    console.log(`  ${String(url).slice(0, 110)}${cost}`);
  }
}
