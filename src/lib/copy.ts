import { YEARLY_MAINTENANCE, YEARLY_UPKEEP_MAX } from '../data/config';
import type { Lang } from '../i18n';

/**
 * Dinh dang so tien theo ngon ngu dang xem: vi-VN cho ra 5.000.000, en-US cho ra
 * 5,000,000. Gia tri luu trong config la so thuan de doi duoc ca hai kieu — viet san
 * chuoi vao config thi khach My se doc thay dau phan cach kieu Viet.
 */
export function money(amount: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US').format(amount);
}

/**
 * Thay the {{upkeep}} va {{maintenance}} trong chuoi FAQ bang so da dinh dang.
 *
 * Dung chung cho ca phan hien tren trang va phan JSON-LD: schema lech chu voi noi dung
 * nguoi doc nhin thay la ly do Google phat, nen hai ben phai goi cung mot ham.
 */
export function fillCopy(
  text: string,
  lang: Lang,
  currency: string,
  pending: string,
): string {
  const fmt = (n: number | null) => (n === null ? pending : `${money(n, lang)} ${currency}`);

  return text
    .replace('{{upkeep}}', fmt(YEARLY_UPKEEP_MAX))
    .replace('{{maintenance}}', fmt(YEARLY_MAINTENANCE));
}
