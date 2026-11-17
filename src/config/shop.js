/**
 * ============================================================
 *  SHOP SETTINGS — the ONE file the owner edits for shop info
 * ============================================================
 * Change phone numbers, WhatsApp number, address, hours and the owner
 * details here. Everything on the website reads from this file, so you
 * never need to search through the code.
 *
 * Products live in src/data/products.js.
 * UI text lives in src/i18n/en.js and src/i18n/hi.js.
 */

const shop = {
  /* ---------- Features ---------- */
  features: {
    // ORDERING ON HOLD: the cart, checkout and order-success pages (and every
    // "Add to Cart" / "Order Now" button) are switched off. The site works as a
    // catalogue: customers browse designs, then enquire on WhatsApp or call.
    // All ordering code is still in the project — set this to `true` to turn it back on.
    ordering: false,
  },

  /* ---------- Identity ---------- */
  name: {
    en: 'Shri Balaji Dona Pattal Store',
    hi: 'मै० श्री बालाजी दोना पत्तल स्टोर',
  },
  // Short name used in tight spaces (mobile navbar, toasts).
  shortName: {
    en: 'Shri Balaji',
    hi: 'श्री बालाजी',
  },
  // Second line under the short name in the navbar logo.
  brandLine: {
    en: 'Dona Pattal Store',
    hi: 'दोना पत्तल स्टोर',
  },
  tagline: {
    en: 'Wholesale & Retail Disposable Crockery for Every Celebration',
    hi: 'एक बार सेवा का मौका अवश्य दें।',
  },
  // Shop owner (shown on the About page and in Google's business info).
  // Replace public/images/about/owner.webp with a real photo (portrait, about 800×1000).
  proprietors: [{ en: 'Sunil Sharma', hi: 'सुनील शर्मा', photo: '/images/about/owner.webp' }],
  // Used for the order ID prefix: SBD-YYYYMMDD-XXXX
  orderIdPrefix: 'SBD',

  /* ---------- Contact ---------- */
  // WhatsApp number in international format WITHOUT "+" or spaces.
  whatsappNumber: '918445009955',

  // `tel` is used in the clickable link, `display` is what visitors see.
  phones: [
    { tel: '+918445009955', display: '+91 84450 09955' },
    { tel: '+919368905883', display: '+91 93689 05883' },
  ],

  // Message pre-filled when a visitor taps the floating WhatsApp button.
  whatsappGreeting: 'नमस्ते, मुझे आपके प्रोडक्ट्स के बारे में जानकारी चाहिए',

  /* ---------- Address & map ---------- */
  address: {
    en: 'Opposite TVS Agency, Gola Road, Bilsanda, Pilibhit, Uttar Pradesh',
    hi: 'टी.वी.एस. एजेंसी के ठीक सामने, गोला रोड, बिलसण्डा (पीलीभीत)',
  },
  // Structured address for Google's LocalBusiness schema (SEO).
  postalAddress: {
    streetAddress: 'Opposite TVS Agency, Gola Road',
    addressLocality: 'Bilsanda',
    addressRegion: 'Uttar Pradesh',
    // TODO(owner): put the shop's real PIN code here if you want it in Google results.
    postalCode: '',
    addressCountry: 'IN',
  },
  // Text searched on Google Maps for the embedded map & "Get Directions".
  mapQuery: 'TVS Agency Gola Road Bilsanda Pilibhit',

  /* ---------- Hours ---------- */
  hours: {
    en: 'Mon – Sun, 8:00 AM – 9:00 PM',
    hi: 'सोमवार – रविवार, सुबह 8 बजे – रात 9 बजे',
    // Machine-readable version for SEO (24-hour format).
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '21:00',
  },

  /* ---------- Ordering & delivery ---------- */
  // The website shows NO prices. Customers choose products, design and quantity;
  // the shop replies on WhatsApp with rates. Delivery charges are discussed there too.
  locale: 'en-IN', // Indian number grouping: 1,00,000
  // Largest quantity (packets) a customer can enter for one cart item.
  maxQtyPerItem: 9999,
  delivery: {
    // Shown on the FAQ and checkout pages.
    areas: {
      en: 'Bilsanda and nearby villages (about 25 km). Other places in Pilibhit district on request for bulk orders.',
      hi: 'बिलसण्डा और आसपास के गाँव (लगभग 25 कि.मी.)। बड़े ऑर्डर के लिए पीलीभीत ज़िले में अन्य जगहों पर भी डिलीवरी संभव।',
    },
  },

  /* ---------- About page numbers ---------- */
  // TODO(owner): these are SAMPLE figures — replace with your real numbers.
  stats: {
    years: 15, // years of service
    customers: 10000, // happy customers
    events: 2500, // events served
    // "Products in stock" is counted automatically from src/data/products.js
  },

  /* ---------- Language ---------- */
  defaultLanguage: 'hi', // 'hi' or 'en'

  /* ---------- Website / SEO ---------- */
  // TODO(owner): replace with the real website address after deployment
  // (used for canonical links and social-media share previews).
  siteUrl: 'https://your-domain.com',
  copyrightYear: 2026,
  seoKeywords: [
    'dona pattal Bilsanda',
    'disposable plates Pilibhit',
    'wholesale dona pattal shop',
    'shaadi disposable items Bilsanda',
    'disposable crockery Pilibhit',
    'bhojan thali disposable',
    'paper plates wholesale',
  ],

  /* ---------- Developer credit (required — do not remove) ---------- */
  developer: {
    name: 'Vsafe Softwares Pvt. Ltd.',
    url: 'https://vsafesoftwares.com/',
  },

  /* ---------- Browser storage keys ---------- */
  storageKeys: {
    cart: 'sbd-cart-v1',
    language: 'sbd-lang',
    lastOrder: 'sbd-last-order',
    customer: 'sbd-customer', // checkout details remembered on this device
  },
};

/* ---------- Derived helpers (no need to edit) ---------- */

/** wa.me link, optionally with a pre-filled message. */
export const whatsappLink = (message = '') =>
  `https://wa.me/${shop.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

/** Embedded Google Map (no API key needed). */
export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  shop.mapQuery,
)}&z=16&output=embed`;

/** Opens Google Maps directions to the shop. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  shop.mapQuery,
)}`;

export default shop;
