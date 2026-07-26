/**
 * Moi con so va thong tin lien he tap trung o day.
 * Nhung hang so danh dau TODO la cho Bao Phong tu dien — khong bia so trong code.
 */

/* ---------- Lien he (da xac nhan, dung duoc ngay) ---------- */
export const CONTACT = {
  name: 'Bảo Phong',
  email: 'baophongcmu@gmail.com',
  // Hien thi cho nguoi doc
  phoneDisplay: '077 575 3003',
  // Dang E.164 dung cho href tel: va zalo.me — Zalo chi nhan so khong khoang trang
  phoneRaw: '0775753003',
  zalo: 'https://zalo.me/0775753003',
  github: 'https://github.com/phongbao-uopeopleuni',
  facebook: 'https://www.facebook.com/pbao280/',
} as const;

/**
 * Ten mien chinh thuc cua trang nay.
 * TODO: chua quyet dinh. Hien dang dung GitHub Pages project page.
 * Khi doi sang ten mien rieng: sua o day, doi `base` trong vite.config.ts ve '/',
 * va sua og:url / og:image / twitter:image trong index.html.
 */
export const SITE_URL = 'https://phongbao-uopeopleuni.github.io/phongb-space/';

/* ---------- So lieu hero ---------- */
export const STATS = {
  delivered: 5,
  countries: 2,
  /**
   * Thoi gian ban giao trung binh.
   * TODO: dien so ngay thuc te (vi du '7-10'). De trong thi hero se an o so lieu nay.
   */
  avgDeliveryDays: '' as string,
} as const;

/**
 * Ba goi dich vu. Gia la khoang du kien, tinh bang VND.
 *
 * Gia luu duoi dang SO THUAN, khong phai chuoi: component dinh dang lai theo tung
 * ngon ngu bang Intl.NumberFormat (vi-VN cho ra 5.000.000, en-US cho ra 5,000,000).
 * Viet san '5.000.000 d' vao day thi khach My se doc thay dau phan cach kieu Viet.
 *
 * `timelineDays` cung chi ghi CON SO — don vi "ngay" / "days" nam trong src/i18n.tsx.
 *
 * Dat `null` cho muc nao chua chot; giao dien se hien "dang cap nhat".
 * TODO: dien `timelineDays` cho goi standard va premium.
 */
type Pkg = {
  priceFrom: number | null;
  priceTo: number | null;
  timelineDays: string;
};

export const PRICING: Record<'basic' | 'standard' | 'premium', Pkg> = {
  basic: {
    priceFrom: 500_000,
    priceTo: 800_000,
    timelineDays: '1–3',
  },
  standard: {
    priceFrom: 5_000_000,
    priceTo: 10_000_000,
    timelineDays: '',
  },
  premium: {
    priceFrom: 10_000_000,
    priceTo: 20_000_000,
    timelineDays: '',
  },
};

/**
 * Thoi gian tung buoc trong quy trinh, theo dung thu tu 4 buoc o src/i18n.tsx.
 * TODO: dien thoi gian thuc te (vi du '20-30 phut', '2-3 ngay'). Buoc nao con rong
 * thi khong render nhan thoi gian, tranh hien so bia.
 */
export const PROCESS_DURATIONS: readonly string[] = ['', '', '', ''];

/**
 * Hai khoan chi hang nam, TACH BIET nhau — dung gop lai khi viet noi dung:
 *
 * - `YEARLY_UPKEEP_MAX`: tran chi phi gia han ten mien + hosting. Khach dung ten va
 *   tra truc tiep cho nha cung cap, tien khong di qua Bao Phong.
 * - `YEARLY_MAINTENANCE`: phi bao tri mot nam, tra cho Bao Phong.
 *
 * Luu duoi dang so thuan de component dinh dang theo tung ngon ngu (xem PRICING).
 * Dat `null` neu chua chot; giao dien se hien "dang cap nhat".
 *
 * Hai gia tri nay duoc chen vao cau tra loi FAQ qua the {{upkeep}} va {{maintenance}}.
 */
export const YEARLY_UPKEEP_MAX: number | null = 1_000_000;
export const YEARLY_MAINTENANCE: number | null = 2_000_000;

/**
 * Endpoint Formspree cho form lien he.
 * TODO: tao form tai https://formspree.io roi dan ID vao day (dang 'https://formspree.io/f/xxxxxxx').
 * Khi con rong, form se o trang thai vo hieu va chi hien nut Zalo — khong render nut gui
 * de tranh bam vao ma khong gui duoc di dau.
 */
export const FORMSPREE_ENDPOINT = '' as string;
