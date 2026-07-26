import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { Logo } from './Logo';

// Thu tu nay phai khop voi thu tu section trong App.tsx de scroll-spy chay dung
const SECTIONS = ['works', 'services', 'process', 'deliverables', 'faq'] as const;
type SectionId = (typeof SECTIONS)[number];

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);

  const labels: Record<SectionId, string> = {
    works: t.nav.works,
    services: t.nav.services,
    process: t.nav.process,
    deliverables: t.nav.deliverables,
    faq: t.nav.faq,
  };

  // Scroll-spy: section nao dang chiem phan tren khung nhin thi duoc lam sang
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      // Vung nhan dien nam o dai giua khung nhin, tru chieu cao thanh dieu huong
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Dong menu mobile bang phim Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const nextLang = lang === 'vi' ? 'en' : 'vi';

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-line bg-bg/90 backdrop-blur">
      <nav aria-label={t.nav.mainNav} className="shell flex h-20 items-center justify-between gap-4">
        <a
          href="#top"
          aria-label="phongb-space"
          className="shrink-0 text-fg transition-colors hover:text-accent"
        >
          <Logo />
        </a>

        {/* Dieu huong desktop */}
        <ul className="hidden items-center gap-6 lg:flex">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? 'true' : undefined}
                className={`font-mono text-[0.8rem] transition-colors hover:text-accent ${
                  active === id ? 'text-accent' : 'text-muted'
                }`}
              >
                {labels[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(nextLang)}
            aria-label={`${t.nav.langLabel}: ${nextLang.toUpperCase()}`}
            className="rounded border border-line px-2 py-1 font-mono text-[0.7rem] text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <span className={lang === 'vi' ? 'text-accent' : ''}>vi</span>
            <span className="mx-1 text-line">/</span>
            <span className={lang === 'en' ? 'text-accent' : ''}>en</span>
          </button>

          {/* Hien o MOI do rong, ke ca dien thoai: muc tieu duy nhat cua trang la
              mot cu bam lien he, khong the de nut do chi nam trong menu hamburger.
              Khong dung .btn o day: nut nav can nho hon, viet class truc tiep de
              tranh phu thuoc vao thu tu utility cua Tailwind. */}
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-lg border border-accent bg-accent px-3 py-2 text-[0.8rem] font-semibold text-on-accent transition-colors hover:bg-[#6ee79b]"
          >
            {t.nav.contact}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="rounded border border-line p-2 text-muted transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg lg:hidden">
          <ul className="shell flex flex-col py-2">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-3 font-mono text-sm transition-colors hover:text-accent ${
                    active === id ? 'text-accent' : 'text-muted'
                  }`}
                >
                  {labels[id]}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-sm text-accent"
              >
                {t.nav.contact}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
