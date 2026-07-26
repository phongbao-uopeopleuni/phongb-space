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
 * Ba goi dich vu.
 *
 * `timelineDays` chi ghi CON SO, khong ghi don vi: don vi ("ngay" / "days") nam trong
 * src/i18n.tsx de ban tieng Anh khong hien chu tieng Viet. Viet '1-3 ngay' vao day
 * thi khach My se doc thay '1-3 ngay'.
 *
 * TODO: dien `priceFrom` (khoang gia "tu ...") cho ca ba goi, va `timelineDays` cho
 * goi standard va premium. Chuoi rong se duoc render thanh "dang cap nhat".
 */
export const PRICING = {
  basic: {
    priceFrom: '' as string,
    timelineDays: '1–3' as string,
  },
  standard: {
    priceFrom: '' as string,
    timelineDays: '' as string,
  },
  premium: {
    priceFrom: '' as string,
    timelineDays: '' as string,
  },
} as const;

/**
 * Thoi gian tung buoc trong quy trinh, theo dung thu tu 4 buoc o src/i18n.tsx.
 * TODO: dien thoi gian thuc te (vi du '20-30 phut', '2-3 ngay'). Buoc nao con rong
 * thi khong render nhan thoi gian, tranh hien so bia.
 */
export const PROCESS_DURATIONS: readonly string[] = ['', '', '', ''];

/**
 * Chi phi duy tri hang nam (ten mien + hosting).
 * TODO: dien khoang chi phi thuc te. Chuoi nay duoc chen vao cau tra loi FAQ
 * qua the {{upkeep}}; khi con rong se hien "dang cap nhat".
 */
export const YEARLY_UPKEEP = '' as string;

/**
 * Endpoint Formspree cho form lien he.
 * TODO: tao form tai https://formspree.io roi dan ID vao day (dang 'https://formspree.io/f/xxxxxxx').
 * Khi con rong, form se o trang thai vo hieu va chi hien nut Zalo — khong render nut gui
 * de tranh bam vao ma khong gui duoc di dau.
 */
export const FORMSPREE_ENDPOINT = '' as string;
