import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { I18nProvider } from './i18n';
import './index.css';

/**
 * Kich hoat CSS font da duoc `<link rel="preload">` tai san trong index.html.
 *
 * Viec nay truoc day nam trong thuoc tinh `onload=` ngay tren the link, nhung do la
 * script inline: giu no thi CSP buoc phai mo `script-src 'unsafe-inline'`, tuc bo gan
 * het tac dung chong XSS. Doi o day khong ton them thoi gian vi khong co chu nao hien
 * ra truoc khi bundle nay chay — toan bo trang do React render.
 */
const fontCss = document.getElementById('font-css') as HTMLLinkElement | null;
if (fontCss) fontCss.rel = 'stylesheet';

const root = document.getElementById('root');
if (!root) throw new Error('Khong tim thay #root trong index.html');

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
