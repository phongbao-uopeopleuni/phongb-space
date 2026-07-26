import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useI18n } from '../../i18n';
import { fillCopy } from '../../lib/copy';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';

export function Faq() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHead eyebrow={t.faq.eyebrow} title={t.faq.title} cmd={t.faq.cmd} />

        <Reveal className="mt-10 max-w-3xl overflow-hidden rounded-lg border border-line">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            // The {{upkeep}} / {{maintenance}} duoc thay bang so da dinh dang theo
            // ngon ngu. Dung chung ham voi StructuredData de schema khong lech chu.
            const answer = fillCopy(item.a, lang, t.services.currency, t.services.pending);

            return (
              <div key={item.q} className={i > 0 ? 'border-t border-line' : ''}>
                {/* <button> nen mac dinh dieu khien duoc bang Tab + Enter/Space */}
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex w-full items-start justify-between gap-4 bg-surface px-5 py-4 text-left transition-colors hover:bg-surface/60"
                  >
                    <span className="flex gap-3">
                      {/* So thu tu la trang tri: nam trong <h3> nen phai an khoi trinh
                          doc man hinh, khong thi tieu de bi doc thanh "01 Lam mot..." */}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 font-mono text-[0.75rem] text-accent"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[0.95rem] font-medium text-fg">{item.q}</span>
                    </span>
                    <Plus
                      size={16}
                      aria-hidden="true"
                      className={`mt-0.5 shrink-0 text-accent transition-transform duration-200 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  hidden={!isOpen}
                  className="bg-surface px-5 pb-5 pl-[3.5rem] pr-5"
                >
                  <p className="max-w-2xl text-[0.9rem] leading-relaxed text-muted">{answer}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
