import { useState } from 'react';
import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { useI18n } from '../../i18n';
import { CONTACT, FORMSPREE_ENDPOINT } from '../../data/config';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELD_CLASS =
  'w-full rounded-md border border-line bg-bg px-3 py-2 text-[0.9rem] text-fg placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none disabled:opacity-60';

export function Contact() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>('idle');

  // TODO: form chi hoat dong sau khi dien FORMSPREE_ENDPOINT trong src/data/config.ts.
  // Khi chua co endpoint, cac o nhap bi vo hieu va khong render nut Gui — de tranh
  // mot cai nut bam vao khong di dau ca.
  const formEnabled = FORMSPREE_ENDPOINT.length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formEnabled) return;

    const form = e.currentTarget;
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHead eyebrow={t.contact.eyebrow} title={t.contact.title} lede={t.contact.lede} />

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Zalo va so dien thoai la duong lien he chinh — dat noi bat nhat */}
          <Reveal className="lg:col-span-2">
            <div className="card h-full">
              <div className="flex flex-col gap-3">
                <a
                  href={CONTACT.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {t.contact.zalo}
                </a>
                <a href={`tel:${CONTACT.phoneRaw}`} className="btn btn-ghost w-full">
                  <Phone size={16} aria-hidden="true" />
                  {t.contact.call} · {CONTACT.phoneDisplay}
                </a>
              </div>

              <dl className="mt-6 space-y-3 border-t border-line pt-5 font-mono text-[0.8rem]">
                <div>
                  <dt className="text-muted">{t.contact.phoneLabel}</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${CONTACT.phoneRaw}`}
                      className="text-fg transition-colors hover:text-accent"
                    >
                      {CONTACT.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">{t.contact.emailLabel}</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="inline-flex items-center gap-2 break-all text-fg transition-colors hover:text-accent"
                    >
                      <Mail size={13} aria-hidden="true" className="shrink-0" />
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-3">
            <div className="card h-full">
              <h3 className="text-base font-semibold text-fg">{t.contact.formTitle}</h3>
              <p className="mt-1 text-[0.85rem] text-muted">{t.contact.formNote}</p>

              {!formEnabled && (
                <p className="mt-4 rounded-md border border-line bg-bg px-3 py-2 text-[0.8rem] leading-relaxed text-muted">
                  {t.contact.formDisabled}
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="cf-name" className="block font-mono text-[0.75rem] text-muted">
                    {t.contact.fieldName}{' '}
                    <span className="text-accent">({t.contact.required})</span>
                  </label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    disabled={!formEnabled}
                    className={`mt-1.5 ${FIELD_CLASS}`}
                  />
                </div>

                <div>
                  <label htmlFor="cf-phone" className="block font-mono text-[0.75rem] text-muted">
                    {t.contact.fieldPhone}{' '}
                    <span className="text-accent">({t.contact.required})</span>
                  </label>
                  <input
                    id="cf-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    disabled={!formEnabled}
                    className={`mt-1.5 ${FIELD_CLASS}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="cf-business"
                    className="block font-mono text-[0.75rem] text-muted"
                  >
                    {t.contact.fieldBusiness}
                  </label>
                  <input
                    id="cf-business"
                    name="business"
                    type="text"
                    placeholder={t.contact.fieldBusinessPlaceholder}
                    disabled={!formEnabled}
                    className={`mt-1.5 ${FIELD_CLASS}`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cf-note" className="block font-mono text-[0.75rem] text-muted">
                    {t.contact.fieldNote}
                  </label>
                  <textarea
                    id="cf-note"
                    name="note"
                    rows={4}
                    placeholder={t.contact.fieldNotePlaceholder}
                    disabled={!formEnabled}
                    className={`mt-1.5 resize-y ${FIELD_CLASS}`}
                  />
                </div>

                {formEnabled && (
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn btn-primary w-full disabled:opacity-70 sm:w-auto"
                    >
                      <Send size={15} aria-hidden="true" />
                      {status === 'sending' ? t.contact.sending : t.contact.submit}
                    </button>
                  </div>
                )}

                {/* aria-live de trinh doc man hinh thong bao ket qua gui */}
                <p aria-live="polite" className="sm:col-span-2 text-[0.85rem]">
                  {status === 'sent' && <span className="text-accent">{t.contact.sent}</span>}
                  {status === 'error' && <span className="text-fg">{t.contact.error}</span>}
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
