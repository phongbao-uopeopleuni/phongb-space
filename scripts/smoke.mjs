/**
 * Kiem tra khoi (smoke test) ban build production truoc khi push.
 *
 * Chay:  npm run build && npm run preview   (o cua so khac)
 *        npm run smoke
 *
 * Mo trang bang trinh duyet sach (khong sessionStorage, khong cache) roi kiem tra:
 * trang co ve ra chu khong, co loi console/404 khong, font co con chan hien thi khong,
 * va do FCP/LCP that.
 */
import { chromium } from 'playwright';

const URL_TARGET = process.argv[2] ?? 'http://localhost:4173/phongb-space/';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
const page = await context.newPage();

const consoleErrors = [];
const failedRequests = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
page.on('response', (r) => {
  if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
});

await page.goto(URL_TARGET, { waitUntil: 'load', timeout: 45_000 });

// Do thoi diem ve dau tien ngay sau khi tai xong, truoc khi man hinh boot bien mat
const paintEarly = await page.evaluate(() =>
  performance.getEntriesByType('paint').map((p) => ({ name: p.name, t: Math.round(p.startTime) })),
);

// Cho man hinh boot chay het
await page.waitForTimeout(2200);

// Cuon het trang: anh dat loading="lazy" va hieu ung hien dan chi chay khi lot vao
// khung nhin, khong cuon thi kiem tra khong noi len dieu gi
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 220));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

const report = await page.evaluate(() => {
  const lcp = performance.getEntriesByType('largest-contentful-paint').at(-1);
  const fontCss = performance
    .getEntriesByType('resource')
    .find((r) => r.name.includes('fonts.googleapis.com/css2'));
  const fcp = performance.getEntriesByName('first-contentful-paint')[0];

  return {
    fcpMs: fcp ? Math.round(fcp.startTime) : null,
    lcpMs: lcp ? Math.round(lcp.startTime) : null,
    lcpElement: lcp?.element?.tagName ?? null,
    fontCssEndMs: fontCss ? Math.round(fontCss.responseEnd) : null,
    fontRel: document.querySelector('link[href*="css2"]')?.rel ?? null,
    bootOverlayConHien: !!document.querySelector('[class*="z-\\[150\\]"]'),
    soChuHienThi: document.body.innerText.trim().length,
    h1: document.querySelector('h1')?.textContent ?? null,
    soAnh: document.querySelectorAll('#works img').length,
    anhDaTai: [...document.querySelectorAll('#works img')].filter((i) => i.naturalWidth > 0).length,
    // Kich thuoc thuc te trinh duyet chon tu srcset — phai la ban 800 tren dien thoai
    anhDaChon: [...document.querySelectorAll('#works img')].map((i) =>
      i.currentSrc.split('/').pop(),
    ),
    khoiGiuCho: (document.getElementById('works')?.textContent.match(/--pending/g) ?? []).length,
    revealDaHien: document.querySelectorAll('.is-in').length,
    revealTong: document.querySelectorAll('.reveal, .reveal-left').length,
    jsonLd: !!document.getElementById('phongb-jsonld'),
    tranNgang: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
});

// Kiem tra tran ngang o cac moc thuong gap. Do bounding rect tung phan tu chu khong
// dua vao scrollWidth: thanh dieu huong la `fixed`, phan tu fixed tran ra ngoai khong
// lam tang scrollWidth nen kieu tran do khong bi phat hien.
const overflowByWidth = [];
for (const w of [375, 414, 768, 1280, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(250);
  const bad = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return [...document.querySelectorAll('body *')]
      .filter((el) => {
        // Bo qua nhanh aria-hidden: do la phan tu trang tri hoac bay chong bot (honeypot,
        // con tro tuy bien) — co tinh dat ngoai luong hien thi, khong phai loi bo cuc
        if (el.closest('[aria-hidden="true"]')) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 0.5 || r.left < -0.5);
      })
      .slice(0, 4)
      .map((el) => `${el.tagName}.${String(el.className).slice(0, 40)}`);
  });
  overflowByWidth.push({ w, bad });
}

await browser.close();

const fontChanHienThi =
  report.fcpMs !== null && report.fontCssEndMs !== null && report.fcpMs >= report.fontCssEndMs;

console.log(`\n=== SMOKE TEST — ${URL_TARGET} ===`);
console.log(`Ve lan dau (paint)      ${JSON.stringify(paintEarly)}`);
console.log(`FCP                     ${report.fcpMs} ms`);
console.log(`LCP                     ${report.lcpMs} ms  (${report.lcpElement})`);
console.log(`Font CSS tai xong luc   ${report.fontCssEndMs} ms  (rel="${report.fontRel}")`);
console.log(`-> Font co chan ve?     ${fontChanHienThi ? 'CO — VAN CHAN' : 'KHONG (ve truoc khi font tai xong)'}`);
console.log(`\nH1                      ${report.h1}`);
console.log(`So ky tu hien thi       ${report.soChuHienThi}`);
console.log(`Anh du an               ${report.anhDaTai}/${report.soAnh} da tai`);
console.log(`Ban anh trinh duyet chon ${report.anhDaChon.join(', ')}`);
console.log(`Khoi giu cho con lai    ${report.khoiGiuCho}`);
console.log(`Hieu ung hien dan       ${report.revealDaHien}/${report.revealTong}`);
console.log(`JSON-LD                 ${report.jsonLd ? 'co' : 'KHONG CO'}`);
console.log(`Tran ngang (412px)      ${report.tranNgang ? 'CO — LOI' : 'khong'}`);
for (const o of overflowByWidth) {
  console.log(`  ${String(o.w).padEnd(5)} ${o.bad.length ? 'TRAN: ' + o.bad.join(', ') : 'khong tran'}`);
}
console.log(`\nLoi console             ${consoleErrors.length ? consoleErrors.join('\n  ') : 'khong'}`);
console.log(`Request that bai        ${failedRequests.length ? failedRequests.join('\n  ') : 'khong'}`);

const fail =
  consoleErrors.length > 0 ||
  failedRequests.length > 0 ||
  report.tranNgang ||
  report.soChuHienThi < 500 ||
  report.anhDaTai < report.soAnh ||
  report.khoiGiuCho > 0 ||
  report.revealDaHien < report.revealTong ||
  !report.jsonLd ||
  fontChanHienThi ||
  overflowByWidth.some((o) => o.bad.length > 0);

console.log(`\n=> ${fail ? 'CHUA DAT' : 'DAT'}`);

process.exitCode = fail ? 1 : 0;
