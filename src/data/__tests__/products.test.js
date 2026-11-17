import { describe, it, expect } from 'vitest';
import products from '../products';
import categories from '../categories';
import designs from '../designs';

const categoryIds = new Set(categories.map((c) => c.id));
const materials = ['leaf', 'paper', 'silverCoated', 'plastic', 'aluminium', 'wood', 'areca', 'bagasse', 'thermocol', 'mixed'];

describe('product data', () => {
  it('has at least 30 products', () => {
    expect(products.length).toBeGreaterThanOrEqual(30);
  });

  it('every category has products', () => {
    categories.forEach((c) => expect(products.some((p) => p.category === c.id), c.id).toBe(true));
  });

  it('slugs are unique and URL-safe', () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });

  it('every product is complete and valid', () => {
    products.forEach((p) => {
      const msg = p.slug;
      ['nameEn', 'nameHi', 'unitEn', 'unitHi', 'sizeEn', 'sizeHi', 'descriptionEn', 'descriptionHi'].forEach((f) =>
        expect(typeof p[f] === 'string' && p[f].length > 0, `${msg}.${f}`).toBe(true),
      );
      expect(categoryIds.has(p.category), msg).toBe(true);
      expect(materials, msg).toContain(p.material);
      expect(p.images).toHaveLength(2);
      expect(p.features.length, msg).toBeGreaterThan(0);
      p.features.forEach((f) => expect(f.en && f.hi, msg).toBeTruthy());
      p.designs.forEach((d) => expect(designs[d], `${msg} design ${d}`).toBeDefined());
      expect(p.minQty).toBeGreaterThanOrEqual(1);
    });
  });

  it('contains no price fields (prices are shared on WhatsApp only)', () => {
    products.forEach((p) => {
      Object.keys(p).forEach((k) => expect(k.toLowerCase(), p.slug).not.toMatch(/price/));
    });
  });
});
