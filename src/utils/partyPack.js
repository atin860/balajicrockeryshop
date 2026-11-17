/**
 * Party pack calculations (pure functions — unit tested).
 */
import { PACK_SLOTS, SET_STYLES, MIN_GUESTS, MAX_GUESTS } from '../data/partyPacks';
import { getProductBySlug } from '../data/products';
import { getDesign } from '../data/designs';

/** Packets needed so every guest is covered (always rounds up to full packets). */
export function packetsFor(guests, perGuest, packSize) {
  const pieces = Math.max(0, Math.floor(guests)) * perGuest;
  return Math.max(1, Math.ceil(pieces / Math.max(1, packSize)));
}

export function clampGuests(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return MIN_GUESTS;
  return Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, n));
}

/**
 * Initial builder state for a set style.
 * state.slots = { plate: { productId, designId, included, quantity: null }, … }
 * quantity null = "use the calculated amount".
 */
export function createPackState(style = 'silver-set', guests = 100) {
  const choice = SET_STYLES[style] || SET_STYLES['silver-set'];
  const slots = {};
  PACK_SLOTS.forEach((slot) => {
    const productId = choice[slot.id] || slot.options[0];
    const product = getProductBySlug(productId);
    slots[slot.id] = {
      productId,
      designId: product?.designs[0] ?? null,
      included: slot.included,
      quantity: null,
    };
  });
  return { style, guests: clampGuests(guests), slots };
}

/** Apply a set style to an existing state (keeps guests and which slots are included). */
export function applyStyle(state, style) {
  const fresh = createPackState(style, state.guests);
  Object.keys(fresh.slots).forEach((id) => {
    fresh.slots[id].included = state.slots[id]?.included ?? fresh.slots[id].included;
  });
  return fresh;
}

/** Items for the cart / WhatsApp: [{ slotId, product, design, quantity, calculated }]. */
export function buildPackItems(state) {
  return PACK_SLOTS.filter((slot) => state.slots[slot.id]?.included)
    .map((slot) => {
      const s = state.slots[slot.id];
      const product = getProductBySlug(s.productId);
      if (!product) return null;
      const calculated = packetsFor(state.guests, slot.perGuest, product.packSize);
      return {
        slotId: slot.id,
        product,
        design: getDesign(s.designId),
        quantity: s.quantity ?? calculated,
        calculated,
      };
    })
    .filter(Boolean);
}
