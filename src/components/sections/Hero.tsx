import { ArrowRight, MessageCircle } from 'lucide-react';
import { useI18n } from '../../i18n';
import { CONTACT, STATS } from '../../data/config';
import { Reveal } from '../Reveal';

export function Hero() {
  const { t } = useI18n();

  // Chi hien o thoi gian ban giao khi da co so thuc te — khong bia
  const stats = [
    { value: String(STATS.delivered), label: t.hero.statsDelivered },
    { value: String(STATS.countries), label: t.hero.statsCountries },
    STATS.avgDeliveryDays
      ? { value: STATS.avgDeliveryDays, label: t.hero.statsDelivery }
      : { value: '—', label: t.hero.statsDeliveryPending },
  ];

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      {/* Luoi mo dang blueprint, mo dan ve phia duoi de khong lan chu */}
      <div
        aria-hidden="true"
        className="blueprint pointer-events-none absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />

      <div className="shell relative">
        <Reveal>
          <p className="eyebrow">{t.hero.eyebrow}</p>
        </Reveal>

        <Reveal delay={60}>
          <p className="cmd mt-2">{t.hero.role}</p>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-fg md:text-5xl">
            {t.hero.title}
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{t.hero.lede}</p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={CONTACT.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <MessageCircle size={16} aria-hidden="true" />
              {t.hero.ctaPrimary}
            </a>
            <a href="#works" className="btn btn-ghost">
              {t.hero.ctaSecondary}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        {/* Dai so lieu — bien the truot tu ben trai */}
        <div className="mt-14 grid max-w-2xl grid-cols-1 divide-y divide-line overflow-hidden rounded-lg border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              variant="left"
              delay={i * 90}
              className="bg-surface px-5 py-4"
            >
              <p className="font-mono text-2xl font-semibold text-accent">{stat.value}</p>
              <p className="mt-1 text-[0.8rem] text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
