import { describe, it, expect } from 'vitest';
import { cartReducer, initialCartState, lineKey, sanitizeItems, cartSummary, clampQuantity, getProduct } from '../cart';

const PATTAL = 'silver-pattal-12-inch'; // designs: plain-silver, golden-border, red-border, floral-print
const LEAF = 'sal-leaf-pattal'; // no designs

const add = (state, productId, designId, quantity) => cartReducer(state, { type: 'ADD', productId, designId, quantity });

describe('cartReducer', () => {
  it('adds a product with the chosen design', () => {
    const s = add(initialCartState, PATTAL, 'golden-border', 5);
    expect(s.items).toEqual([{ key: lineKey(PATTAL, 'golden-border'), productId: PATTAL, designId: 'golden-border', quantity: 5 }]);
  });

  it('uses the first design when none / an invalid one is given', () => {
    expect(add(initialCartState, PATTAL, undefined, 1).items[0].designId).toBe('plain-silver');
    expect(add(initialCartState, PATTAL, 'not-a-design', 1).items[0].designId).toBe('plain-silver');
  });

  it('products without designs have designId null', () => {
    const s = add(initialCartState, LEAF, 'golden-border', 2);
    expect(s.items[0]).toMatchObject({ key: LEAF, designId: null, quantity: 2 });
  });

  it('same product + same design increases quantity; different design adds a new line', () => {
    let s = add(initialCartState, PATTAL, 'golden-border', 5);
    s = add(s, PATTAL, 'golden-border', 3);
    s = add(s, PATTAL, 'red-border', 2);
    expect(s.items).toHaveLength(2);
    expect(s.items[0].quantity).toBe(8);
    expect(s.items[1].quantity).toBe(2);
  });

  it('ignores unknown products', () => {
    expect(add(initialCartState, 'nope', null, 1)).toBe(initialCartState);
  });

  it('SET_QUANTITY clamps to min 1 and max', () => {
    let s = add(initialCartState, PATTAL, 'plain-silver', 5);
    const key = s.items[0].key;
    s = cartReducer(s, { type: 'SET_QUANTITY', key, quantity: 0 });
    expect(s.items[0].quantity).toBe(1);
    s = cartReducer(s, { type: 'SET_QUANTITY', key, quantity: 1e9 });
    expect(s.items[0].quantity).toBe(9999);
  });

  it('CHANGE_DESIGN switches design, and merges when that design is already in the cart', () => {
    let s = add(initialCartState, PATTAL, 'plain-silver', 4);
    s = add(s, PATTAL, 'red-border', 6);
    s = cartReducer(s, { type: 'CHANGE_DESIGN', key: lineKey(PATTAL, 'plain-silver'), designId: 'golden-border' });
    expect(s.items.map((i) => i.designId)).toEqual(['golden-border', 'red-border']);
    s = cartReducer(s, { type: 'CHANGE_DESIGN', key: lineKey(PATTAL, 'golden-border'), designId: 'red-border' });
    expect(s.items).toEqual([{ key: lineKey(PATTAL, 'red-border'), productId: PATTAL, designId: 'red-border', quantity: 10 }]);
  });

  it('REMOVE then RESTORE puts the line back in the same place', () => {
    let s = add(initialCartState, PATTAL, 'plain-silver', 1);
    s = add(s, LEAF, null, 2);
    s = add(s, 'plastic-spoon', 'clear', 3);
    const removed = s.items[1];
    s = cartReducer(s, { type: 'REMOVE', key: removed.key });
    expect(s.items).toHaveLength(2);
    s = cartReducer(s, { type: 'RESTORE', item: removed, index: 1 });
    expect(s.items[1]).toEqual(removed);
  });

  it('CLEAR empties the cart', () => {
    const s = cartReducer(add(initialCartState, LEAF, null, 2), { type: 'CLEAR' });
    expect(s.items).toEqual([]);
  });
});

describe('sanitizeItems', () => {
  it('drops unknown products, fixes designs, merges duplicates and clamps quantities', () => {
    const items = sanitizeItems([
      { productId: 'deleted-product', quantity: 3 },
      { productId: PATTAL, designId: 'red-border', quantity: 2 },
      { productId: PATTAL, designId: 'red-border', quantity: 3 },
      { productId: LEAF, designId: 'whatever', quantity: -5 },
    ]);
    expect(items).toEqual([
      { key: lineKey(PATTAL, 'red-border'), productId: PATTAL, designId: 'red-border', quantity: 5 },
      { key: LEAF, productId: LEAF, designId: null, quantity: 1 },
    ]);
  });

  it('handles garbage input', () => {
    expect(sanitizeItems(null)).toEqual([]);
    expect(sanitizeItems('x')).toEqual([]);
  });
});

describe('helpers', () => {
  it('cartSummary counts lines and packets', () => {
    expect(cartSummary([{ quantity: 3 }, { quantity: 7 }])).toEqual({ lines: 2, quantity: 10 });
  });

  it('clampQuantity handles text and decimals', () => {
    const p = getProduct(PATTAL);
    expect(clampQuantity(p, '12')).toBe(12);
    expect(clampQuantity(p, 2.9)).toBe(2);
    expect(clampQuantity(p, 'abc')).toBe(1);
  });
});
