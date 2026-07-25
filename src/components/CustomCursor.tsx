import { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, summary, input, textarea, [role="button"]';

/**
 * Cham nho bam sat chuot + vong tron chay theo co do tre, phong to khi re qua phan tu
 * tuong tac. Chi bat khi thiet bi co chuot thuc — tren cam ung khong render gi ca.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ok = fine.matches && !reduced.matches;
    setEnabled(ok);
    if (!ok) return;

    // Chi an con tro he thong khi con tro tuy bien thuc su dang chay
    document.body.classList.add('has-custom-cursor');
    return () => document.body.classList.remove('has-custom-cursor');
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Vong tron chay theo bang noi suy tuyen tinh moi frame -> tao do tre muot.
    // Scale phai nam trong cung chuoi transform nay, khong dung class scale-* cua
    // Tailwind duoc vi style inline se de len class.
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      scale += (targetScale - scale) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const hit = Boolean(target?.closest?.(INTERACTIVE));
      targetScale = hit ? 1.9 : 1;
      ringRef.current?.classList.toggle('bg-accent/10', hit);
    };

    // An con tro khi chuot ra khoi cua so
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[120] size-1.5 rounded-full bg-accent transition-opacity duration-200"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[120] size-7 rounded-full border border-accent/60 transition-[background-color,opacity] duration-200 ease-out"
      />
    </div>
  );
}
