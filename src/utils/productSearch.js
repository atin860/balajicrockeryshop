/**
 * Product search, filtering and sorting (pure functions — unit tested).
 *
 * Search works in Hindi, English and Hinglish: every product gets a search
 * text made of its names, size, material, category names, category keywords
 * (e.g. "gilas", "chammach") and design names. All words typed must match.
 */
import categories from '../data/categories';
import designs from '../data/designs';
import en from '../i18n/en';
import hi from '../i18n/hi';

/** Lower-case, strip Latin accents and Hindi nukta / chandrabindu differences. */
export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Latin accents
    .replace(/़/g, '') // nukta: ज़ → ज
    .replace(/ँ/g, 'ं') // chandrabindu → anusvara: ँ → ं
    .replace(/\s+/g, ' ')
    .trim();
}

const categoryMap = new Map(categories.map((c) => [c.id, c]));

function searchTextFor(product) {
  const cat = categoryMap.get(product.category) || {};
  const parts = [
    product.nameEn,
    product.nameHi,
    product.sizeEn,
    product.sizeHi,
    product.unitEn,
    product.unitHi,
    en.products.materials[product.material],
    hi.products.materials[product.material],
    cat.nameEn,
    cat.nameHi,
    ...(cat.keywords || []),
    ...product.designs.flatMap((id) => [designs[id]?.nameEn, designs[id]?.nameHi]),
    product.isEcoFriendly ? 'eco इको leaf natural प्राकृतिक' : '',
  ];
  return normalize(parts.filter(Boolean).join(' '));
}

const indexCache = new WeakMap();
const getSearchText = (product) => {
  if (!indexCache.has(product)) indexCache.set(product, searchTextFor(product));
  return indexCache.get(product);
};

/** Does the product match every word of the query? */
export function matchesQuery(product, query) {
  const words = normalize(query).split(' ').filter(Boolean);
  if (words.length === 0) return true;
  const text = getSearchText(product);
  return words.every((w) => text.includes(w));
}

/**
 * Filter products.
 * filters = { q, category, materials: [], eco: bool, inStock: bool }
 */
export function filterProducts(products, { q = '', category = '', materials = [], eco = false, inStock = false } = {}) {
  return products.filter(
    (p) =>
      (!category || p.category === category) &&
      (materials.length === 0 || materials.includes(p.material)) &&
      (!eco || p.isEcoFriendly) &&
      (!inStock || p.inStock) &&
      matchesQuery(p, q),
  );
}

export const SORT_OPTIONS = ['featured', 'nameAZ', 'newest'];

/** Sort without changing the original array. Name sort follows the current language. */
export function sortProducts(products, sort = 'featured', lang = 'hi') {
  const list = [...products];
  const original = new Map(products.map((p, i) => [p.id, i]));
  if (sort === 'nameAZ') {
    const key = lang === 'hi' ? 'nameHi' : 'nameEn';
    return list.sort((a, b) => a[key].localeCompare(b[key], lang === 'hi' ? 'hi' : 'en'));
  }
  if (sort === 'newest') {
    return list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || original.get(b.id) - original.get(a.id));
  }
  // featured: featured first, then in-stock first, then catalogue order
  return list.sort(
    (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.inStock) - Number(a.inStock) || original.get(a.id) - original.get(b.id),
  );
}

/** Materials that exist in a list of products (for the filter checkboxes). */
export function availableMaterials(products) {
  return [...new Set(products.map((p) => p.material))];
}
