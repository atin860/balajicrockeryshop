/**
 * Vite plugin: build-time SEO files generated from src/config/shop.js and the data files.
 *
 * - Injects LocalBusiness (Store) JSON-LD into index.html, so Google sees the shop
 *   name, address, phones and hours without running JavaScript.
 * - Writes sitemap.xml (all public pages, categories and products) and robots.txt
 *   into the build output.
 *
 * Everything uses shop.siteUrl — set it to the real domain after deployment.
 */
import shop from '../src/config/shop.js';
import products from '../src/data/products.js';
import categories from '../src/data/categories.js';

const base = shop.siteUrl.replace(/\/$/, '');

function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${base}/#store`,
    name: shop.name.en,
    alternateName: shop.name.hi,
    description: shop.tagline.en,
    slogan: shop.tagline.hi,
    url: `${base}/`,
    image: `${base}/images/logo/og-image.jpg`,
    logo: `${base}/images/logo/icon-512.png`,
    telephone: shop.phones.map((p) => p.tel),
    founder: shop.proprietors.map((p) => ({ '@type': 'Person', name: p.en })),
    address: {
      '@type': 'PostalAddress',
      ...Object.fromEntries(Object.entries(shop.postalAddress).filter(([, v]) => v)),
    },
    areaServed: ['Bilsanda', 'Pilibhit'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: shop.hours.days,
        opens: shop.hours.opens,
        closes: shop.hours.closes,
      },
    ],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapQuery)}`,
    keywords: shop.seoKeywords.join(', '),
    paymentAccepted: 'Cash, UPI',
    currenciesAccepted: 'INR',
  };
}

const PUBLIC_PAGES = [
  ['/', '1.0', 'weekly'],
  ['/products', '0.9', 'weekly'],
  ['/party-packs', '0.8', 'monthly'],
  ['/bulk-order', '0.8', 'monthly'],
  ['/gallery', '0.6', 'monthly'],
  ['/about', '0.6', 'yearly'],
  ['/faq', '0.5', 'yearly'],
  ['/contact', '0.7', 'yearly'],
];

function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...PUBLIC_PAGES,
    ...categories.filter((c) => c.id !== 'combo').map((c) => [`/products/${c.id}`, '0.8', 'weekly']),
    ...products.map((p) => [`/product/${p.slug}`, '0.7', 'monthly']),
  ];
  const body = urls
    .map(
      ([path, priority, freq]) =>
        `  <url><loc>${base}${path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function robotsTxt() {
  return ['User-agent: *', 'Allow: /', 'Disallow: /cart', 'Disallow: /checkout', 'Disallow: /order-success', '', `Sitemap: ${base}/sitemap.xml`, ''].join('\n');
}

export default function seoPlugin() {
  return {
    name: 'sbd-seo',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(localBusinessJsonLd()),
          injectTo: 'head',
        },
        // (Canonical / og:url are set per page by the Seo component — not here,
        //  to avoid duplicate canonical tags.)
      ];
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() });
    },
  };
}
