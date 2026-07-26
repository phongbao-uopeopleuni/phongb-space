import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DIST_HTML = path.join(ROOT, 'dist', 'index.html');
const SSR_DIR = path.join(ROOT, '.prerender');
const SSR_ENTRY = path.join(SSR_DIR, 'entry-server.js');
const ROOT_MARKER = '<div id="root"></div>';

try {
  const html = await readFile(DIST_HTML, 'utf8');
  if (!html.includes(ROOT_MARKER)) {
    throw new Error(`Khong tim thay ${ROOT_MARKER} trong dist/index.html`);
  }

  const { render } = await import(`${pathToFileURL(SSR_ENTRY).href}?t=${Date.now()}`);
  const appHtml = render();
  if (!appHtml.includes('<h1')) {
    throw new Error('SSR khong sinh duoc noi dung chinh');
  }

  await writeFile(DIST_HTML, html.replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`));
  console.log(`Prerender xong: ${appHtml.length.toLocaleString('en-US')} ky tu HTML trong #root`);
} finally {
  await rm(SSR_DIR, { recursive: true, force: true });
}
