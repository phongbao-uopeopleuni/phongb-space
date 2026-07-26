# Viec dang cho

Cap nhat: 26/07/2026. Viet o day thay vi de trong chat de lan sau mo lai la co du context.

Doc kem [README.md](README.md) — cac quy uoc ky thuat nam o do, file nay chi ghi
**nhung gi chua quyet va nhung gi chua lam**.

---

## 1. DANG SUY NGHI — Bao ve nhanh `main`

Day la viec duy nhat dang cho quyet dinh, khong phai cho thuc hien.

### Boi canh

6 GitHub App dang co quyen tren repo: ChatGPT Codex Connector, Claude Design Import,
Cursor, Railway App, Render, Vercel. Bao Phong xac nhan **dang dung ca 6 nen giu nguyen**.

Diem quan trong nhat cua ca dot audit: **2FA khong bao ve duoc truoc app da cai.** Moi app
giu token rieng; nha cung cap app bi xam nhap thi ke tan cong dung token do, khong qua
duong dang nhap, khong co canh bao nao. 2FA cua tai khoan da cau hinh tot (authenticator
app + GitHub Mobile, khong dung SMS, co recovery code) nhung khong lien quan tai day.

Repo deploy tu dong tu `main` bang GitHub Actions, nen ai ghi duoc vao `main` la dua duoc
code tuy y len website dang phuc vu khach that.

### Trang thai hien tai — da xac nhan qua API, khong phai phong doan

```
gh api repos/phongbao-uopeopleuni/phongb-space/branches/main/protection
  -> 404 "Branch not protected"

gh api repos/phongbao-uopeopleuni/phongb-space/rulesets
  -> rong, khong co ruleset nao

gh api repos/phongbao-uopeopleuni/phongb-space/collaborators
  -> chi phongbao-uopeopleuni (admin=True, push=True). Khong co nguoi thu hai.
```

Khong co SSH key, GPG key, deploy key, hay classic PAT nao ton tai. Mot fine-grained PAT
`phongb_api` da het han. Workflow `GITHUB_TOKEN` o muc chi doc, Actions khong duoc tu tao
hay duyet PR — day la cau hinh dung.

### Hai phuong an

**A — chan force-push + chan xoa nhanh**

- Khong doi cach lam viec, van push thang len `main` duoc.
- Chan duoc kich ban xoa lich su va xoa nhanh.
- **KHONG chan duoc** mot commit thuong tu app co `contents: write`. App van push duoc va
  workflow van tu deploy commit do.

**B — A cong them "Require a pull request before merging"**

- Chan duoc ca commit thuong: moi thay doi phai qua PR.
- Doi lai push thang len `main` khong con duoc, **ke ca tu phien Claude Code** — cach lam
  viec doi thanh tao nhanh, mo PR, review roi merge.
- Co the them **Repository admin vao danh sach bypass** de giu duoc su thuan tien.

### DIEU CHUA XAC THUC — doc truoc khi chon B

Neu them admin vao bypass, app **server-to-server** se bi chan, nhung cong cu AI viet code
thuong hanh dong bang token **thay mat nguoi dung**. Truong hop do no thua huong quyen
bypass cua chinh Bao Phong va rao chan vo hieu.

Chua kiem chung duoc dieu nay qua API. **Dung gia dinh B chac chan chan duoc app.**

### De xuat cua Claude

Chon **A** ngay — khong co nhuoc diem nao. Chon **B** chi khi muon quy trinh PR vi ly do
khac (vi du muon xem diff truoc khi noi dung len website), chu khong phai de phong app,
vi phan chan-duoc-app cua B chua duoc xac thuc.

Lam bang `gh` duoc, Claude Code lam duoc ngay khi co quyet dinh. Hoac lam tay tai
https://github.com/phongbao-uopeopleuni/phongb-space/settings/rules

### Mot phan biet chua duoc tra loi

**Dung mot app khong dong nghia app do can quyen tren REPO NAY.** GitHub App co muc chon
pham vi: *All repositories* hoac *Only select repositories*. Railway / Render / Vercel la
ba nen tang deploy, ma repo nay chay tren **GitHub Pages** — chung khong co viec gi o day.

Neu dang o "All repositories" thi doi sang chon tung repo: van dung ca 6 app nhu hien tai
cho cac project khac, chi la chung khong ghi duoc vao repo nay. Khong mat gi.

Chua biet hien tai tung app dang o pham vi nao — endpoint liet ke quyen cua app can
user-to-server token, PAT khong doc duoc. Phai tu xem tai
https://github.com/settings/installations

---

## 2. CHUA LAM — Siet policy Actions

Trang thai: *"Allow all actions and reusable workflows"* (cho phep action tu bat ky ai),
va *"Require actions to be pinned to a full-length commit SHA"* **khong bat**.

Day la cai dang lam nhat trong ca dot audit, vi **loi ich khong phu thuoc vao viec app co
dang tin hay khong**. Giu 6 app co quyen ghi nghia la 6 nguon co the them file workflow
moi; co rao chan thi workflow do khong keo ve duoc action la tu bat ky dau.

### Viec can lam

Tai Settings -> Actions -> General:

1. Chon *"Allow phongbao-uopeopleuni, and select non-phongbao-uopeopleuni, actions"*
2. **PHAI tich "Allow actions created by GitHub"** — ca 5 action trong workflow deu thuoc
   org `actions/`. Quen tich o nay thi ca 5 bi chan cung luc va deploy fail ngay.
3. Bat *"Require actions to be pinned to a full-length commit SHA"*

### Rui ro da biet — action long nhau

Da kiem tra noi dung `action.yml` cua ca 5 action tai dung SHA dang ghim:

| Action | Loai | Goi action long ben trong |
|---|---|---|
| `checkout` | JS node20 | khong |
| `setup-node` | JS node20 | khong |
| `configure-pages` | JS node20 | khong |
| `deploy-pages` | JS node20 | khong |
| **`upload-pages-artifact`** | **composite** | **`actions/upload-artifact@v4`** ← the di dong |

Nam dong `uses:` trong workflow da tuan thu san (SHA du 40 ky tu). Nhung
`upload-pages-artifact` ben trong goi `actions/upload-artifact@v4` bang **the**, khong ghim.

**Chua biet policy co xet ca action long hay khong.** Neu co xet thi deploy fail va minh
khong sua duoc — do la action cua chinh GitHub. Phai thu moi biet.

### Cach thu an toan

**Workflow fail KHONG lam sap website.** GitHub Pages tiep tuc phuc vu ban deploy thanh
cong gan nhat. Hau qua toi da la thay doi moi chua duoc publish cho toi khi sua xong.

1. Bat **mot** cai dat, khong bat ca hai cung luc
2. Tab Actions -> **Run workflow** (`workflow_dispatch` da bat san, khong can push commit rac)
3. Fail thi doc log roi tat cai dat do di

Neu ghim-SHA lam fail vi action long, thi siet nguon action mot minh van dat phan lon loi ich.

### Ghi chu ve gia tri thuc

Ghim SHA cho action thuoc org `actions/` co gia tri **thap hon ve ngoai**: GitHub da kiem
soat runner, `GITHUB_TOKEN` va toan bo co che deploy Pages. Viec ghim co y nghia that voi
action **ben thu ba** — ma hien khong dung cai nao. Tien le dang nho la
`tj-actions/changed-files` bi chiem nam 2025, do la action ben thu ba.

Bat van nen bat, vi day la **rao chan cho tuong lai**, khong phai chua hien tai.

---

## 3. CHUA LAM — Viec don gian

- **Xoa PAT `phongb_api`** da het han, cho gon: https://github.com/settings/tokens
- **Thu hoi 10 OAuth app khong dung**: 9 app "Never used" (ChatGPT Verification, Cloudflare,
  Cursor, dbdiagram.io, LM Studio Developer Hub, PlanetScale, Programiz PRO Login,
  roadmap.sh, Supabase) + JetBrains IDE Integration (7 thang khong dung).
  https://github.com/settings/applications
- **Xem yeu cau quyen moi cua Cursor** — co banner "Permission updates requested" dang cho
  duyet. Doc xem xin them gi truoc khi bam Approve.
- **Nang cap "Require approval for all external contributors"** cho fork PR (hien o muc
  giua: "first-time contributors"). Repo ca nhan nen sieet duoc.

---

## 4. CHUA DIEN — Hang so trong `src/data/config.ts`

| Hang so | Noi dung |
|---|---|
| `PRICING.standard.timelineDays` | So ngay ban giao goi Standard — **chi ghi so**, vi du `'5–7'` |
| `PRICING.premium.timelineDays` | So ngay ban giao goi Nang cao |
| `PROCESS_DURATIONS` | Thoi gian 4 buoc quy trinh |
| `STATS.avgDeliveryDays` | Thoi gian ban giao trung binh (dai so lieu o hero) |

Cho nao con rong thi giao dien hien "dang cap nhat" thay vi so bia.

Da dien xong: gia ba goi, `PRICING.basic.timelineDays`, `YEARLY_UPKEEP_MAX`,
`YEARLY_MAINTENANCE`, `FORMSPREE_ENDPOINT`.

### Mot cau hoi noi dung chua tra loi

Muc ban giao ghi *"Ho tro ngay sau ban giao"* va *"Bao tri cho nhung nam tiep theo la mot
goi rieng"* — nhung **chua chot giai doan ho tro mien phi keo dai bao lau** (30 ngay?
3 thang?). Khach se hoi. Noi duoc con so thi muc do thuyet phuc hon nhieu.

---

## 5. DE XUAT — Chua lam, can quyet dinh

### Font va duong render — DA LAM

Da bo Google Fonts, chuyen sang system font:

- Khong con ben thu ba thay IP cua khach
- Khong con request font chan hien thi
- CSP da siet ve `style-src 'self' 'unsafe-inline'` va `font-src 'self'`

Muc tieu la toc do va do on dinh, nen dung font san co tren he dieu hanh thay vi them hai
file font vao repo.

### Prerender — DA LAM

Build hien sinh client bundle + SSR bundle, sau do `scripts/prerender.mjs` chen toan bo
noi dung va JSON-LD vao `dist/index.html`. React dung `hydrateRoot`; tat JavaScript van
doc duoc trang.

`npm run smoke` co context tat JavaScript de chan hoi quy. CI chay smoke va Lighthouse
budgets truoc moi lan deploy.

### Bay thoi gian tren form — DA RUT LAI

Truoc co de xuat, nay **khong con khuyen nghi**. Ba lop dang co (Restrict to Domain,
honeypot `_gotcha`, Formshield) da chan het cac loai tan cong thuc te. Bay thoi gian chi
them gia tri voi ke vua gia duoc header `Referer`, vua biet tranh o an, vua qua duoc
Formshield — ai lam duoc ca ba viec do thi cung them duoc `sleep(5)` vao script.

Chi lam khi **thay spam that lot vao hop thu**, luc do moi biet chan cai gi.

---

## Nhung gi da xong, khong phai lam lai

- **Form lien he**: endpoint Formspree da gan, honeypot, validate phia client, thong bao
  loi tach theo tung nguyen nhan (403 / 429 / loi khac / loi mang). Da thu that thanh cong,
  email ve dung hop thu voi truong `language`.
- **Formspree**: Restrict to Domain **da luu** `phongbao-uopeopleuni.github.io` (xac nhan
  hai duong: tai lai trang van con, va API tra ve `domain_whitelist` dung chuoi do).
  Formshield bat, CAPTCHA tat. Han muc 50 luot/thang, 2 dia chi email.
  **Hau qua: gui form tu localhost gio tra 403** — dung y muon, xem README.
- **CSP**: chen luc build qua plugin trong `vite.config.ts`, `script-src 'self'` khong kem
  `'unsafe-inline'`. Da kiem tra bang test duong va am: chen script inline bi chan, script
  tu CDN la bi chan, fetch sang domain ngoai danh sach bi chan, fetch sang formspree duoc phep.
- **Ghim SHA cho 5 GitHub Action** trong workflow (chua duoc policy cuong che — xem muc 2).
- **`npm audit`**: 0 vulnerabilities (da nang sharp 0.33 -> 0.35.3 vi 4 CVE libvips muc high).
- **W3C Nu Html Checker**: 0 messages.
- **Anh chup san pham**: `npm run shots` tu chup 5 site, xuat WebP hai kich thuoc dung srcset.
- **Kiem tra truoc khi push**: `npm run build:pages` roi `npm run verify:preview` — xem README.
- **Prerender + hydrate**: noi dung va JSON-LD co san trong HTML tinh; co test tat JavaScript.
- **Hieu nang mobile**: bo boot screen va Google Fonts; Lighthouse local co quality budgets.
- **CI quality gate**: dependency audit, build, smoke test va Lighthouse chay tren PR/deploy.
