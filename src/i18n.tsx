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
    lede: 'I build the kind of website that brings customers in: found on Google, easy to read on a phone, one tap to call or message you on Zalo.',
    ctaPrimary: 'Message me on Zalo',
    ctaSecondary: 'See real work',
    statsDelivered: 'websites delivered',
    statsCountries: 'countries',
    statsDelivery: 'average delivery',
    statsDeliveryPending: 'delivery time — updating',
  },

  works: {
    eyebrow: '// san-pham-that',
    cmd: '$ ls ./san-pham-that',
    title: 'Five websites, live right now',
    lede: 'Not mockups. Every link below opens a site a real business is using today. Tap through and see for yourself.',
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
    lede: 'Pick the one that matches your shop. Not sure? Send me a message and I will tell you honestly which one you actually need.',
    popular: 'Most popular',
    fromLabel: 'From',
    timelineLabel: 'Delivery',
    pending: 'updating',
    cta: 'Ask about this package',
    basic: {
      name: 'One-page site',
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
    title: 'How we work together',
    lede: 'You do not need to know anything technical. You talk about your shop; I handle the rest.',
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
    lede: 'Concretely, this is what is in your hands when the work is done.',
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
        name: 'Bilingual if you need it',
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
    title: 'Tell me about your shop',
    lede: 'The fastest way is Zalo — send me your shop name and what you sell, and I will reply with an honest answer about what you need and what it costs.',
    zalo: 'Message on Zalo',
    call: 'Call',
    emailLabel: 'Email',
    phoneLabel: 'Phone / Zalo',
    formTitle: 'Or leave your details here',
    formNote: 'I reply within one working day.',
    fieldName: 'Your name',
    fieldPhone: 'Phone number',
    fieldBusiness: 'Type of business',
    fieldBusinessPlaceholder: 'Restaurant, homestay, nail salon…',
    fieldNote: 'Anything you want to add',
    fieldNotePlaceholder: 'What you need, when you need it by…',
    submit: 'Send',
    sending: 'Sending…',
    sent: 'Thank you — I have your message and will reply within one working day.',
    error: 'Something went wrong. Please message me on Zalo instead.',
    formDisabled:
      'The form is not connected yet. Please use the Zalo button or the phone number above — those reach me directly.',
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
    lede: 'Tôi làm loại website mang khách tới: khách tìm thấy quán trên Google, xem thực đơn gọn gàng trên điện thoại, bấm một cái là gọi hoặc nhắn Zalo cho anh chị.',
    ctaPrimary: 'Nhắn Zalo cho tôi',
    ctaSecondary: 'Xem sản phẩm thật',
    statsDelivered: 'website đã bàn giao',
    statsCountries: 'quốc gia',
    statsDelivery: 'thời gian bàn giao',
    statsDeliveryPending: 'thời gian bàn giao — đang cập nhật',
  },

  works: {
    eyebrow: '// san-pham-that',
    cmd: '$ ls ./san-pham-that',
    title: 'Năm website đang chạy thật',
    lede: 'Không phải ảnh mẫu. Mỗi link dưới đây mở ra một website đang được một cơ sở thật sử dụng hằng ngày. Anh chị bấm vào xem trực tiếp.',
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
    lede: 'Anh chị chọn gói phù hợp với quán mình. Chưa rõ chọn gói nào thì nhắn tôi, tôi nói thật anh chị cần tới đâu.',
    popular: 'Phổ biến nhất',
    fromLabel: 'Từ',
    timelineLabel: 'Bàn giao',
    pending: 'đang cập nhật',
    cta: 'Hỏi về gói này',
    basic: {
      name: 'Trang một mạch',
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
        'Form liên hệ gửi về email của anh chị',
        'Hướng dẫn ngắn để anh chị tự sửa nội dung',
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
        'Thiết lập Google Business Profile cùng anh chị',
      ],
    },
  },

  process: {
    eyebrow: '// quy-trinh',
    cmd: '$ ./quy-trinh --steps 4',
    title: 'Chúng ta làm việc thế nào',
    lede: 'Anh chị không cần biết gì về kỹ thuật. Anh chị kể về quán, phần còn lại để tôi lo.',
    pending: 'đang cập nhật',
    steps: [
      {
        cmd: 'trao-doi-nhu-cau',
        name: 'Trao đổi nhu cầu',
        detail:
          'Một cuộc gọi hoặc nhắn Zalo. Quán bán gì, khách là ai, anh chị muốn khách vào website rồi làm gì tiếp. Tôi gửi lại bản ghi tóm tắt để hai bên không hiểu lệch nhau.',
      },
      {
        cmd: 'thiet-ke-ban-nhap',
        name: 'Thiết kế bản nháp',
        detail:
          'Tôi dựng bố cục và màu sắc rồi gửi anh chị một link thật, mở được ngay trên điện thoại. Anh chị góp ý thoải mái — sửa ở bước này là rẻ nhất.',
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
          'Website chạy trên tên miền của anh chị. Tôi hướng dẫn anh chị tự sửa nội dung và giao lại toàn bộ tài khoản — website thuộc về anh chị, không phụ thuộc vào tôi.',
      },
    ],
  },

  deliverables: {
    eyebrow: '// ban-giao',
    cmd: '$ cat ./khach-nhan-duoc-gi',
    title: 'Khách nhận được gì',
    lede: 'Cụ thể, đây là những thứ nằm trong tay anh chị khi công việc xong.',
    items: [
      {
        name: 'Tên miền riêng của quán',
        detail:
          'Địa chỉ .com hoặc .vn mang tên quán anh chị, đăng ký chính chủ — không phải một địa chỉ con nằm nhờ chỗ người khác.',
      },
      {
        name: 'Hosting đã cài đặt sẵn, chạy ổn',
        detail:
          'Website online 24/7, có ổ khóa HTTPS trên thanh địa chỉ. Tôi cài đặt hết, anh chị không phải chạm tới máy chủ.',
      },
      {
        name: 'Chạy tốt trên điện thoại',
        detail:
          'Phần lớn khách sẽ mở bằng điện thoại. Chữ đọc được không cần phóng to, ảnh không bị vỡ, không phải kéo ngang.',
      },
      {
        name: 'Hiển thị trên Google Maps và tìm kiếm',
        detail:
          'Khai báo dữ liệu có cấu trúc để Google hiểu đúng quán anh chị, kèm thiết lập hồ sơ doanh nghiệp để khách quanh vùng tìm là ra.',
      },
      {
        name: 'Nút gọi, Zalo và chỉ đường',
        detail:
          'Một cái bấm là gọi, một cái bấm là mở Zalo, một cái bấm là hiện đường đi. Khách liên hệ chủ yếu từ mấy nút này.',
      },
      {
        name: 'Song ngữ nếu anh chị cần',
        detail:
          'Tiếng Việt và tiếng Anh trên cùng một website, có nút chuyển. Hữu ích cho vùng du lịch và cho quán phục vụ khách ở Mỹ.',
      },
      {
        name: 'Hướng dẫn tự sửa nội dung',
        detail:
          'Một bản hướng dẫn ngắn, viết bằng lời dễ hiểu, cho những thứ anh chị sẽ đổi thường xuyên: giá, giờ mở cửa, ảnh mới.',
      },
      {
        name: 'Bảo trì trong thời gian đầu',
        detail:
          'Sau bàn giao tôi vẫn theo để sửa lỗi và trả lời thắc mắc, anh chị không bị bỏ lại một mình với cái website mới.',
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
        a: 'Tùy gói, và chủ yếu tùy anh chị gửi nội dung nhanh hay chậm. Thời gian bàn giao ghi rõ ở từng gói phía trên. Thực tế phần lâu nhất không phải code, mà là chờ ảnh và thực đơn.',
      },
      {
        q: 'Tôi có cần tự chuẩn bị ảnh và nội dung không?',
        a: 'Anh chị gửi cái đang có: ảnh chụp bằng điện thoại, ảnh chụp tờ thực đơn, vài câu kể về quán. Tôi viết và biên tập lại câu chữ, sắp xếp lại hình. Nếu ảnh chưa dùng được tôi nói thẳng và chỉ anh chị chụp lại thế nào — một tấm ảnh món ăn ngon mắt có sức nặng hơn mọi mẹo thiết kế.',
      },
      {
        q: 'Sau này tôi tự sửa được không?',
        a: 'Được, với những thứ hay đổi: giá, giờ mở cửa, ảnh mới, món mới. Lúc bàn giao tôi hướng dẫn trực tiếp qua cuộc gọi và để lại bản hướng dẫn viết sẵn. Còn thay đổi lớn về cấu trúc thì anh chị nhắn tôi.',
      },
      {
        q: 'Chi phí duy trì hằng năm bao nhiêu?',
        a: 'Mỗi năm anh chị trả tên miền và hosting: {{upkeep}}. Không có phí hằng tháng nào trả cho tôi. Hai khoản đó anh chị đứng tên và trả trực tiếp, để website luôn là của anh chị.',
      },
      {
        q: 'Tôi đã có Facebook rồi thì có cần website không?',
        a: 'Hai thứ làm hai việc khác nhau. Facebook chạm tới người đã theo dõi quán. Website chạm tới người đang đứng gần đây và gõ "phở gần tôi" trên Google — người đó sẽ không lướt trang Facebook của anh chị. Website còn cho khách xem trọn thực đơn một lượt, không vùi địa chỉ dưới đống bài đăng, và không mất theo nếu trang bị khóa. Anh chị cứ giữ Facebook; website chạy song song với nó.',
      },
      {
        q: 'Nếu tôi không hài lòng thì sao?',
        a: 'Anh chị xem bản nháp trước khi tôi dựng toàn bộ, nên có lệch hướng thì chỉnh sớm chứ không phải chỉnh lúc cuối. Sửa trong giai đoạn bản nháp là phần việc đã tính, không tính thêm. Nếu xem bản nháp rồi anh chị quyết định không làm nữa thì mình dừng ở đó, anh chị không phải trả thêm.',
      },
      {
        q: 'Anh có làm cho quán ở Hoa Kỳ không?',
        a: 'Có. Ba trong năm website phía trên là của cơ sở tại North Carolina. Mình trao đổi qua Zalo hoặc Messenger, lệch giờ không thành vấn đề — tôi gửi bản nháp để anh chị mở điện thoại lúc nào cũng xem được.',
      },
    ],
  },

  contact: {
    eyebrow: '// lien-he',
    title: 'Kể tôi nghe về quán của anh chị',
    lede: 'Nhanh nhất là nhắn Zalo — gửi tên quán và anh chị bán gì, tôi trả lời thật là anh chị cần tới đâu và chi phí khoảng bao nhiêu.',
    zalo: 'Nhắn Zalo',
    call: 'Gọi điện',
    emailLabel: 'Email',
    phoneLabel: 'Điện thoại / Zalo',
    formTitle: 'Hoặc để lại thông tin ở đây',
    formNote: 'Tôi trả lời trong vòng một ngày làm việc.',
    fieldName: 'Tên anh chị',
    fieldPhone: 'Số điện thoại',
    fieldBusiness: 'Loại hình kinh doanh',
    fieldBusinessPlaceholder: 'Nhà hàng, homestay, tiệm nail…',
    fieldNote: 'Ghi chú thêm',
    fieldNotePlaceholder: 'Anh chị cần gì, cần xong khi nào…',
    submit: 'Gửi',
    sending: 'Đang gửi…',
    sent: 'Cảm ơn anh chị — tôi đã nhận được và sẽ trả lời trong vòng một ngày làm việc.',
    error: 'Có lỗi khi gửi. Anh chị nhắn giúp tôi qua Zalo nhé.',
    formDisabled:
      'Form chưa được kết nối. Anh chị dùng nút Zalo hoặc số điện thoại phía trên nhé — hai cách đó đến tôi trực tiếp.',
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
