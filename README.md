# bao-phong-web

Trang gioi thieu dich vu thiet ke website ca nhan (freelance) cua Bao Phong.
Muc dich duy nhat: nguoi la vao xem, tin rang toi lam duoc, va bam nut lien he.
Trang duoc gui truc tiep cho khach qua Zalo va Facebook.

Song ngu Viet/Anh, mac dinh tieng Viet. Phong cach dev/terminal toi gian, nen toi.

## Cong nghe

Vite 6 · React 19 · TypeScript · Tailwind CSS v4 (`@tailwindcss/vite`) · lucide-react

Khong dung router — trang mot mach cuon doc, dieu huong bang anchor `#id`.
Khong dung thu vien animation — moi hieu ung lam bang CSS thuan va IntersectionObserver.

Tailwind v4 **khong dung `tailwind.config.js`**. Toan bo mau va font khai bao trong
khoi `@theme { }` o dau [src/index.css](src/index.css).

## Lenh

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run og
```

- `dev` — chay may chu phat trien tai http://localhost:5173
- `build` — `tsc --noEmit` roi `vite build`, ket qua trong `dist/`
- `typecheck` — chi kiem tra kieu
- `og` — sinh lai `public/og-image.png` (1200x630) bang sharp

## Cau truc

```
src/
├─ i18n.tsx              Context song ngu. Ban `vi` rang buoc `typeof en` nen TypeScript
│                        bao loi ngay khi mot ngon ngu thieu khoa. Luu chon vao localStorage.
├─ data/
│  ├─ config.ts          Lien he + MOI hang so con phai dien (xem "Cho can dien" ben duoi)
│  └─ works.ts           5 san pham that. Moi du an tu chua ca hai ngon ngu.
├─ lib/asset.ts          asset() — bat buoc dung cho moi file trong public/
├─ hooks/useReveal.ts    IntersectionObserver, ngat ket noi sau lan dau
└─ components/
   ├─ BootScreen  CustomCursor  ScrollProgress  Nav  Reveal  SectionHead  Typewriter
   └─ sections/   Hero · Works · Services · Process · Deliverables · Faq · Contact · Footer
```

### Them mot san pham moi

Sua **mot cho duy nhat**: them mot object vao mang trong `src/data/works.ts`.
Moi du an tu chua ca `vi` va `en`, nen khong phai sua hai mang song song.

### Anh chup man hinh san pham

Chua co anh. Duong dan da khai bao san: `public/images/works/<slug>.jpg`.
Trong luc chua co anh, the hien khoi giu cho dang terminal `$ screenshot --pending`
voi **dung ti le 16:9**, nen khi thay anh that vao bo cuc khong bi nhay.

Sau khi them file anh, dat `coverReady: true` cho du an do trong `src/data/works.ts`.
Neu khong bat co nay thi `<img>` khong duoc render — co tinh nhu vay de trang khong
ban ra request 404 va khong sinh loi console khi anh chua ton tai.

## Cho can dien

Toan bo nam trong [src/data/config.ts](src/data/config.ts), danh dau `TODO`:

| Hang so | Noi dung |
|---|---|
| `PRICING.basic/standard/premium.priceFrom` | Khoang gia "tu ..." cua tung goi |
| `PRICING.basic/standard/premium.timeline` | Thoi gian ban giao tung goi |
| `PROCESS_DURATIONS` | Thoi gian 4 buoc trong quy trinh |
| `YEARLY_UPKEEP` | Chi phi duy tri hang nam (chen vao cau tra loi FAQ) |
| `STATS.avgDeliveryDays` | Thoi gian ban giao trung binh (dai so lieu o hero) |
| `FORMSPREE_ENDPOINT` | Endpoint Formspree cho form lien he |
| `SITE_URL` | Ten mien chinh thuc cua trang nay |

Cho nao con rong thi giao dien hien "dang cap nhat" thay vi mot con so bia.
Rieng `FORMSPREE_ENDPOINT` con rong thi form bi vo hieu va **khong render nut Gui** —
khach chi thay nut Zalo va so dien thoai, khong co nut nao bam vao ma khong di dau.

## Deploy — GitHub Pages

Workflow [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) chay
khi push len `main`, dung `actions/upload-pages-artifact` + `actions/deploy-pages`, Node 20.

Trong Settings → Pages cua repo, dat **Source = GitHub Actions**.

Vi day la project page (URL dang `https://<user>.github.io/<ten-repo>/`):

- `vite.config.ts` dat `base` theo bien moi truong `GITHUB_PAGES`; workflow set
  `GITHUB_PAGES: 'true'` khi build.
- **Moi duong dan tro toi file trong `public/` phai di qua `asset()`** trong
  [src/lib/asset.ts](src/lib/asset.ts), ham nay cong them `import.meta.env.BASE_URL`.
  Dung `/images/...` truc tiep thi anh vo het khi deploy. Day la loi rat de mac.
- `public/.nojekyll` de GitHub Pages khong chay Jekyll qua file build.

### Neu doi sang ten mien rieng

Phai sua **ca hai** cho, khong thi anh xem truoc tren Zalo/Facebook se hong:

1. `index.html` — cac URL tuyet doi: `canonical`, `og:url`, `og:image`, `twitter:image`
2. `vite.config.ts` — dat `base` ve `'/'` (ten mien rieng thi khong con duong dan con)

Nho sua ca `SITE_URL` trong `src/data/config.ts` cho khop.

## Anh xem truoc khi gui link (og:image)

Trang nay sinh ra de gui qua Zalo va Facebook, nen anh xem truoc la bat buoc.

`scripts/make-og-image.mjs` render SVG ra PNG **1200x630** bang `sharp`, dung dung bang mau
cua design system. Chay lai bang `npm run og` sau khi doi noi dung anh.

`og:image` la **URL tuyet doi tro toi file PNG**. Crawler cua Facebook, Zalo va LinkedIn
khong doc duoc data URI, khong render SVG, va khong tu ghep duong dan tuong doi.

Script chi dinh ten font cu the (`Segoe UI`, `Consolas`…) thay vi alias `sans-serif` /
`monospace`: librsvg tra alias qua fontconfig va o weight 400 no de roi vao mot font serif
khong co glyph dau tieng Viet, chu bi thay the tung ky tu. Neu render tren may khac ma chu
doi kieu, them ten font co san vao hai hang `SANS` / `MONO` trong script.

## Kha nang tiep can

- Moi `img` co `alt` dung nghia, anh trang tri de `alt=""`
- Khoi anh co ti le co dinh san (`aspect-video`) nen khong nhay bo cuc khi anh tai xong
- Hieu ung go chu co `sr-only` chua chuoi day du, phan go dan `aria-hidden`
- Skip link an, chi hien khi focus bang ban phim
- `:focus-visible` vien mau nhan 2px, `outline-offset: 2px`
- Accordion FAQ dieu khien duoc bang ban phim, co `aria-expanded` / `aria-controls`
- Thu tu heading dung cap: h1 → h2 → h3, khong nhay bac
- **Moi hieu ung tu tat khi `prefers-reduced-motion: reduce`** (khoi `@media` cuoi
  `src/index.css`, ep `animation-duration` / `transition-duration` ve `0.01ms` va tat
  `scroll-behavior: smooth`)
- Con tro chuot tuy bien **chi bat khi `(hover: hover) and (pointer: fine)`**, khong bao
  gio bat tren thiet bi cam ung

## Lien he

Bao Phong · baophongcmu@gmail.com · Zalo 077 575 3003
