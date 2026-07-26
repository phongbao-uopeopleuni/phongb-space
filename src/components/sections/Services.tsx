import { Check } from 'lucide-react';
import { useI18n } from '../../i18n';
import { CONTACT, PRICING } from '../../data/config';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';

export function Services() {
  const { t, lang } = useI18n();

  // Dinh dang so tien theo ngon ngu dang xem: vi-VN dung dau cham phan cach nghin,
  // en-US dung dau phay. Gia luu trong config la so thuan nen doi duoc ca hai kieu.
  const money = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US');
  const priceRange = (from: number | null, to: number | null) =>
    from !== null && to !== null
      ? `${money.format(from)} – ${money.format(to)} ${t.services.currency}`
      : null;

  const packages = [
    { key: 'basic' as const, copy: t.services.basic, price: PRICING.basic, popular: false },
    { key: 'standard' as const, copy: t.services.standard, price: PRICING.standard, popular: true },
    { key: 'premium' as const, copy: t.services.premium, price: PRICING.premium, popular: false },
  ];

  return (
    <section id="services" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHead
          eyebrow={t.services.eyebrow}
          title={t.services.title}
          cmd={t.services.cmd}
          lede={t.services.lede}
        />

        {/* 3 cot chi tu lg: o 768px moi the chi con ~218px, qua chat cho danh sach
            hang muc voi co chu goc 18px */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.key} as="article" delay={i * 90} className="h-full">
              <div
                className={`card flex h-full flex-col gap-4 ${
                  pkg.popular ? 'border-accent' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-[0.75rem] text-muted">
                    {String(i + 1).padStart(2, '0')} ·{' '}
                    <span className="text-accent">[{pkg.key}]</span>
                  </p>
                  {pkg.popular && (
                    <span className="shrink-0 rounded border border-accent px-2 py-0.5 font-mono text-[10px] text-accent">
                      {t.services.popular}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-fg">{pkg.copy.name}</h3>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">
                    {pkg.copy.tagline}
                  </p>
                </div>

                <ul className="space-y-2">
                  {pkg.copy.items.map((item) => (
                    <li key={item} className="flex gap-2 text-[0.85rem] leading-relaxed text-fg">
                      <Check
                        size={14}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-accent"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Gia va thoi gian ban giao lay tu config; con rong thi hien
                    "dang cap nhat" thay vi mot con so bia */}
                <dl className="mt-auto space-y-1 border-t border-line pt-4 font-mono text-[0.8rem]">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <dt className="text-muted">{t.services.fromLabel}</dt>
                    <dd
                      className={
                        priceRange(pkg.price.priceFrom, pkg.price.priceTo)
                          ? 'text-accent'
                          : 'text-muted'
                      }
                    >
                      {priceRange(pkg.price.priceFrom, pkg.price.priceTo) ?? t.services.pending}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-muted">{t.services.timelineLabel}</dt>
                    {/* Don vi ngay lay tu i18n, khong nhet vao config, de ban tieng Anh
                        khong hien chu tieng Viet */}
                    <dd className={pkg.price.timelineDays ? 'text-fg' : 'text-muted'}>
                      {pkg.price.timelineDays
                        ? `${pkg.price.timelineDays} ${t.services.dayUnit}`
                        : t.services.pending}
                    </dd>
                  </div>
                </dl>

                <a
                  href={CONTACT.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${pkg.popular ? 'btn-primary' : 'btn-ghost'} w-full`}
                >
                  {t.services.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Noi ro day la khoang du kien, tranh khach hieu la gia chot */}
        <Reveal delay={120}>
          <p className="mt-6 max-w-2xl text-[0.8rem] leading-relaxed text-muted">
            {t.services.priceNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
