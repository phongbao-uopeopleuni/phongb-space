import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'vi' | 'en';

const STORAGE_KEY = 'bp-lang';

/**
 * Tieng Anh khai bao truoc va KHONG dung `as const`: can kieu `string` / `string[]`
 * de ban tieng Viet gan duoc gia tri khac. Ban `vi` sau do rang buoc `typeof en`
 * nen TypeScript bao loi ngay khi mot ngon ngu thieu khoa.
 */
const en = {
  nav: {
    works: 'Work',
    services: 'Services',
    process: 'Process',
    deliverables: 'What you get',
    faq: 'FAQ',
    contact: 'Get in touch',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    langLabel: 'Change language',
    skipToContent: 'Skip to main content',
  },

  hero: {
    eyebrow: '// gioi-thieu',
    role: 'Freelance web design',
    title: 'Websites for restaurants, homestays and service shops',
    lede: 'I design websites with one goal: bringing customers in. The shop shows up when people search on Google, the menu reads cleanly on a phone, and one tap places a call or opens Zalo.',
    ctaPrimary: 'Message me on Zalo',
    ctaSecondary: 'See real work',
    statsDelivered: 'websites delivered',
    statsCountries: 'countries',
    statsDelivery: 'average delivery',
    statsDeliveryPending: 'delivery time — updating',
  },

  works: {
    eyebrow: '// san-pham',
    cmd: '$ ls ./da-ban-giao',
    title: 'Five websites, currently live',
    lede: 'All five are live. Best opened on a phone: tap the call button, scroll the menu, watch how the photos load on mobile data — that is exactly how a customer meets a shop for the first time.',
    featured: 'Featured',
    wip: 'Work in progress',
    visit: 'Open website',
    scopeLabel: '> What I did',
    screenshotPending: '$ screenshot --pending',
    screenshotAlt: (name: string) => `Screenshot of the ${name} website`,
  },

  services: {
    eyebrow: '// dich-vu',
    cmd: '$ cat ./goi-dich-vu',
    title: 'Three packages',
    lede: 'Three scales for three different needs. Not sure which one fits? Get in touch and I will advise based on what the shop actually needs — not on the most expensive package.',
    popular: 'Most popular',
    fromLabel: 'From',
    timelineLabel: 'Delivery',
    pending: 'updating',
    cta: 'Ask about this package',
    basic: {
      name: 'Landing page',
      tagline: 'One scrolling page with everything a customer needs to call you.',
      items: [
        'A single page: intro, menu or services, address',
        'Call / Zalo / directions buttons',
        'Google Maps embedded',
        'Reads well on phones',
        'Submitted to Google Search',
      ],
    },
    standard: {
      name: 'Full website',
      tagline: 'Separate pages for menu, photos and contact — room to grow.',
      items: [
        'Home, Menu or Services, Gallery, About, Contact',
        'Menu and photos you can update',
        'Local SEO with schema.org structured data',
        'Google Maps and directions',
        'Contact form sent to your email',
        'A short guide so you can edit content yourself',
      ],
    },
    premium: {
      name: 'Bilingual & advanced',
      tagline: 'For shops serving both Vietnamese and foreign customers.',
      items: [
        'Everything in the full website package',
        'Vietnamese–English bilingual, switchable',
        'Blog or travel guide section',
        'One custom feature: booking, live weather, lookup…',
        'Speed and image optimisation',
        'Google Business Profile set up together',
      ],
    },
  },

  process: {
    eyebrow: '// quy-trinh',
    cmd: '$ ./quy-trinh --steps 4',
    title: 'How the work runs',
    lede: 'No technical knowledge needed. Information about the shop and some photos are enough; the build is my side of it.',
    pending: 'updating',
    steps: [
      {
        cmd: 'trao-doi-nhu-cau',
        name: 'We talk about your shop',
        detail:
          'A call or Zalo chat. What you sell, who your customers are, what you want them to do when they land on the site. I send you a summary so nothing is misunderstood.',
      },
      {
        cmd: 'thiet-ke-ban-nhap',
        name: 'You see a draft',
        detail:
          'I design the layout and colours and send you a real link you can open on your phone. You tell me what to change — this is the stage where changing things is cheap.',
      },
      {
        cmd: 'hoan-thien-noi-dung',
        name: 'Content goes in',
        detail:
          'Photos, menu, prices, opening hours, address. I write and tidy the copy, set up the Google listing data, and check the whole thing on phone, tablet and desktop.',
      },
      {
        cmd: 'ban-giao --huong-dan',
        name: 'Handover and a walkthrough',
        detail:
          'The site goes live on your own domain. I walk you through editing content yourself, and hand over every account so the website belongs to you, not to me.',
      },
    ],
  },

  deliverables: {
    eyebrow: '// ban-giao',
    cmd: '$ cat ./khach-nhan-duoc-gi',
    title: 'What you actually get',
    lede: 'A concrete list of what is handed over when the work is complete.',
    items: [
      {
        name: 'Your own domain name',
        detail:
          'A .com or .vn address with your shop name on it, registered in your name — not a sub-address of somebody else.',
      },
      {
        name: 'Hosting, set up and running',
        detail:
          'The site is online 24/7 with an HTTPS lock icon in the browser. I set it up; you do not have to touch a server.',
      },
      {
        name: 'Works properly on phones',
        detail:
          'Most of your customers will open it on a phone. Text stays readable, images stay sharp, no pinching and zooming.',
      },
      {
        name: 'Found on Google Search and Maps',
        detail:
          'Structured data so Google understands your business, plus your listing set up so the shop shows up when people nearby search.',
      },
      {
        name: 'Call, Zalo and directions buttons',
        detail:
          'One tap to phone you, one tap to open Zalo, one tap for driving directions. This is where the enquiries actually come from.',
      },
      {
        name: 'Bilingual when needed',
        detail:
          'Vietnamese and English on the same site with a switch, useful for tourist areas and for shops serving American customers.',
      },
      {
        name: 'A guide to editing it yourself',
        detail:
          'A short written guide, in plain language, for the things you will change often: prices, opening hours, new photos.',
      },
      {
        name: 'Maintenance in the early period',
        detail:
          'After handover I stay available to fix anything broken and answer questions, so you are not left alone with a new website.',
      },
    ],
  },

  faq: {
    eyebrow: '// cau-hoi-thuong-gap',
    cmd: '$ ./faq --all',
    title: 'Questions I get asked',
    items: [
      {
        q: 'How long does it take?',
        a: 'It depends on the package and mostly on how quickly the content comes back to me. The delivery time is written on each package above. In practice the part that takes longest is not the code — it is waiting for photos and the menu.',
      },
      {
        q: 'Do I have to prepare the photos and the text myself?',
        a: 'You send me what you have: phone photos, a photographed menu, a few sentences about the shop. I write and tidy the copy and arrange the images. If your photos are not usable I will say so honestly and tell you what to reshoot — a good photo of the food changes more than any design trick.',
      },
      {
        q: 'Can I edit the content myself afterwards?',
        a: 'Yes, for the things that change often: prices, opening hours, new photos, new dishes. At handover I walk you through it on a call and leave you a short written guide. For bigger structural changes, message me.',
      },
      {
        q: 'What does it cost to keep running each year?',
        a: 'The yearly cost is the domain name plus hosting: {{upkeep}}. There is no hidden monthly fee to me. You pay those two directly, in your own name, so the website stays yours.',
      },
      {
        q: 'I already have a Facebook page. Do I need a website?',
        a: 'They do different jobs. Facebook reaches people who already follow you. A website reaches the person who is standing nearby right now searching "pho near me" on Google — that person will not scroll your page feed. A website also shows your whole menu at once, does not bury your address under posts, and does not disappear if the page gets locked. Keep the Facebook page; the website works alongside it.',
      },
      {
        q: 'What if I am not happy with it?',
        a: 'You see a draft before I build the whole thing, so we correct direction early instead of at the end. Revisions during the draft stage are part of the work, not extra. If after the draft you decide not to continue, we stop there and you owe nothing further.',
      },
      {
        q: 'Do you work with shops in the United States?',
        a: 'Yes. Three of the five sites above are for businesses in North Carolina. We work over Zalo or Messenger, and the time difference has not been a problem — I send drafts you can review whenever you open your phone.',
      },
    ],
  },

  contact: {
    eyebrow: '// lien-he',
    title: 'Let us talk about the website',
    lede: 'The fastest route is Zalo: send the shop name and the type of business, and I will reply straight about the scope needed and the rough cost.',
    zalo: 'Message on Zalo',
    call: 'Call',
    emailLabel: 'Email',
    phoneLabel: 'Phone / Zalo',
    formTitle: 'Or leave your details here',
    formNote: 'I reply within one working day.',
    fieldName: 'Full name',
    fieldPhone: 'Phone number',
    fieldBusiness: 'Type of business',
    fieldBusinessPlaceholder: 'Restaurant, homestay, nail salon…',
    fieldNote: 'Anything you want to add',
    fieldNotePlaceholder: 'Specific needs, target completion date…',
    submit: 'Send',
    sending: 'Sending…',
    sent: 'Message received. I will reply within one working day.',
    error: 'Sending failed. Please get in touch via Zalo.',
    formDisabled:
      'The form is not connected yet. Please use the Zalo button or the phone number above — both reach me directly.',
    required: 'required',
  },

  footer: {
    copyright: (year: number) => `© ${year} Bao Phong · Freelance web design · Hue, Vietnam`,
    social: 'Elsewhere',
  },
};

/** Ban tieng Viet — rang buoc `typeof en` de khong ngon ngu nao thieu khoa. */
const vi: typeof en = {
  nav: {
    works: 'Sản phẩm',
    services: 'Dịch vụ',
    process: 'Quy trình',
    deliverables: 'Bàn giao',
    faq: 'Câu hỏi',
    contact: 'Liên hệ',
    mainNav: 'Điều hướng chính',
    openMenu: 'Mở menu',
    closeMenu: 'Đóng menu',
    langLabel: 'Đổi ngôn ngữ',
    skipToContent: 'Bỏ qua, đến nội dung chính',
  },

  hero: {
    eyebrow: '// gioi-thieu',
    role: 'Thiết kế website freelance',
    title: 'Thiết kế website cho nhà hàng, homestay và tiệm dịch vụ',
    lede: 'Tôi thiết kế website với một mục tiêu: mang khách tới. Quán hiện ra khi khách tìm trên Google, thực đơn đọc gọn trên điện thoại, một lần bấm là gọi hoặc nhắn Zalo trực tiếp.',
    ctaPrimary: 'Nhắn Zalo cho tôi',
    ctaSecondary: 'Xem sản phẩm thật',
    statsDelivered: 'website đã bàn giao',
    statsCountries: 'quốc gia',
    statsDelivery: 'thời gian bàn giao',
    statsDeliveryPending: 'thời gian bàn giao — đang cập nhật',
  },

  works: {
    eyebrow: '// san-pham',
    cmd: '$ ls ./da-ban-giao',
    title: 'Năm website đang chạy',
    lede: 'Cả năm đều đang online. Nên mở bằng điện thoại: bấm thử nút gọi, cuộn thực đơn, xem ảnh tải nhanh chậm ra sao trên mạng 4G — đó đúng là cách khách sẽ gặp một cái quán lần đầu.',
    featured: 'Nổi bật',
    wip: 'Đang xây dựng',
    visit: 'Mở website',
    scopeLabel: '> Tôi đã làm gì',
    screenshotPending: '$ screenshot --pending',
    screenshotAlt: (name: string) => `Ảnh chụp màn hình website ${name}`,
  },

  services: {
    eyebrow: '// dich-vu',
    cmd: '$ cat ./goi-dich-vu',
    title: 'Ba gói dịch vụ',
    lede: 'Ba quy mô cho ba nhu cầu khác nhau. Nếu chưa rõ nên chọn mức nào, liên hệ để tôi tư vấn theo nhu cầu thực tế — không phải theo gói đắt nhất.',
    popular: 'Phổ biến nhất',
    fromLabel: 'Từ',
    timelineLabel: 'Bàn giao',
    pending: 'đang cập nhật',
    cta: 'Hỏi về gói này',
    basic: {
      name: 'Landing page',
      tagline: 'Một trang cuộn dọc, đủ thông tin để khách gọi ngay.',
      items: [
        'Một trang: giới thiệu, thực đơn hoặc dịch vụ, địa chỉ',
        'Nút gọi / Zalo / chỉ đường',
        'Nhúng Google Maps',
        'Xem tốt trên điện thoại',
        'Khai báo với Google để khách tìm được',
      ],
    },
    standard: {
      name: 'Website đầy đủ',
      tagline: 'Tách riêng trang thực đơn, hình ảnh, liên hệ — có chỗ để mở rộng.',
      items: [
        'Trang chủ, Thực đơn hoặc Dịch vụ, Hình ảnh, Giới thiệu, Liên hệ',
        'Thực đơn và hình ảnh cập nhật được',
        'SEO địa phương kèm dữ liệu có cấu trúc schema.org',
        'Google Maps và chỉ đường',
        'Form liên hệ gửi trực tiếp về email của quán',
        'Tài liệu hướng dẫn tự cập nhật nội dung',
      ],
    },
    premium: {
      name: 'Song ngữ & nâng cao',
      tagline: 'Cho quán phục vụ cả khách Việt và khách nước ngoài.',
      items: [
        'Toàn bộ gói website đầy đủ',
        'Song ngữ Việt–Anh, chuyển qua lại được',
        'Chuyên mục blog hoặc cẩm nang du lịch',
        'Một tính năng riêng: đặt chỗ, thời tiết trực tiếp, tra cứu…',
        'Tối ưu tốc độ tải và hình ảnh',
        'Thiết lập hồ sơ Google Business Profile',
      ],
    },
  },

  process: {
    eyebrow: '// quy-trinh',
    cmd: '$ ./quy-trinh --steps 4',
    title: 'Quy trình làm việc',
    lede: 'Không cần kiến thức kỹ thuật. Chỉ cần thông tin về quán và hình ảnh; phần triển khai là việc của tôi.',
    pending: 'đang cập nhật',
    steps: [
      {
        cmd: 'trao-doi-nhu-cau',
        name: 'Trao đổi nhu cầu',
        detail:
          'Một cuộc gọi hoặc trao đổi qua Zalo: quán bán gì, khách là ai, mục tiêu muốn khách làm gì sau khi vào website. Sau đó tôi gửi lại bản tóm tắt để hai bên thống nhất, tránh hiểu lệch.',
      },
      {
        cmd: 'thiet-ke-ban-nhap',
        name: 'Thiết kế bản nháp',
        detail:
          'Tôi dựng bố cục và màu sắc rồi gửi một đường link mở được ngay trên điện thoại. Đây là lúc góp ý thoải mái nhất: chỉnh ở giai đoạn nháp tốn ít công nhất cho cả hai bên.',
      },
      {
        cmd: 'hoan-thien-noi-dung',
        name: 'Hoàn thiện nội dung',
        detail:
          'Hình ảnh, thực đơn, giá, giờ mở cửa, địa chỉ. Tôi viết và biên tập lại câu chữ, khai báo dữ liệu cho Google, kiểm tra kỹ trên điện thoại, máy tính bảng và máy tính.',
      },
      {
        cmd: 'ban-giao --huong-dan',
        name: 'Bàn giao và hướng dẫn',
        detail:
          'Website chạy trên tên miền riêng của quán. Tôi hướng dẫn cách tự cập nhật nội dung và giao lại toàn bộ tài khoản — quyền sở hữu thuộc về quán, không phụ thuộc vào tôi.',
      },
    ],
  },

  deliverables: {
    eyebrow: '// ban-giao',
    cmd: '$ cat ./khach-nhan-duoc-gi',
    title: 'Khách nhận được gì',
    lede: 'Danh sách cụ thể những gì được giao lại khi công việc hoàn tất.',
    items: [
      {
        name: 'Tên miền riêng của quán',
        detail:
          'Địa chỉ .com hoặc .vn mang tên quán, đăng ký chính chủ — không phải một địa chỉ con nằm nhờ trên nền tảng của người khác.',
      },
      {
        name: 'Hosting đã cài đặt sẵn, chạy ổn',
        detail:
          'Website online 24/7, có ổ khóa HTTPS trên thanh địa chỉ. Tôi cài đặt và cấu hình toàn bộ; phía quán không phải can thiệp vào máy chủ.',
      },
      {
        name: 'Chạy tốt trên điện thoại',
        detail:
          'Phần lớn khách sẽ mở bằng điện thoại. Chữ đọc được không cần phóng to, ảnh không bị vỡ, không phải kéo ngang.',
      },
      {
        name: 'Hiển thị trên Google Maps và tìm kiếm',
        detail:
          'Khai báo dữ liệu có cấu trúc để Google hiểu đúng ngành nghề và địa chỉ của quán, kèm thiết lập hồ sơ doanh nghiệp để khách quanh vùng tìm là ra.',
      },
      {
        name: 'Nút gọi, Zalo và chỉ đường',
        detail:
          'Một lần bấm để gọi, một lần bấm để mở Zalo, một lần bấm để hiện chỉ đường. Phần lớn liên hệ đến từ ba nút này.',
      },
      {
        name: 'Song ngữ khi cần',
        detail:
          'Tiếng Việt và tiếng Anh trên cùng một website, có nút chuyển. Hữu ích cho vùng du lịch và cho quán phục vụ khách nước ngoài.',
      },
      {
        name: 'Hướng dẫn tự sửa nội dung',
        detail:
          'Một bản hướng dẫn ngắn, viết bằng lời dễ hiểu, cho những nội dung thay đổi thường xuyên: giá, giờ mở cửa, ảnh mới.',
      },
      {
        name: 'Bảo trì trong thời gian đầu',
        detail:
          'Sau bàn giao tôi vẫn theo để sửa lỗi và trả lời thắc mắc, không để một website vừa nhận phải tự loay hoay vận hành.',
      },
    ],
  },

  faq: {
    eyebrow: '// cau-hoi-thuong-gap',
    cmd: '$ ./faq --all',
    title: 'Câu hỏi thường gặp',
    items: [
      {
        q: 'Làm một website mất bao lâu?',
        a: 'Tùy gói, và phụ thuộc nhiều vào tốc độ cung cấp nội dung. Thời gian bàn giao ghi rõ ở từng gói phía trên. Trên thực tế, phần mất thời gian nhất không phải lập trình mà là chờ hình ảnh và thực đơn.',
      },
      {
        q: 'Tôi có cần tự chuẩn bị ảnh và nội dung không?',
        a: 'Chỉ cần gửi những gì đang có: ảnh chụp bằng điện thoại, ảnh tờ thực đơn, vài dòng giới thiệu về quán. Tôi biên tập lại câu chữ và sắp xếp hình ảnh. Nếu ảnh chưa đạt, tôi sẽ nói rõ và hướng dẫn cách chụp lại — một tấm ảnh món ăn hấp dẫn có sức thuyết phục hơn mọi thủ pháp thiết kế.',
      },
      {
        q: 'Sau này tôi tự sửa được không?',
        a: 'Được, với những nội dung thay đổi thường xuyên: giá, giờ mở cửa, ảnh mới, món mới. Lúc bàn giao tôi hướng dẫn trực tiếp qua cuộc gọi và để lại tài liệu viết sẵn. Với thay đổi lớn về cấu trúc, chỉ cần liên hệ lại.',
      },
      {
        q: 'Chi phí duy trì hằng năm bao nhiêu?',
        a: 'Chi phí hằng năm gồm tên miền và hosting: {{upkeep}}. Không có khoản phí hằng tháng nào trả cho tôi. Hai khoản trên do phía quán đứng tên và thanh toán trực tiếp, để website luôn thuộc quyền sở hữu của quán.',
      },
      {
        q: 'Tôi đã có Facebook rồi thì có cần website không?',
        a: 'Hai kênh phục vụ hai mục đích khác nhau. Facebook tiếp cận người đã theo dõi quán. Website tiếp cận người đang ở gần và gõ "phở gần đây" trên Google — người đó sẽ không tìm đến trang Facebook. Website còn cho xem trọn thực đơn trong một lượt, không vùi địa chỉ dưới các bài đăng, và không mất theo nếu trang bị khóa. Facebook vẫn nên giữ; website chạy song song.',
      },
      {
        q: 'Nếu tôi không hài lòng thì sao?',
        a: 'Bản nháp được gửi trước khi tôi dựng toàn bộ, nên lệch hướng sẽ được chỉnh ngay từ đầu thay vì lúc kết thúc. Việc sửa trong giai đoạn nháp đã nằm trong phạm vi công việc, không phát sinh thêm. Nếu sau khi xem nháp mà quyết định không tiếp tục, công việc dừng tại đó và không phát sinh chi phí.',
      },
      {
        q: 'Anh có làm cho quán ở Hoa Kỳ không?',
        a: 'Có. Ba trong năm website phía trên thuộc các cơ sở tại North Carolina. Việc trao đổi diễn ra qua Zalo hoặc Messenger; lệch múi giờ không gây trở ngại vì bản nháp luôn ở dạng đường link, mở xem được bất cứ lúc nào.',
      },
    ],
  },

  contact: {
    eyebrow: '// lien-he',
    title: 'Trao đổi về website cho quán',
    lede: 'Cách nhanh nhất là nhắn Zalo: gửi tên quán và loại hình kinh doanh, tôi trả lời thẳng về phạm vi cần làm và khoảng chi phí.',
    zalo: 'Nhắn Zalo',
    call: 'Gọi điện',
    emailLabel: 'Email',
    phoneLabel: 'Điện thoại / Zalo',
    formTitle: 'Hoặc để lại thông tin ở đây',
    formNote: 'Tôi trả lời trong vòng một ngày làm việc.',
    fieldName: 'Họ và tên',
    fieldPhone: 'Số điện thoại',
    fieldBusiness: 'Loại hình kinh doanh',
    fieldBusinessPlaceholder: 'Nhà hàng, homestay, tiệm nail…',
    fieldNote: 'Ghi chú thêm',
    fieldNotePlaceholder: 'Nhu cầu cụ thể, thời điểm cần hoàn thành…',
    submit: 'Gửi',
    sending: 'Đang gửi…',
    sent: 'Đã nhận được thông tin. Tôi sẽ phản hồi trong vòng một ngày làm việc.',
    error: 'Gửi không thành công. Vui lòng liên hệ qua Zalo.',
    formDisabled:
      'Form chưa được kết nối. Vui lòng dùng nút Zalo hoặc số điện thoại phía trên — hai kênh này đến trực tiếp.',
    required: 'bắt buộc',
  },

  footer: {
    copyright: (year: number) => `© ${year} Bảo Phong · Thiết kế website freelance · Huế, Việt Nam`,
    social: 'Nơi khác',
  },
};

const dicts = { vi, en };

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof en;
};

const I18nContext = createContext<I18nValue | null>(null);

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'vi' || stored === 'en') return stored;
  } catch {
    // localStorage co the bi chan (che do rieng tu) — cu roi ve mac dinh
  }
  return 'vi'; // mac dinh tieng Viet
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // khong luu duoc thi bo qua, khong the de vo trang
    }
  }, []);

  // Trinh doc man hinh va cong cu dich dua vao thuoc tinh lang de phat am dung
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t: dicts[lang] }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n phai dung ben trong <I18nProvider>');
  return ctx;
}
