/**
 * Chup anh man hinh 5 website that vao public/images/works/<slug>.jpg
 *
 * Chay: npm run shots
 *       npm run shots -- fairys-house-hue        (chi chup mot du an)
 *
 * Danh sach du an import thang tu src/data/works.ts — Node 24 doc duoc .ts nen
 * khong phai khai bao URL o hai noi. Them mot website vao works.ts la script tu chup.
 *
 * Chup dung khung nhin 1600x900 (khong phai fullPage) de anh ra chinh xac ti le 16:9,
 * khop voi khoi `aspect-video` tren trang — thay anh vao khong nhay bo cuc.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { works } from '../src/data/works.ts';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public/images/works');

const WIDTH = 1600;
const HEIGHT = 900;

// User agent that de tranh bi Cloudflare hoac tuong lua chan nham la bot
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const targets = only.length ? works.filter((w) => only.includes(w.slug)) : works;

if (targets.length === 0) {
  console.error(`Khong tim thay slug: ${only.join(', ')}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  userAgent: UA,
  locale: 'vi-VN',
  // Tat animation CSS de anh khong bat dung luc phan tu dang chay do
  reducedMotion: 'reduce',
});

const results = [];

for (const work of targets) {
  const page = await context.newPage();
  try {
    await page.goto(work.url, { waitUntil: 'load', timeout: 45_000 });

    // Cloudflare chen trang "Just a moment..." truoc khi cho vao — cho no qua
    if (/just a moment|checking your browser/i.test(await page.title())) {
      await page.waitForFunction(() => !/just a moment/i.test(document.title), { timeout: 30_000 });
    }

    // Keo xuong roi len lai de kich hoat anh lazy-load, sau do cho lang mang
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const png = await page.screenshot({ type: 'png' });

    // Qua sharp de ep dung kich thuoc va nen JPEG — PNG anh chup web nang gap nhieu lan
    const jpg = await sharp(png)
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    await writeFile(resolve(OUT_DIR, `${work.slug}.jpg`), jpg);
    results.push({ slug: work.slug, ok: true, kb: (jpg.length / 1024).toFixed(0) });
    console.log(`OK   ${work.slug}.jpg  ${(jpg.length / 1024).toFixed(0)} KB`);
  } catch (err) {
    results.push({ slug: work.slug, ok: false, error: err.message.split('\n')[0] });
    console.log(`LOI  ${work.slug}: ${err.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} anh da chup -> ${OUT_DIR}`);
if (failed.length) {
  console.log('Nho: du an chup that bai van giu khoi giu cho tren trang.');
  process.exitCode = 1;
}
