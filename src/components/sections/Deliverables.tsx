import { useI18n } from '../../i18n';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';

export function Deliverables() {
  const { t } = useI18n();

  return (
    <section id="deliverables" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHead
          eyebrow={t.deliverables.eyebrow}
          title={t.deliverables.title}
          cmd={t.deliverables.cmd}
          lede={t.deliverables.lede}
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {t.deliverables.items.map((item, i) => (
            <Reveal key={item.name} as="li" delay={(i % 2) * 80} className="block">
              <div className="card h-full">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.75rem] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[0.95rem] font-semibold text-fg">{item.name}</h3>
                </div>
                <p className="mt-2 pl-8 text-[0.875rem] leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
