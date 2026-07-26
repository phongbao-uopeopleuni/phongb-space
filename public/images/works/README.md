# Anh chup man hinh san pham

**Khong them file bang tay.** Chay `npm run shots` — script tu mo tung website that
trong Chromium (Playwright), chup dung khung nhin 1600x900 roi xuat WebP hai kich thuoc.

```bash
npm run shots
```

Chup lai mot du an:

```bash
npm run shots -- fairys-house-hue
```

## File duoc sinh ra

Moi du an co hai file, ten lay theo `slug` trong `src/data/works.ts`:

- `<slug>-800.webp` — dien thoai tai ban nay
- `<slug>-1600.webp` — man hinh lon moi tai ban nay

Component `Cover` trong `src/components/sections/Works.tsx` tu ghep hai duong dan nay
thanh `srcset`, nen truong `cover` trong `works.ts` ghi **khong co duoi file**.

Truoc day chi co mot ban JPEG 1600px cho moi du an: Lighthouse do duoc 419 KiB tai
thua tren di dong. Sau khi tach hai kich thuoc WebP, con 42 KiB.

## Vi sao chup khung nhin chu khong phai ca trang

Chup dung 1600x900 cho ra chinh xac ti le 16:9, khop voi khoi `aspect-video` tren
trang — thay anh vao bo cuc khong nhay. Chup `fullPage` se ra anh rat cao va bi cat
xen khi hien thi.

## Du an chua co anh

Dat `coverReady: false` (hoac bo truong do) trong `src/data/works.ts`. The se hien khoi
giu cho `$ screenshot --pending` thay vi `<img>` — co tinh nhu vay de trang khong ban
ra request 404 va khong sinh loi console khi anh chua ton tai.
