/**
 * Party pack builder settings (used by the Party Packs page).
 *
 * A pack = several "slots" (plates, dona, glasses, spoons, bowls). For each slot the
 * customer chooses a product; the number of packets is calculated from the guest
 * count:  packets = ceil(guests × perGuest ÷ pieces per packet).
 * The customer can still change any quantity before adding the pack to the cart.
 */

/** Guest counts shown as quick choices. */
export const GUEST_PRESETS = [50, 100, 250, 500];
export const MIN_GUESTS = 10;
export const MAX_GUESTS = 5000;

/** Slots in display order. `options` are product slugs; the first is the default. */
export const PACK_SLOTS = [
  {
    id: 'plate',
    perGuest: 1,
    included: true,
    options: ['silver-pattal-12-inch', 'silver-pattal-10-inch', 'sal-leaf-pattal', 'paper-plate-9-inch', 'areca-leaf-plate', 'sugarcane-plate', 'thali-5-compartment'],
  },
  {
    id: 'dona',
    perGuest: 1,
    included: true,
    options: ['silver-dona-medium', 'silver-dona-small', 'silver-dona-large', 'sal-leaf-dona', 'printed-paper-dona'],
  },
  {
    id: 'glass',
    perGuest: 1,
    included: true,
    options: ['plastic-glass-200ml', 'plastic-glass-300ml', 'paper-glass-250ml', 'paper-tea-cup-150ml'],
  },
  {
    id: 'spoon',
    perGuest: 1,
    included: true,
    options: ['plastic-spoon', 'wooden-spoon'],
  },
  {
    id: 'bowl',
    perGuest: 1,
    included: false, // optional extra
    options: ['paper-bowl-180ml', 'silver-katori', 'plastic-katori'],
  },
];

/**
 * Set styles — one tap fills every slot with matching products.
 * Keys match the party-pack design ids in src/data/designs.js.
 */
export const SET_STYLES = {
  'silver-set': {
    plate: 'silver-pattal-12-inch',
    dona: 'silver-dona-medium',
    glass: 'plastic-glass-200ml',
    spoon: 'plastic-spoon',
    bowl: 'silver-katori',
  },
  'leaf-set': {
    plate: 'sal-leaf-pattal',
    dona: 'sal-leaf-dona',
    glass: 'paper-glass-250ml',
    spoon: 'wooden-spoon',
    bowl: 'paper-bowl-180ml',
  },
  'paper-set': {
    plate: 'paper-plate-9-inch',
    dona: 'printed-paper-dona',
    glass: 'paper-glass-250ml',
    spoon: 'plastic-spoon',
    bowl: 'paper-bowl-180ml',
  },
};
