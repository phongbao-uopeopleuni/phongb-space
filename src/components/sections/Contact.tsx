import { useState } from 'react';
import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { useI18n } from '../../i18n';
import { CONTACT, FORMSPREE_ENDPOINT, FORM_SUBJECT } from '../../data/config';
import { asset } from '../../lib/asset';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';

type Status = 'idle' | 'sending' | 'sent' | 'error';
/** Phan biet tung loai loi de bao dung nguyen nhan, khong bao chung mot cau */
type ErrorKind = 'network' | 'domain' | 'quota' | 'server';
type FieldName = 'name' | 'phone' | 'email';
type FieldErrors = Partial<Record<FieldName, true>>;

const FIELD_CLASS =
  'w-full rounded-md border border-line bg-bg px-3 py-2 text-[0.9rem] text-fg placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none disabled:opacity-60';

export function Contact() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState<Status>('idle');
  const [errorKind, setErrorKind] = useState<ErrorKind>('server');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Khi chua co endpoint, cac o nhap bi vo hieu va khong render nut Gui — de tranh
  // mot cai nut bam vao khong di dau ca.
  const formEnabled = FORMSPREE_ENDPOINT.length > 0;

  /** Kiem tra phia client truoc khi goi mang, de khach thay loi ngay */
  function validate(data: FormData): FieldErrors {
    const errors: FieldErrors = {};

    const name = String(data.get('name') ?? '').trim();
    if (name.length < 2) errors.name = true;

    // Chi dem chu so: khach hay nhap kem dau cach, dau cham hoac +84
    const digits = String(data.get('phone') ?? '').replace(/\D/g, '');
    if (digits.length < 8) errors.phone = true;

    const email = String(data.get('email') ?? '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.email = true;
    }

    return errors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formEnabled || status === 'sending') return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: nguoi that khong thay o nay nen khong bao gio dien. Bot dien vao thi
    // bao thanh cong nhung khong gui gi ca — noi that voi bot chi giup no thu lai.
    if (String(data.get('_gotcha') ?? '').length > 0) {
      form.reset();
      setFieldErrors({});
      setStatus('sent');
      return;
    }

    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('idle');
      // Dua con tro vao o sai dau tien de khach khong phai tu do tim
      const first = (['name', 'phone', 'email'] as FieldName[]).find((f) => errors[f]);
      if (first) form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setFieldErrors({});
    setStatus('sending');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });

      if (res.ok) {
        form.reset();
        setStatus('sent');
        return;
      }

      // 403: Restrict to Domain chan, hoac form bi vo hieu hoa
      // 429: het han muc luot gui cua goi free trong thang
      if (res.status === 403) setErrorKind('domain');
      else if (res.status === 429) setErrorKind('quota');
      else setErrorKind('server');
      setStatus('error');
    } catch {
      // fetch nem loi => khong ra duoc mang, khac han voi loi tu phia Formspree
      setErrorKind('network');
      setStatus('error');
    }
  }

  const errorMessage: Record<ErrorKind, string> = {
    network: t.contact.errNetwork,
    domain: t.contact.errDomain,
    quota: t.contact.errQuota,
    server: t.contact.error,
  };

  /** Nhan o nhap kem thong bao loi ngay duoi, gan bang aria-describedby */
  function fieldMeta(field: FieldName) {
    const err = fieldErrors[field];
    return {
      'aria-invalid': err ? (true as const) : undefined,
      'aria-describedby': err ? `cf-${field}-err` : undefined,
      className: `mt-1.5 ${FIELD_CLASS} ${err ? 'border-red-400' : ''}`,
    };
  }

  function FieldError({ field }: { field: FieldName }) {
    if (!fieldErrors[field]) return null;
    const message: Record<FieldName, string> = {
      name: t.contact.errName,
      phone: t.contact.errPhone,
      email: t.contact.errEmail,
    };
    return (
      <p id={`cf-${field}-err`} className="mt-1 text-[0.75rem] text-red-400">
        {message[field]}
      </p>
    );
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
                <a href={`tel:${CONTACT.phoneE164}`} className="btn btn-ghost w-full">
                  <Phone size={16} aria-hidden="true" />
                  {t.contact.call} · {CONTACT.phoneDisplay}
                </a>
              </div>

              <div className="mt-5 border-t border-line pt-5 text-center">
                <a
                  href={CONTACT.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.contact.zalo}: ${CONTACT.zaloPhoneDisplay}`}
                  className="inline-block rounded-lg transition-transform hover:scale-[1.02]"
                >
                  <img
                    src={asset('images/zalo-bao-qr.png')}
                    alt={t.contact.zaloQrAlt}
                    width={336}
                    height={408}
                    loading="lazy"
                    className="mx-auto w-full max-w-[13rem] rounded-lg border border-line"
                  />
                </a>
                <p className="mx-auto mt-3 max-w-xs text-[0.8rem] leading-relaxed text-muted">
                  {t.contact.zaloScan}
                </p>
              </div>

              <dl className="mt-6 space-y-3 border-t border-line pt-5 font-mono text-[0.8rem]">
                <div>
                  <dt className="text-muted">{t.contact.phoneLabel}</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${CONTACT.phoneE164}`}
                      className="text-fg transition-colors hover:text-accent"
                    >
                      {CONTACT.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">{t.contact.zaloLabel}</dt>
                  <dd className="mt-0.5">
                    <a
                      href={CONTACT.zalo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg transition-colors hover:text-accent"
                    >
                      {CONTACT.zaloPhoneDisplay}
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

              <form
                // action/method chi de markup tu giai thich va lam duong du phong: viec gui
                // that di qua fetch trong handleSubmit, da preventDefault ngay dong dau
                action={FORMSPREE_ENDPOINT}
                method="POST"
                onSubmit={handleSubmit}
                // noValidate: tu kiem tra bang JavaScript de thong bao loi ra tieng Viet,
                // thay vi de trinh duyet hien bong bong theo ngon ngu he dieu hanh
                noValidate
                className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {/* Truong an gui kem, khach khong thay */}
                <input type="hidden" name="_subject" value={FORM_SUBJECT} />
                {/* Ngon ngu khach dang xem — de biet nen tra loi bang tieng Viet hay tieng Anh */}
                <input type="hidden" name="language" value={lang} />

                {/* Honeypot.
                    Khong dung `display:none` vi mot so bot bo qua o bi an hoan toan.
                    Cung khong dung `left:-9999px`: toa do am nam ngoai khung nhin va se
                    bi bai kiem tra tran ngang trong scripts/smoke.mjs bao loi.
                    Thay vao do thu nho ve 1px roi cat sach bang clip-path — vo hinh
                    nhung van nam trong khung. tabIndex -1 va aria-hidden de nguoi dung
                    ban phim va trinh doc man hinh khong bao gio cham vao. */}
                <div
                  aria-hidden="true"
                  className="absolute size-px overflow-hidden"
                  style={{ clipPath: 'inset(50%)' }}
                >
                  <label htmlFor="cf-gotcha">Do not fill this in</label>
                  <input
                    id="cf-gotcha"
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="cf-name" className="block font-mono text-[0.75rem] text-muted">
                    {t.contact.fieldName}{' '}
                    <span className="text-accent">({t.contact.required})</span>
                  </label>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    disabled={!formEnabled}
                    {...fieldMeta('name')}
                  />
                  <FieldError field="name" />
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
                    inputMode="tel"
                    autoComplete="tel"
                    disabled={!formEnabled}
                    {...fieldMeta('phone')}
                  />
                  <FieldError field="phone" />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cf-email" className="block font-mono text-[0.75rem] text-muted">
                    {t.contact.fieldEmail}{' '}
                    <span className="text-muted">({t.contact.optional})</span>
                  </label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    disabled={!formEnabled}
                    {...fieldMeta('email')}
                  />
                  <FieldError field="email" />
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
                  <label
                    htmlFor="cf-message"
                    className="block font-mono text-[0.75rem] text-muted"
                  >
                    {t.contact.fieldNote}
                  </label>
                  <textarea
                    id="cf-message"
                    name="message"
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
                      {status === 'sending' ? (
                        <span
                          aria-hidden="true"
                          className="spin inline-block size-4 rounded-full border-2 border-on-accent/30 border-t-on-accent"
                        />
                      ) : (
                        <Send size={15} aria-hidden="true" />
                      )}
                      {status === 'sending' ? t.contact.sending : t.contact.submit}
                    </button>
                  </div>
                )}

                {/* aria-live de trinh doc man hinh thong bao ket qua gui */}
                <p aria-live="polite" className="text-[0.85rem] leading-relaxed sm:col-span-2">
                  {status === 'sent' && <span className="text-accent">{t.contact.sent}</span>}
                  {status === 'error' && (
                    <span className="text-red-400">{errorMessage[errorKind]}</span>
                  )}
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
