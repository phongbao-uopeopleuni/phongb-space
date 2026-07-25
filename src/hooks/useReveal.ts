import { useEffect, useRef } from 'react';

/**
 * Gan class `is-in` cho phan tu khi no lot vao khung nhin, roi ngat ket noi ngay
 * sau lan dau — hieu ung chi chay mot lan, khong lam lai khi cuon nguoc.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Neu trinh duyet khong ho tro thi hien luon, khong de noi dung bi an vinh vien
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
