import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { I18nProvider } from './i18n';

/** Render ban tieng Viet mac dinh vao HTML production. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </StrictMode>,
  );
}
