import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '../../i18n';
import { works, type Work } from '../../data/works';
import { asset } from '../../lib/asset';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';

/**
 * Khoi anh bia. Luon giu ti le 16:9 (aspect-video) ke ca khi chua co anh, de khi thay
 * anh that vao thi bo cuc khong bi nhay.
 */
function Cover({ work, alt, featured }: { work: Work; alt: string; featured: boolean }) {
  const { t } = useI18n();
  // Neu anh ton tai nhung tai loi thi cung roi ve khoi giu cho, khong hien icon anh vo
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !work.coverReady || failed;

  // The noi bat chiem 2 cot (toi da ~1216px), the thuong chiem 1 cot (~600px tren
  // man hinh lon, ca chieu rong man hinh tren dien thoai). Bao dung `sizes` de trinh
  // duyet khong tai ban 1600px ve mot khung 380px.
  const sizes = featured
    ? '(min-width: 1200px) 1216px, 100vw'
    : '(min-width: 768px) 600px, 100vw';

  return (
    <div className="relative aspect-video overflow-hidden rounded-md border border-line bg-surface">
      {showPlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[0.75rem] text-muted">{t.works.screenshotPending}</span>
        </div>
      ) : (
        <img
          src={asset(`${work.cover}-1600.webp`)}
          srcSet={`${asset(`${work.cover}-800.webp`)} 800w, ${asset(`${work.cover}-1600.webp`)} 1600w`}
          sizes={sizes}
          width={1600}
          height={900}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover object-top"
        />
      )}
    </div>
  );
}

function WorkCard({ work, index }: { work: Work; index: number }) {
  const { t, lang } = useI18n();
  const c = work.copy[lang];
  const featured = Boolean(work.featured);

  return (
    <Reveal
      as="article"
      delay={(index % 2) * 90}
      className={featured ? 'md:col-span-2' : undefined}
    >
      <div className="card flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[0.75rem] text-muted">
            {String(index + 1).padStart(2, '0')} · <span className="text-accent">[{c.type}]</span>
          </p>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            {featured && (
              <span className="rounded border border-accent px-2 py-0.5 font-mono text-[10px] text-accent">
                {t.works.featured}
              </span>
            )}
            {work.wip && (
              <span className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
                {t.works.wip}
              </span>
            )}
          </div>
        </div>

        <Cover work={work} alt={t.works.screenshotAlt(c.name)} featured={featured} />

        <div className="flex flex-1 flex-col gap-3">
          <h3 className="text-lg font-semibold leading-snug text-fg">{c.name}</h3>
          <p className="text-[0.9rem] leading-relaxed text-muted">{c.summary}</p>

          <div>
            <p className="font-mono text-[0.75rem] text-accent">{t.works.scopeLabel}</p>
            <ul className="mt-2 space-y-1">
              {c.scope.map((item) => (
                <li key={item} className="flex gap-2 text-[0.85rem] leading-relaxed text-muted">
                  <span aria-hidden="true" className="text-line">
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-auto flex flex-wrap gap-2 pt-1">
            {work.stack.map((tech) => (
              <li key={tech} className="tech-tag">
                {tech}
              </li>
            ))}
          </ul>

          <a
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 font-mono text-[0.8rem] text-accent transition-opacity hover:opacity-75"
          >
            {t.works.visit}
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function Works() {
  const { t } = useI18n();

  return (
    <section id="works" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHead
          eyebrow={t.works.eyebrow}
          title={t.works.title}
          cmd={t.works.cmd}
          lede={t.works.lede}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {works.map((work, i) => (
            <WorkCard key={work.slug} work={work} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
