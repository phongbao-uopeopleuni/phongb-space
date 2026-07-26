/**
 * Danh sach san pham that.
 *
 * Moi du an tu chua ca hai ngon ngu. Co tinh khong dat trong src/i18n.tsx: neu de trong
 * i18n thi them mot du an phai sua hai mang song song va giu dung thu tu - rat de lech.
 * Voi cau truc nay, them mot website chi sua mot cho.
 */
export type Work = {
  slug: string;
  url: string;
  /** Duong dan tuong doi trong public/. Phai di qua asset() truoc khi dat vao src. */
  cover: string;
  /**
   * Bat len khi da co file anh that trong public/images/works/.
   * De false thi render khoi giu cho thay vi <img>, tranh request 404 va loi console.
   */
  coverReady?: boolean;
  stack: string[];
  wip?: boolean;
  featured?: boolean;
  copy: {
    // `scope` (hang muc da lam) nam trong `copy` chu khong o cap ngoai: day la chuoi
    // hien thi nen phai co ban tieng Anh, va de o day thi van giu duoc nguyen tac
    // "them mot du an chi sua mot cho".
    vi: { name: string; type: string; summary: string; scope: string[] };
    en: { name: string; type: string; summary: string; scope: string[] };
  };
};

export const works: Work[] = [
  {
    slug: 'phong-tuy-bien-quan-cong',
    url: 'https://www.phongtuybienquancong.info/',
    cover: 'images/works/phong-tuy-bien-quan-cong.jpg',
    coverReady: true,
    stack: ['Web app', 'Cloudflare'],
    featured: true,
    copy: {
      vi: {
        name: 'Gia phả online Phòng Tuy Biên Quận Công',
        type: 'gia phả dòng họ',
        summary:
          'Web app gia phả cho dòng họ Nguyễn Phước Tộc: cây gia phả tương tác, tra cứu thành viên và mộ phần, xem tốt trên điện thoại.',
        scope: [
          'Thiết kế và phát triển toàn bộ hệ thống',
          'Cây gia phả tương tác',
          'Tìm kiếm thành viên, thống kê thông tin…',
          'Tra cứu mộ phần',
          'Đăng ký tài khoản thành viên',
          'Mục tin tức và album dòng họ',
          'Đếm ngược ngày giỗ theo lịch âm',
        ],
      },
      en: {
        name: 'Phong Tuy Bien Quan Cong Family Tree',
        type: 'family genealogy',
        summary:
          'A genealogy web app for the Nguyen Phuoc clan: an interactive family tree, member and gravesite lookup, built to read well on phones.',
        scope: [
          'Full system design and development',
          'Interactive family tree',
          'Member search, statistics and more',
          'Gravesite lookup',
          'Member account registration',
          'Clan news and photo albums',
          'Lunar-calendar memorial day countdown',
        ],
      },
    },
  },
  {
    slug: 'ec-pho-noodle-house',
    url: 'https://www.ecphonoodlehousenc.com/home-page',
    cover: 'images/works/ec-pho-noodle-house.jpg',
    coverReady: true,
    stack: ['React', 'Vite', 'Vercel', 'schema.org'],
    copy: {
      vi: {
        name: 'EC Phở Vietnamese Noodle House',
        type: 'nhà hàng',
        summary:
          'Nhà hàng tại Greenville, North Carolina, Hoa Kỳ. Website giới thiệu và thực đơn, gắn dữ liệu có cấu trúc để khách quanh vùng tìm thấy trên Google.',
        scope: [
          'Website giới thiệu và thực đơn',
          'Trang Gallery, Blog, Contact',
          'Dữ liệu có cấu trúc schema.org Restaurant phục vụ tìm kiếm địa phương',
        ],
      },
      en: {
        name: 'EC Pho Vietnamese Noodle House',
        type: 'restaurant',
        summary:
          'A restaurant in Greenville, North Carolina, USA. Menu and info site with structured data so nearby diners find it on Google.',
        scope: [
          'Menu and information website',
          'Gallery, Blog and Contact pages',
          'schema.org Restaurant structured data for local search',
        ],
      },
    },
  },
  {
    slug: 'fairys-house-hue',
    url: 'https://www.fairyshousehue.com/',
    cover: 'images/works/fairys-house-hue.jpg',
    coverReady: true,
    stack: ['React', 'Vite', 'Song ngữ', 'SEO local'],
    copy: {
      vi: {
        name: "Fairy's House Huế",
        type: 'homestay',
        summary:
          'Homestay tại 19 Lương Văn Can, Huế. Trang song ngữ Việt–Anh với thanh thời tiết Huế cập nhật trực tiếp và các nút liên hệ nhanh.',
        scope: [
          'Website song ngữ Việt–Anh',
          'Thanh thời tiết Huế cập nhật trực tiếp',
          'Chuyên mục cẩm nang du lịch',
          'Nút liên hệ nhanh Zalo / hotline / chỉ đường',
          'Dữ liệu có cấu trúc schema.org LodgingBusiness',
        ],
      },
      en: {
        name: "Fairy's House Hue",
        type: 'homestay',
        summary:
          'A homestay at 19 Luong Van Can, Hue. Vietnamese–English bilingual site with a live Hue weather bar and one-tap contact buttons.',
        scope: [
          'Vietnamese–English bilingual website',
          'Live Hue weather bar',
          'Travel guide section',
          'Quick contact buttons: Zalo / hotline / directions',
          'schema.org LodgingBusiness structured data',
        ],
      },
    },
  },
  {
    slug: 'north-carolina-pho',
    url: 'https://ncpho-ten.vercel.app/',
    cover: 'images/works/north-carolina-pho.jpg',
    coverReady: true,
    stack: ['React', 'Vite', 'Vercel'],
    wip: true,
    copy: {
      vi: {
        name: 'North Carolina Phở',
        type: 'nhà hàng',
        summary:
          'Nhà hàng tại Washington, North Carolina, Hoa Kỳ. Đang chạy trên tên miền tạm của Vercel, tên miền chính thức sẽ cập nhật sau.',
        scope: [
          'Website song ngữ Anh–Việt',
          'Thực đơn và gallery',
          'Dữ liệu có cấu trúc schema.org Restaurant',
        ],
      },
      en: {
        name: 'North Carolina Pho',
        type: 'restaurant',
        summary:
          'A restaurant in Washington, North Carolina, USA. Currently live on a temporary Vercel domain; the official domain comes later.',
        scope: [
          'English–Vietnamese bilingual website',
          'Menu and gallery',
          'schema.org Restaurant structured data',
        ],
      },
    },
  },
  {
    slug: 'ec-star-nails-spa',
    url: 'https://www.ecstarnailsandspagreenvillenc.com/',
    cover: 'images/works/ec-star-nails-spa.jpg',
    coverReady: true,
    // Ghi ro nen tang: khach se chi vao mot san pham cu the va hoi "lam cho toi giong cai nay
    // duoc khong". Neu ho chi vao cai nay ma bao gia nhu site code tay thi lech ky vong ngay tu dau.
    stack: ['Google Sites', 'Nội dung & cấu trúc trang'],
    copy: {
      vi: {
        name: 'EC Star Nails & Spa',
        type: 'tiệm nail & spa',
        summary:
          'Tiệm nail và spa tại Greenville, North Carolina, Hoa Kỳ. Dựng trên nền tảng Google Sites — tôi tổ chức cấu trúc trang và biên tập toàn bộ nội dung.',
        scope: [
          'Dựng trên nền tảng Google Sites',
          'Tổ chức cấu trúc trang Services / Gallery / About / Contact',
          'Biên tập toàn bộ nội dung giới thiệu tiệm',
        ],
      },
      en: {
        name: 'EC Star Nails & Spa',
        type: 'nail & spa salon',
        summary:
          'A nail and spa salon in Greenville, North Carolina, USA. Built on Google Sites — I organised the page structure and wrote all of the copy.',
        scope: [
          'Built on the Google Sites platform',
          'Services / Gallery / About / Contact page structure',
          'All salon introduction copy written and edited',
        ],
      },
    },
  },
];
