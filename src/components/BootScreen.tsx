import { useEffect, useState } from 'react';

const SESSION_KEY = 'bp-booted';
const DURATION = 1500;

// Dong log gia — co tinh viet bang tieng Anh ky thuat, khong dich, vi day la trang tri
const LOG_LINES = [
  'loading design system…',
  'mounting sections…',
  'ready.',
];

/**
 * Man hinh khoi dong dang terminal. Chi hien lan dau trong moi phien lam viec:
 * co luu vao sessionStorage nen chuyen trang hay quay lai khong bi xem lai.
 */
export function BootScreen() {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch {
      return false; // khong doc duoc storage thi bo qua hieu ung, khong chan noi dung
    }
  });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!show) return;

    // Nguoi dung yeu cau giam chuyen dong: tat luon, khong bat cho 1.5s
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* bo qua */
      }
      setShow(false);
      return;
    }

    const lineTimers = LOG_LINES.map((_, i) =>
      window.setTimeout(() => setVisibleLines(i + 1), 260 + i * 340),
    );

    const done = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* bo qua */
      }
      setShow(false);
    }, DURATION + 320); // 320ms cho hieu ung mo dan chay het

    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      // aria-hidden: day la trang tri, trinh doc man hinh khong can doc log gia
      aria-hidden="true"
      className="fixed inset-0 z-[150] flex items-center justify-center bg-bg px-6"
      style={{ animation: `fade-out 320ms ease ${DURATION}ms forwards` }}
    >
      <div className="w-full max-w-sm font-mono text-sm">
        <div className="flex items-center gap-3 text-fg">
          <span className="spin inline-block size-4 rounded-full border-2 border-line border-t-accent" />
          <span>bao-phong</span>
        </div>

        <div className="mt-4 min-h-[4.5rem] space-y-1 text-muted">
          {LOG_LINES.slice(0, visibleLines).map((line) => (
            <div key={line}>
              <span className="text-accent">$</span> {line}
            </div>
          ))}
        </div>

        <div className="mt-2 h-px w-full overflow-hidden bg-line">
          <div
            className="h-px bg-accent"
            style={{ animation: `boot-bar ${DURATION}ms linear forwards` }}
          />
        </div>
      </div>
    </div>
  );
}
