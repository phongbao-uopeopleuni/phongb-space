import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { CONTACT, SITE_URL } from '../data/config';
import { fillCopy } from '../lib/copy';

const TAG_ID = 'phongb-jsonld';

/**
 * Chen du lieu co cau truc schema.org (JSON-LD) vao <head>.
 *
 * Vi sao chen bang JavaScript thay vi viet san trong index.html: noi dung FAQ nam trong
 * src/i18n.tsx, viet lai mot ban trong index.html thi som muon hai ban se lech nhau —
 * ma schema lech voi noi dung hien tren trang la ly do Google phat.
 *
 * Chen luc chay khong lam mat gi ca: toan bo trang la React render phia trinh duyet,
 * Google buoc phai chay JavaScript moi thay duoc bat ky chu nao — co viet san JSON-LD
 * trong HTML tinh thi cung khong giup gi them.
 */
export function StructuredData() {
  const { t, lang } = useI18n();

  useEffect(() => {
    const business = {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}#business`,
      name: 'phongb-space',
      url: SITE_URL,
      image: `${SITE_URL}og-image.png`,
      description: t.hero.lede,
      email: CONTACT.email,
      telephone: `+84${CONTACT.phoneRaw.replace(/^0/, '')}`,
      // Nganh nghe cu the giup Google hieu dung dich vu dang ban
      serviceType: t.hero.title,
      areaServed: [
        { '@type': 'Country', name: 'Vietnam' },
        { '@type': 'Country', name: 'United States' },
      ],
      sameAs: [CONTACT.github, CONTACT.facebook],
      knowsLanguage: ['vi', 'en'],
    };

    // Dien the {{...}} bang dung ham ma phan hien thi dung, roi loai nhung cau van con
    // cho trong: schema phai khop chu voi noi dung nguoi doc nhin thay tren trang.
    const faqItems = t.faq.items
      .map((item) => ({
        q: item.q,
        a: fillCopy(item.a, lang, t.services.currency, t.services.pending),
      }))
      .filter((item) => !item.a.includes(t.services.pending))
      .map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }));

    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        business,
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}#website`,
          url: SITE_URL,
          name: 'phongb-space',
          inLanguage: lang,
          publisher: { '@id': `${SITE_URL}#business` },
        },
        { '@type': 'FAQPage', '@id': `${SITE_URL}#faq`, mainEntity: faqItems },
      ],
    };

    document.getElementById(TAG_ID)?.remove();
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = TAG_ID;

    // Escape dau '<' thanh <. Day la cho duy nhat trong ca ung dung ghi chuoi vao
    // ngu canh <script>: neu mot chuoi nao do chua "</script>" thi trinh duyet dong the
    // script som va phan con lai bi doc nhu HTML. Hien cac chuoi deu do minh viet trong
    // i18n nen chua the xay ra, nhung day la loai loi khong duoc phep phu thuoc vao
    // "hien tai chua ai nhap gi vao day" — noi dung i18n co the den tu cho khac ve sau.
    tag.textContent = JSON.stringify(graph).replace(/</g, '\\u003c');
    document.head.appendChild(tag);

    return () => document.getElementById(TAG_ID)?.remove();
  }, [t, lang]);

  return null;
}
