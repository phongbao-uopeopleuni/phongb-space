/**
 * Logo mark + wordmark.
 *
 * Y tuong: mot con chip vuong bo goc, goc tren phai vat cheo nhu chan mach in, ben
 * trong la dau nhac lenh `>_` mau nhan. Doc ra ngay la "terminal / lap trinh" nhung
 * van du don gian de con nhan dien duoc o co 16px tren tab trinh duyet.
 *
 * Hinh khoi nay dung chung cho ca favicon va anh og — sua o mot cho thi doi het.
 */

type MarkProps = {
  /** Kich thuoc canh, tinh bang px */
  size?: number;
  className?: string;
};

/** Duong bao con chip: goc tren phai vat cheo, ba goc con lai bo tron */
export const MARK_OUTLINE =
  'M9 1.25 H22.4 L30.75 9.6 V23 A7.75 7.75 0 0 1 23 30.75 H9 A7.75 7.75 0 0 1 1.25 23 V9 A7.75 7.75 0 0 1 9 1.25 Z';
/** Dau nhac lenh: chevron `>` */
export const MARK_CHEVRON = 'M9.6 11.9 L14.2 16.5 L9.6 21.1';
/** Con tro dac nam canh chevron */
export const MARK_CURSOR = { x: 16.4, y: 19.4, w: 6.8, h: 2.5, r: 1.25 };

export function LogoMark({ size = 22, className = '' }: MarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={MARK_OUTLINE} fill="var(--color-surface)" stroke="var(--color-line)" strokeWidth="1.5" />
      <path
        d={MARK_CHEVRON}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x={MARK_CURSOR.x}
        y={MARK_CURSOR.y}
        width={MARK_CURSOR.w}
        height={MARK_CURSOR.h}
        rx={MARK_CURSOR.r}
        fill="var(--color-accent)"
      />
    </svg>
  );
}

/**
 * Mark + chu `phongb-space` + con tro nhap nhay, dung cho thanh dieu huong.
 *
 * Duoi 640px chi hien mark: ban day du chiem 155px, cong nut lien he va nut hamburger
 * thi tran ra ngoai man hinh 375px va nut hamburger khong con bam duoc. Thanh nav la
 * `fixed` nen kieu tran nay khong lam xuat hien thanh cuon ngang de nhan ra.
 * Link boc ngoai da co aria-label nen an chu khong anh huong trinh doc man hinh.
 */
export function Logo({ size = 22 }: MarkProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} className="shrink-0" />
      <span className="hidden font-mono text-sm font-semibold tracking-tight sm:inline">
        phongb-space<span className="caret">▍</span>
      </span>
    </span>
  );
}
