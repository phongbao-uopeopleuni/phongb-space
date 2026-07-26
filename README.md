# phongb-space

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
npm run assets
```

- `dev` — chay may chu phat trien tai http://localhost:5173
- `build` — `tsc --noEmit` roi `vite build`, ket qua trong `dist/`
- `typecheck` — chi kiem tra kieu
- `og` — sinh lai `public/og-image.png` (1200x630) bang sharp
- `icons` — sinh lai favicon va apple-touch-icon
- `assets` — chay ca `icons` va `og`
- `shots` — chup lai anh man hinh 5 website that (Playwright)
- `preview:pages` — xem ban build **dung base `/phongb-space/`** nhu khi deploy
- `smoke` — kiem tra khoi ban build production (xem duoi)
- `audit` — chay Lighthouse tren ban build production (xem duoi)

## Kiem tra truoc khi push

```bash
npm run build
```

```bash
npm run preview:pages
```

Roi o cua so khac:

```bash
npm run smoke
```

`smoke` mo trang bang trinh duyet sach, cuon het trang roi kiem tra: co ve ra chu khong,
co loi console hay request 404 khong, 5 anh du an co tai du khong va trinh duyet co chon
dung ban 800px khong, 37 hieu ung hien dan co chay khong, JSON-LD co khong, font co con
chan hien thi khong, va tran ngang o 375 / 414 / 768 / 1280 / 1440px. In `DAT` hoac
`CHUA DAT` va tra ve ma thoat tuong ung.

```bash
npm run audit
```

`audit` chay Lighthouse tren cung ban build do.

**Phai dung `preview:pages` chu khong phai `preview`.** `vite preview` khong co bien
`GITHUB_PAGES` nen phuc vu o base `/`, trong khi `dist` build ra tro toi
`/phongb-space/assets/...` — ket qua la 404 bundle, trang trang, va moi phep do deu sai.

Hai luu y khi doc ket qua `audit`:

- Chay tren `localhost` nen khong co do tre mang that va khong qua CDN — diem tuyet doi
  se dep hon PageSpeed Insights. Cai dang tin la **tung audit cu the**, nhat la
  `render-blocking-insight` va `image-delivery-insight`, vi chung phan anh cau truc
  trang chu khong phai duong truyen.
- `Best Practices` khong bao gio dat 100 o local vi `is-on-https` that bai tren
  `http://localhost`. Tren ban deploy that (HTTPS) muc nay dat 100.
- Script chan san `*kaspersky-labs.com*`: phan mem diet virus chen JavaScript vao moi
  trang http tren may va no chan hien thi hon 2 giay, lam sai lech toan bo phep do.
  Neu may ban dung phan mem khac ma diem Performance thap bat thuong, xem muc
  `render-blocking-insight` de biet script nao bi chen vao.

## Logo

Hinh khoi: con chip vuong bo goc, goc tren phai vat cheo nhu chan mach in, ben trong la
dau nhac lenh `>_`. Wordmark la `phongb-space` kem con tro nhap nhay.

Toa do duong dan SVG nam o **hai cho phai giu khop nhau**:

| File | Dung cho |
|---|---|
| [src/components/Logo.tsx](src/components/Logo.tsx) | Logo tren trang (thanh dieu huong, man hinh boot) |
| [scripts/logo-shape.mjs](scripts/logo-shape.mjs) | Favicon, apple-touch-icon, logo trong anh og |

Sua toa do o mot ben thi phai sua ca ben kia, khong thi logo tren trang va logo tren tab
trinh duyet se lech nhau. Sua xong chay `npm run assets` de sinh lai file anh.

Hai bien the mau, co tinh khac nhau:

- **Trong trang**: nen `#10141c`, vien `#1e2430`, glyph `#4ade80` — hoa vao giao dien toi.
- **Favicon / apple-touch-icon**: nen `#4ade80` dac, glyph `#06130b`. O co 16px tren tab
  trinh duyet, bien the nen toi gan nhu bien mat; bien the nen xanh thi noi bat tren ca
  theme sang va theme toi.

Duong dan favicon trong `index.html` la **tuong doi, khong co dau `/` o dau**. Dat
`/favicon.svg` thi icon vo khi deploy o project page `/phongb-space/`.

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
   ├─ Logo  BootScreen  CustomCursor  ScrollProgress  Nav  Reveal  SectionHead  Typewriter
   └─ sections/   Hero · Works · Services · Process · Deliverables · Faq · Contact · Footer
```

### Them mot san pham moi

Sua **mot cho duy nhat**: them mot object vao mang trong `src/data/works.ts`.
Moi du an tu chua ca `vi` va `en`, nen khong phai sua hai mang song song.

### Anh chup man hinh san pham

Khong them file bang tay — chay `npm run shots`. Script mo tung website that trong
Chromium, chup dung khung nhin 1600x900 (ra chinh xac 16:9, khop khoi `aspect-video`
nen thay anh vao bo cuc khong nhay) roi xuat WebP hai kich thuoc `-800` va `-1600`
de dung `srcset`. Danh sach URL import thang tu `src/data/works.ts`.

Chi tiet o [public/images/works/README.md](public/images/works/README.md).

Du an chua co anh thi de `coverReady: false`: the hien khoi giu cho
`$ screenshot --pending` thay vi `<img>`, tranh request 404 va loi console.

## Cho can dien

Toan bo nam trong [src/data/config.ts](src/data/config.ts), danh dau `TODO`:

| Hang so | Noi dung |
|---|---|
| `PRICING.standard/premium.timelineDays` | So ngay ban giao hai goi lon — **chi ghi so**, vi du `'5–7'` |
| `PROCESS_DURATIONS` | Thoi gian 4 buoc trong quy trinh |
| `STATS.avgDeliveryDays` | Thoi gian ban giao trung binh (dai so lieu o hero) |
| `FORMSPREE_ENDPOINT` | Endpoint Formspree cho form lien he |
| `SITE_URL` | Ten mien chinh thuc cua trang nay |

Da dien xong: `PRICING.*.priceFrom` / `priceTo`, `PRICING.basic.timelineDays`,
`YEARLY_UPKEEP_MAX`, `YEARLY_MAINTENANCE`.

### Quy uoc: so nam trong du lieu, don vi nam trong i18n

Tien va so ngay luu duoi dang **so thuan** trong `config.ts`, khong phai chuoi. Don vi
(`ngay`/`days`, `₫`/`VND`) nam trong `src/i18n.tsx`, con viec dinh dang do
`src/lib/copy.ts` lo bang `Intl.NumberFormat`.

Ly do: viet san `'5.000.000 d'` vao config thi khach xem ban tieng Anh se doc thay dau
phan cach kieu Viet — voi nguoi My, `5.000.000` doc ra la "nam phay khong khong khong".

Hai the `{{upkeep}}` va `{{maintenance}}` trong cau tra loi FAQ duoc `fillCopy()` thay
bang so da dinh dang. **Ca phan hien tren trang va phan JSON-LD deu goi cung ham nay** —
schema lech chu voi noi dung nguoi doc nhin thay la ly do Google phat.

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

Phai sua **ba** cho, thieu mot cai la co thu hong:

1. `index.html` — cac URL tuyet doi: `canonical`, `og:url`, `og:image`, `twitter:image`
2. `vite.config.ts` — dat `base` ve `'/'` (ten mien rieng thi khong con duong dan con)
3. **Formspree → project "My First Project" → Settings → Restrict to Domain** — doi sang
   ten mien moi. Khong doi thi form ngung nhan, tra ve 403 va khach thay thong bao
   "Form chi nhan gui tu trang chinh thuc".

Nho sua ca `SITE_URL` trong `src/data/config.ts` cho khop.

## Form lien he

Backend la **Formspree goi FREE**, khong co server nao cua minh.

| | |
|---|---|
| Endpoint | `https://formspree.io/f/mdaqynja` (trong `src/data/config.ts`) |
| Ten form | Lien he phongb-space |
| Project | My First Project |
| Email nhan | baophongcmu@gmail.com |
| Loc spam | Formshield (chay ngam). CAPTCHA **tat** — khach la chu quan an, khong bat giai captcha |

Endpoint **khong phai bi mat**: moi trang dung Formspree deu de chuoi nay trong HTML cong
khai. Cai bao ve endpoint la muc Restrict to Domain, khong phai viec giau chuoi.

### Cach form hoat dong

Goi `fetch` POST kem header `Accept: application/json`, body la `FormData`. Khong dung
tinh nang `_next` (redirect sau khi gui) vi do la tinh nang tra phi — moi thong bao
thanh cong/that bai deu xu ly bang JavaScript sau khi co phan hoi.

Truong an gui kem:

- `_subject` — tieu de email, lay tu `FORM_SUBJECT` trong config, de loc thu trong Gmail
- `language` — ngon ngu khach dang xem (`vi`/`en`), de biet nen tra loi bang tieng nao
- `_gotcha` — **honeypot**. O nhap dat ngoai khung nhin (`left: -9999px`, khong dung
  `display:none` vi mot so bot bo qua o bi an hoan toan), `tabIndex={-1}` va boc trong
  `aria-hidden` nen nguoi dung ban phim va trinh doc man hinh khong bao gio cham vao.
  Neu o nay co gia tri thi **bao thanh cong nhung khong gui gi ca** — noi that voi bot
  chi giup no thu lai.

### Thong bao loi theo tung nguyen nhan

Bao chung mot cau "gui that bai" thi khach khong biet nen lam gi tiep. Cac truong hop:

| Tinh huong | Thong bao |
|---|---|
| HTTP 403 | Bi Restrict to Domain chan, hoac form bi vo hieu hoa |
| HTTP 429 | Het han muc luot gui trong thang |
| HTTP khac | Loi chung, huong khach sang Zalo |
| `fetch` nem loi | Khong ra duoc mang — khac han loi tu phia Formspree |

Kiem tra phia client truoc khi goi mang: ten toi thieu 2 ky tu, so dien thoai toi thieu
8 chu so (bo qua dau cach, dau cham, `+84`), email chi kiem neu co nhap. Form dat
`noValidate` de thong bao loi ra dung ngon ngu dang xem, thay vi de trinh duyet hien
bong bong theo ngon ngu he dieu hanh.

### Restrict to Domain DA BAT — khong test form o localhost duoc nua

Muc "Restrict to Domain" trong Settings cua project da luu gia tri
`phongbao-uopeopleuni.github.io` (kiem tra 26/07/2026: tai lai trang van con gia tri,
va API cua Formspree tra ve `domain_whitelist` dung chuoi do).

Hau qua can biet truoc: **gui form tu `localhost` gio tra ve HTTP 403.** Do la dung y
muon, khong phai loi. Khach se thay dong "Form chi nhan gui tu trang chinh thuc" —
nhanh 403 da duoc xu ly san trong `src/components/sections/Contact.tsx`.

Nen muon thu form that thi phai **deploy roi thu tren ban live**. `npm run smoke` khong
bi anh huong vi no khong gui form, chi kiem tra markup va bo cuc.

Neu doi sang ten mien rieng ma quen doi muc nay thi form ngung nhan hoan toan, va
**khong co loi nao trong code** de lan ra — xem muc "Neu doi sang ten mien rieng".

### Han muc goi free

50 luot gui moi thang, dem rieng cho tung form, reset dau thang duong lich (xac nhan
tren trang Account ngay 26/07/2026). Goi free cung chi cho 2 dia chi email nhan.

Formspree co the doi con so nay — kiem tra lai o trang Account truoc khi tinh toan gi
dua vao no.

Het han muc thi form tra 429 va khach thay thong bao huong sang Zalo — khong bi im lang.
Day cung la kieu tan cong dang lo nhat voi form: khong can flood, chi can gui du 50 lan
la tat kenh nhan khach den het thang. Cac lop dang chan: Restrict to Domain (chan script
goi thang endpoint), honeypot `_gotcha`, va Formshield.

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
