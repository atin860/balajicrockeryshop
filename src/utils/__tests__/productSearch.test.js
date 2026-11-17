import { describe, it, expect } from 'vitest';
import products from '../../data/products';
import { normalize, matchesQuery, filterProducts, sortProducts, availableMaterials } from '../productSearch';

const slugs = (list) => list.map((p) => p.slug);
const find = (slug) => products.find((p) => p.slug === slug);

describe('normalize', () => {
  it('lower-cases and trims', () => expect(normalize('  Silver   PATTAL ')).toBe('silver pattal'));
  it('ignores Hindi nukta and chandrabindu differences', () => {
    expect(normalize('ज़्यादा')).toBe(normalize('ज्यादा'));
    expect(normalize('काँटा')).toBe(normalize('कांटा'));
  });
});

describe('search', () => {
  it('finds by English name', () => expect(matchesQuery(find('silver-pattal-12-inch'), 'silver pattal')).toBe(true));
  it('finds by Hindi name', () => expect(matchesQuery(find('silver-pattal-12-inch'), 'सिल्वर पत्तल')).toBe(true));
  it('finds by Hinglish category keyword', () => {
    expect(matchesQuery(find('plastic-glass-200ml'), 'gilas')).toBe(true);
    expect(matchesQuery(find('plastic-spoon'), 'chammach')).toBe(true);
  });
  it('finds by size and design name', () => {
    expect(matchesQuery(find('silver-pattal-12-inch'), '12 inch golden')).toBe(true);
    expect(matchesQuery(find('paper-tea-cup-150ml'), 'पीली')).toBe(true);
  });
  it('requires every word to match', () => expect(matchesQuery(find('silver-pattal-12-inch'), 'pattal foil')).toBe(false));
  it('empty query matches everything', () => expect(filterProducts(products, { q: '  ' })).toHaveLength(products.length));
});

describe('filterProducts', () => {
  it('filters by category', () => {
    const list = filterProducts(products, { category: 'thali' });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.category === 'thali')).toBe(true);
  });
  it('filters by materials, eco and stock together', () => {
    const list = filterProducts(products, { materials: ['leaf', 'areca'], eco: true, inStock: true });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => ['leaf', 'areca'].includes(p.material) && p.isEcoFriendly && p.inStock)).toBe(true);
  });
  it('combines category and search', () => {
    expect(slugs(filterProducts(products, { category: 'pattal', q: 'silver' }))).toEqual(['silver-pattal-10-inch', 'silver-pattal-12-inch']);
  });
});

describe('sortProducts', () => {
  it('featured puts featured products first and keeps the original array', () => {
    const copy = [...products];
    const sorted = sortProducts(products, 'featured');
    expect(sorted[0].isFeatured).toBe(true);
    expect(products).toEqual(copy);
  });
  it('newest puts new products first', () => expect(sortProducts(products, 'newest')[0].isNew).toBe(true));
  it('nameAZ sorts by the current language', () => {
    const en = sortProducts(products, 'nameAZ', 'en').map((p) => p.nameEn);
    expect(en).toEqual([...en].sort((a, b) => a.localeCompare(b, 'en')));
  });
});

it('availableMaterials lists unique materials', () => {
  const mats = availableMaterials(products);
  expect(new Set(mats).size).toBe(mats.length);
  expect(mats).toContain('leaf');
});
