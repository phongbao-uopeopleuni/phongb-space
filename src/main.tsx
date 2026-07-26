import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { I18nProvider } from './i18n';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Khong tim thay #root trong index.html');

// HTML production da duoc render san luc build. hydrateRoot chi gan tuong tac vao markup
// hien co, nen khach va crawler thay noi dung ngay ca khi bundle cham hoac JavaScript tat.
hydrateRoot(
  root,
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
