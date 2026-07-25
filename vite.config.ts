import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Ten repo GitHub. Vi day la project page, URL co dang https://<user>.github.io/<REPO_NAME>/
// nen toan bo asset phai duoc phuc vu tu duong dan con nay.
// TODO: doi lai neu ban dat ten repo khac.
const REPO_NAME = 'bao-phong-web';

// Workflow deploy set GITHUB_PAGES='true' khi build. Khi chay dev/local thi base la '/'.
// TODO: neu sau nay gan ten mien rieng (vi du baophong.dev) thi doi base ve '/'
// va sua lai og:url / og:image / twitter:image trong index.html.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? `/${REPO_NAME}/` : '/',
  plugins: [react(), tailwindcss()],
});
