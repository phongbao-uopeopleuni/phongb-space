import { useI18n } from '../../i18n';
import { PROCESS_DURATIONS } from '../../data/config';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';

export function Process() {
  const { t } = useI18n();

  return (
    <section id="process" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHead
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          cmd={t.process.cmd}
          lede={t.process.lede}
        />

        {/* Trinh bay nhu cac dong lenh noi tiep nhau trong mot khoi terminal */}
        <ol className="mt-10 overflow-hidden rounded-lg border border-line">
          {t.process.steps.map((step, i) => {
            const duration = PROCESS_DURATIONS[i] ?? '';
            return (
              <Reveal
                key={step.cmd}
                as="li"
                delay={i * 80}
                className={`block bg-surface px-5 py-5 ${i > 0 ? 'border-t border-line' : ''}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-mono text-[0.85rem]">
                    <span className="text-accent">$</span>{' '}
                    <span className="text-fg">{step.cmd}</span>
                  </p>
                  <p className="font-mono text-[0.75rem] text-muted">
                    {String(i + 1).padStart(2, '0')}/04
                    {duration && <span className="text-accent"> · {duration}</span>}
                  </p>
                </div>

                <h3 className="mt-3 text-base font-semibold text-fg">{step.name}</h3>
                <p className="mt-1 max-w-3xl text-[0.9rem] leading-relaxed text-muted">
                  {step.detail}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
