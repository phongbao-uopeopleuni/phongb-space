import { useEffect, useRef } from 'react';

/** Thanh tien trinh cuon manh o dinh trang. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
      }
    };

    // Gom nhieu su kien scroll vao mot frame de khoi tinh lai lien tuc
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[110] h-0.5 bg-transparent">
      <div ref={barRef} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
