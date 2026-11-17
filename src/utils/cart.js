/**
 * Cart logic (pure functions, no React) — used by CartContext and unit-tested.
 *
 * A cart line is one product in one design:
 *   { key: 'silver-pattal-12-inch::golden-border', productId, designId, quantity }
 * The same product in two different designs = two separate lines.
 * No prices are stored or calculated — the shop quotes rates on WhatsApp.
 */
import shop from '../config/shop';
import products from '../data/products';

const productMap = new Map(products.map((p) => [p.id, p]));

export const getProduct = (id) => productMap.get(id);

/** Unique key for a product + design combination. */
export const lineKey = (productId, designId) => (designId ? `${productId}::${designId}` : productId);

/** The design to use: the requested one if the product offers it, otherwise the product's first design (or null). */
export function resolveDesign(product, designId) {
  if (!product || product.designs.length === 0) return null;
  return product.designs.includes(designId) ? designId : product.designs[0];
}

/** Keep a quantity inside the allowed range for a product. */
export function clampQuantity(product, quantity) {
  const min = product?.minQty || 1;
  const value = Math.floor(Number(quantity));
  if (!Number.isFinite(value)) return min;
  return Math.min(shop.maxQtyPerItem, Math.max(min, value));
}

/** Clean up stored/unknown data: drop removed products, fix designs and quantities, merge duplicates. */
export function sanitizeItems(items) {
  if (!Array.isArray(items)) return [];
  const merged = new Map();
  for (const raw of items) {
    const product = getProduct(raw?.productId);
    if (!product) continue;
    const designId = resolveDesign(product, raw.designId);
    const key = lineKey(product.id, designId);
    const existing = merged.get(key);
    const quantity = clampQuantity(product, (existing?.quantity || 0) + (Number(raw.quantity) || 0));
    merged.set(key, { key, productId: product.id, designId, quantity });
  }
  return [...merged.values()];
}

export const initialCartState = { items: [] };

/**
 * Reducer actions:
 *   ADD           { productId, designId, quantity }   adds or increases a line
 *   SET_QUANTITY  { key, quantity }                    sets a line's quantity (clamped)
 *   CHANGE_DESIGN { key, designId }                    switches design (merges if that design is already in cart)
 *   REMOVE        { key }
 *   RESTORE       { item, index }                      undo a removal
 *   CLEAR
 *   HYDRATE       { items }                            replace from storage / another tab
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const product = getProduct(action.productId);
      if (!product || !product.inStock) return state;
      const designId = resolveDesign(product, action.designId);
      const key = lineKey(product.id, designId);
      const addQty = clampQuantity(product, action.quantity ?? product.minQty);
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          items: state.items.map((i) => (i.key === key ? { ...i, quantity: clampQuantity(product, i.quantity + addQty) } : i)),
        };
      }
      return { items: [...state.items, { key, productId: product.id, designId, quantity: addQty }] };
    }

    case 'SET_QUANTITY': {
      return {
        items: state.items.map((i) => (i.key === action.key ? { ...i, quantity: clampQuantity(getProduct(i.productId), action.quantity) } : i)),
      };
    }

    case 'CHANGE_DESIGN': {
      const line = state.items.find((i) => i.key === action.key);
      if (!line) return state;
      const product = getProduct(line.productId);
      const designId = resolveDesign(product, action.designId);
      const newKey = lineKey(product.id, designId);
      if (newKey === line.key) return state;
      const target = state.items.find((i) => i.key === newKey);
      if (target) {
        // Same product in the chosen design already exists → merge quantities into it.
        return {
          items: state.items
            .filter((i) => i.key !== line.key)
            .map((i) => (i.key === newKey ? { ...i, quantity: clampQuantity(product, i.quantity + line.quantity) } : i)),
        };
      }
      return { items: state.items.map((i) => (i.key === line.key ? { ...i, key: newKey, designId } : i)) };
    }

    case 'REMOVE':
      return { items: state.items.filter((i) => i.key !== action.key) };

    case 'RESTORE': {
      if (state.items.some((i) => i.key === action.item.key)) return state;
      const items = [...state.items];
      items.splice(Math.min(action.index ?? items.length, items.length), 0, action.item);
      return { items };
    }

    case 'CLEAR':
      return { items: [] };

    case 'HYDRATE':
      return { items: sanitizeItems(action.items) };

    default:
      return state;
  }
}

/** Number of different lines and total units/packets in the cart. */
export function cartSummary(items) {
  return {
    lines: items.length,
    quantity: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

/* ---------- localStorage (safe: never throws) ---------- */

export function loadCart() {
  try {
    const raw = window.localStorage.getItem(shop.storageKeys.cart);
    return raw ? sanitizeItems(JSON.parse(raw).items) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  try {
    window.localStorage.setItem(shop.storageKeys.cart, JSON.stringify({ v: 1, items }));
  } catch {
    /* storage full or unavailable — cart still works for this visit */
  }
}
