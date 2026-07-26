/**
 * Smoke test production: noi dung co san khi tat JavaScript, hydrate khong loi, form va
 * song ngu hoat dong, so goi dung E.164, anh tai du va khong tran ngang.
 */
import { chromium } from 'playwright';

const URL_TARGET = process.argv[2] ?? 'http://127.0.0.1:4173/phongb-space/';
const EXPECTED_PHONE = 'tel:+84775753003';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
const page = await context.newPage();

const consoleErrors = [];
const failedRequests = [];
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
page.on('response', (response) => {
  if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
});

await page.goto(URL_TARGET, { waitUntil: 'load', timeout: 45_000 });

// Cuon het trang de kich hoat anh lazy-load, sau do quay lai dau trang.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(500);

const report = await page.evaluate(() => {
  const jsonTag = document.getElementById('phongb-jsonld');
  let jsonLdHopLe = false;
  try {
    jsonLdHopLe = Boolean(jsonTag?.textContent && JSON.parse(jsonTag.textContent)['@graph']);
  } catch {
    jsonLdHopLe = false;
  }

  return {
    h1: document.querySelector('h1')?.textContent ?? null,
    soChuHienThi: document.body.innerText.trim().length,
    soAnh: document.querySelectorAll('#works img').length,
    anhDaTai: [...document.querySelectorAll('#works img')].filter((img) => img.naturalWidth > 0)
      .length,
    jsonLdHopLe,
    bootOverlay: Boolean(document.querySelector('[class*="z-\\[150\\]"]')),
    googleFontRequests: performance
      .getEntriesByType('resource')
      .filter((entry) => entry.name.includes('fonts.googleapis.com') || entry.name.includes('fonts.gstatic.com'))
      .map((entry) => entry.name),
    phoneHrefs: [...document.querySelectorAll('a[href^="tel:"]')].map((link) =>
      link.getAttribute('href'),
    ),
  };
});

// Form phai chan du lieu sai ma khong gui request ra ngoai.
await page.locator('#cf-name').fill('A');
await page.locator('#cf-phone').fill('12');
await page.locator('#cf-email').fill('sai');
await page.locator('button[type="submit"]').click();
const viErrors = await page.locator('#cf-name-err, #cf-phone-err, #cf-email-err').allTextContents();

// Doi ngon ngu khi dang co loi: thong bao phai doi theo, khong bi ket o tieng Viet.
await page.locator('header button:not([aria-controls])').click();
const langReport = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  formLanguage: document.querySelector('input[name="language"]')?.getAttribute('value') ?? null,
  errors: [...document.querySelectorAll('#cf-name-err, #cf-phone-err, #cf-email-err')].map(
    (element) => element.textContent ?? '',
  ),
}));

// Kiem tra tran ngang o cac breakpoint chinh, sau khi da doi sang ban Anh dai chu hon.
const overflowByWidth = [];
for (const width of [375, 414, 768, 1280, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  const bad = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    return [...document.querySelectorAll('body *')]
      .filter((element) => {
        if (element.closest('[aria-hidden="true"]')) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (rect.right > viewportWidth + 0.5 || rect.left < -0.5);
      })
      .slice(0, 4)
      .map((element) => `${element.tagName}.${String(element.className).slice(0, 40)}`);
  });
  overflowByWidth.push({ width, bad });
}

// Day la phep kiem tra cot loi cua prerender: tat JavaScript van phai doc duoc trang.
const noJsContext = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 412, height: 915 },
});
const noJsPage = await noJsContext.newPage();
const noJsFailedRequests = [];
noJsPage.on('response', (response) => {
  if (response.status() >= 400) noJsFailedRequests.push(`${response.status()} ${response.url()}`);
});
await noJsPage.goto(URL_TARGET, { waitUntil: 'load', timeout: 45_000 });
const noJsReport = await noJsPage.evaluate(() => {
  const h1 = document.querySelector('h1');
  const style = h1 ? getComputedStyle(h1) : null;
  return {
    h1: h1?.textContent ?? null,
    soChuHienThi: document.body.innerText.trim().length,
    h1HienThi: Boolean(style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'),
    jsonLd: Boolean(document.getElementById('phongb-jsonld')?.textContent),
  };
});

await noJsContext.close();
await browser.close();

const phoneDung = report.phoneHrefs.length >= 2 && report.phoneHrefs.every((href) => href === EXPECTED_PHONE);
const loiDaDoiSangAnh =
  langReport.errors.length === 3 &&
  langReport.errors.every((message) => !/[À-ỹ]|Vui lòng|Số điện thoại|chưa đúng/u.test(message));

console.log(`\n=== SMOKE TEST — ${URL_TARGET} ===`);
console.log(`H1                      ${report.h1}`);
console.log(`So ky tu hien thi       ${report.soChuHienThi}`);
console.log(`Anh du an               ${report.anhDaTai}/${report.soAnh} da tai`);
console.log(`JSON-LD                 ${report.jsonLdHopLe ? 'hop le' : 'KHONG HOP LE'}`);
console.log(`Google Fonts            ${report.googleFontRequests.length ? 'CON REQUEST' : 'khong con'}`);
console.log(`So goi quoc te          ${phoneDung ? 'dung E.164' : report.phoneHrefs.join(', ')}`);
console.log(`Validation              ${viErrors.length === 3 ? 'chan du 3 truong' : 'THIEU LOI'}`);
console.log(`Doi ngon ngu form       ${langReport.lang}/${langReport.formLanguage}, loi ${loiDaDoiSangAnh ? 'da dich' : 'CHUA DICH'}`);
console.log(`Khong JavaScript        ${noJsReport.h1HienThi ? 'doc duoc noi dung' : 'TRANG/RONG'} (${noJsReport.soChuHienThi} ky tu)`);
for (const item of overflowByWidth) {
  console.log(`  ${String(item.width).padEnd(5)} ${item.bad.length ? 'TRAN: ' + item.bad.join(', ') : 'khong tran'}`);
}
console.log(`Loi console             ${consoleErrors.length ? consoleErrors.join('\n  ') : 'khong'}`);
console.log(`Request that bai        ${failedRequests.length ? failedRequests.join('\n  ') : 'khong'}`);

const fail =
  consoleErrors.length > 0 ||
  failedRequests.length > 0 ||
  noJsFailedRequests.length > 0 ||
  report.soChuHienThi < 500 ||
  report.soAnh !== 5 ||
  report.anhDaTai !== report.soAnh ||
  !report.jsonLdHopLe ||
  report.bootOverlay ||
  report.googleFontRequests.length > 0 ||
  !phoneDung ||
  viErrors.length !== 3 ||
  langReport.lang !== 'en' ||
  langReport.formLanguage !== 'en' ||
  !loiDaDoiSangAnh ||
  overflowByWidth.some((item) => item.bad.length > 0) ||
  !noJsReport.h1 ||
  noJsReport.soChuHienThi < 500 ||
  !noJsReport.h1HienThi ||
  !noJsReport.jsonLd;

console.log(`\n=> ${fail ? 'CHUA DAT' : 'DAT'}`);
process.exitCode = fail ? 1 : 0;
