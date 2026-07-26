import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Content-Security-Policy.
 *
 * GitHub Pages khong cho dat HTTP header, nen phai khai bao qua the <meta>. Han che cua
 * cach nay: khong dat duoc `frame-ancestors`, `report-uri` va `sandbox` — chung chi co
 * hieu luc khi den tu header thuc.
 *
 * Chi chen o ban build production: ban dev can ket noi WebSocket toi localhost cho HMR,
 * ma mo `connect-src` cho ws://localhost trong ban that thi thanh khe ho vo ich.
 *
 * `script-src 'self'` la muc dang gia nhat — khong co 'unsafe-inline' nen ke tan cong
 * co chen duoc chuoi vao DOM cung khong chay duoc script. Doi lai phai bo thuoc tinh
 * onload inline tren the font trong index.html (xem src/main.tsx).
 *
 * `style-src` van phai co 'unsafe-inline': React dat style qua CSSOM va Tailwind sinh
 * style noi tuyen. Chen duoc CSS thi muc thiet hai thap hon han chen duoc script.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  // Form gui thang toi Formspree; khong co endpoint nao khac duoc phep
  "connect-src 'self' https://formspree.io",
  "form-action 'self' https://formspree.io",
  "frame-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}">`,
      );
    },
  };
}

// Ten repo GitHub. Vi day la project page, URL co dang https://<user>.github.io/<REPO_NAME>/
// nen toan bo asset phai duoc phuc vu tu duong dan con nay.
// TODO: doi lai neu ban dat ten repo khac.
const REPO_NAME = 'phongb-space';

// Workflow deploy set GITHUB_PAGES='true' khi build. Khi chay dev/local thi base la '/'.
// TODO: neu sau nay gan ten mien rieng (vi du baophong.dev) thi doi base ve '/'
// va sua lai og:url / og:image / twitter:image trong index.html.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? `/${REPO_NAME}/` : '/',
  plugins: [react(), tailwindcss(), cspPlugin()],
});
