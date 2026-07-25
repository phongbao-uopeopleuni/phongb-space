/**
 * Ghep duong dan tuong doi trong public/ voi BASE_URL cua Vite.
 *
 * Bat buoc di qua ham nay cho MOI file trong public/. Khi deploy len GitHub Pages dang
 * project page, base la '/<ten-repo>/' — dung '/images/a.jpg' truc tiep se tro ve goc
 * domain va anh vo het. Day la loi rat de mac.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL; // luon co dau '/' o cuoi
  return `${base}${path.replace(/^\/+/, '')}`;
}
