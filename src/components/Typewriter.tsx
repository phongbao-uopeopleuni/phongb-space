import { useEffect, useRef, useState } from 'react';

const SPEED_MS = 55;

type Props = {
  text: string;
  className?: string;
};

/**
 * Go tung ky tu khi cuon toi, theo sau la con tro nhap nhay.
 *
 * Chuoi day du nam trong mot the sr-only cho trinh doc man hinh; phan go dan duoc
 * aria-hidden. Neu khong lam vay, trinh doc man hinh se doc tung mau chu do dang.
 */
export function Typewriter({ text, className = '' }: Props) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(text.length); // hien nguyen van, khong go
      setStarted(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started || shown >= text.length) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), SPEED_MS);
    return () => clearTimeout(id);
  }, [started, shown, text.length]);

  return (
    <span ref={hostRef} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        <span className="caret">▍</span>
      </span>
    </span>
  );
}
