import { useI18n } from '../i18n';
import { CONTACT, SITE_URL } from '../data/config';
import { fillCopy } from '../lib/copy';

const TAG_ID = 'phongb-jsonld';

/**
 * Render du lieu co cau truc schema.org (JSON-LD) cung voi noi dung trang.
 *
 * Noi dung FAQ nam trong src/i18n.tsx de phan hien thi va schema khong lech nhau. Vi App
 * duoc prerender luc build, the nay co san trong HTML tinh va van cap nhat khi doi ngon ngu.
 */
export function StructuredData() {
  const { t, lang } = useI18n();

  const business = {
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}#business`,
    name: 'phongb-space',
    url: SITE_URL,
    image: `${SITE_URL}og-image.png`,
    description: t.hero.lede,
    email: CONTACT.email,
    telephone: CONTACT.phoneE164,
    serviceType: t.hero.title,
    areaServed: [
      { '@type': 'Country', name: 'Vietnam' },
      { '@type': 'Country', name: 'United States' },
    ],
    sameAs: [CONTACT.github, CONTACT.facebook],
    knowsLanguage: ['vi', 'en'],
  };

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

  // JSON-LD nam ngay trong HTML prerender, khong doi Google phai chay JavaScript.
  const json = JSON.stringify(graph).replace(/</g, '\\u003c');
  return <script id={TAG_ID} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
