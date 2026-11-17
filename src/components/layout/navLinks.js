/** Main navigation (navbar + mobile menu). `key` maps to nav.* in the i18n files. */
export const mainNav = [
  { to: '/', key: 'home', end: true },
  { to: '/products', key: 'products' },
  { to: '/party-packs', key: 'partyPacks' },
  { to: '/bulk-order', key: 'bulkOrder' },
  { to: '/gallery', key: 'gallery' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
];

/** Footer quick links (adds FAQ). */
export const footerNav = [...mainNav.slice(0, 6), { to: '/faq', key: 'faq' }, { to: '/contact', key: 'contact' }];
