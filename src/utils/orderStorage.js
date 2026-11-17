/**
 * Browser storage for the order flow (safe: never throws).
 * - lastOrder: shown on the Order Success page, and lets the customer re-send
 *   the WhatsApp message if WhatsApp didn't open.
 * - customer: checkout details remembered on this device for next time.
 */
import shop from '../config/shop';

function read(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the flow still works for this visit */
  }
}

/**
 * Save a snapshot of the order (names in both languages so the success page
 * can switch language even after the cart is cleared).
 */
export function saveLastOrder({ orderId, date, customer, items, message }) {
  write(shop.storageKeys.lastOrder, {
    orderId,
    date: date.toISOString(),
    name: customer.name.trim(),
    delivery: customer.delivery,
    message,
    items: items.map((i) => ({
      slug: i.product.slug,
      nameEn: i.product.nameEn,
      nameHi: i.product.nameHi,
      unitEn: i.product.unitEn,
      unitHi: i.product.unitHi,
      image: i.product.images[0],
      category: i.product.category,
      designEn: i.design?.nameEn || '',
      designHi: i.design?.nameHi || '',
      swatch: i.design?.swatch || '',
      quantity: i.quantity,
    })),
  });
}

export const loadLastOrder = () => read(shop.storageKeys.lastOrder);

/** Only contact/address fields are remembered — never event details or notes. */
export function saveCustomer(customer) {
  const { name, mobile, address, village, pincode, landmark, delivery } = customer;
  write(shop.storageKeys.customer, { name, mobile, address, village, pincode, landmark, delivery });
}

export const loadCustomer = () => read(shop.storageKeys.customer) || {};
