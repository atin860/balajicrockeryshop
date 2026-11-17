import { describe, it, expect } from 'vitest';
import { getProductBySlug } from '../../data/products';
import { getDesign } from '../../data/designs';
import { buildOrderMessage, generateOrderId, formatItemLine, whatsappUrl } from '../whatsapp';

const date = new Date(2026, 10, 17, 9, 5); // 17/11/2026 09:05
const items = [
  { product: getProductBySlug('silver-pattal-12-inch'), design: getDesign('golden-border'), quantity: 10 },
  { product: getProductBySlug('sal-leaf-pattal'), design: null, quantity: 5 },
];
const customer = {
  name: 'Ramesh Gupta',
  mobile: '9876543210',
  address: 'House 12, Main Road',
  landmark: 'Near Temple',
  village: 'Bilsanda',
  pincode: '262202',
  delivery: 'home',
};

describe('generateOrderId', () => {
  it('uses SBD-YYYYMMDD-XXXX', () => {
    expect(generateOrderId(date, () => 0.0042)).toBe('SBD-20261117-0042');
    expect(generateOrderId(new Date())).toMatch(/^SBD-\d{8}-\d{4}$/);
  });
});

describe('buildOrderMessage (English)', () => {
  const msg = buildOrderMessage({
    items,
    customer,
    event: { type: 'wedding', date: '2026-12-05', guests: '300' },
    notes: 'Deliver before 10 AM',
    orderId: 'SBD-20261117-0042',
    date,
    lang: 'en',
  });

  it('has the header, order ID and date', () => {
    expect(msg).toContain('🛒 *New Order – Shri Balaji Dona Pattal Store*');
    expect(msg).toContain('Order ID: SBD-20261117-0042');
    expect(msg).toContain('Date: 17/11/2026, 09:05');
  });

  it('has customer details', () => {
    expect(msg).toContain('Name: Ramesh Gupta');
    expect(msg).toContain('Address: House 12, Main Road, Landmark: Near Temple');
    expect(msg).toContain('Village/Town: Bilsanda – Pincode: 262202');
    expect(msg).toContain('Delivery: Home Delivery');
  });

  it('has event details on one line', () => {
    expect(msg).toContain('Event: Wedding | Date: 05/12/2026 | Guests: 300');
  });

  it('lists items with design and quantity, and the total', () => {
    expect(msg).toContain('1. Silver Pattal 12 inch (Packet of 50) – Design: Golden Border × 10 packets');
    expect(msg).toContain('2. Sal Leaf Pattal (Packet of 50) × 5 packets');
    expect(msg).toContain('*Total: 2 items · 15 packets*');
  });

  it('has notes and closing, and NO prices', () => {
    expect(msg).toContain('📝 Notes: Deliver before 10 AM');
    expect(msg.trim().endsWith('Please share the rates and confirm my order. धन्यवाद!')).toBe(true);
    expect(msg).not.toMatch(/₹|price|subtotal/i);
  });
});

describe('buildOrderMessage (optional parts)', () => {
  it('omits customer and event sections when not given (product page quick order)', () => {
    const msg = buildOrderMessage({ items: [items[0]], date, lang: 'en' });
    expect(msg).not.toContain('Customer Details');
    expect(msg).not.toContain('Event Details');
    expect(msg).not.toContain('Notes');
  });

  it('omits event section when all event fields are empty', () => {
    const msg = buildOrderMessage({ items, customer, event: { type: '', date: '', guests: '' }, date, lang: 'en' });
    expect(msg).not.toContain('Event Details');
  });

  it('shows store pickup and skips empty landmark', () => {
    const msg = buildOrderMessage({ items, customer: { ...customer, landmark: '', delivery: 'pickup' }, date, lang: 'en' });
    expect(msg).toContain('Delivery: Store Pickup');
    expect(msg).toContain('Address: House 12, Main Road\n');
  });

  it('builds a Hindi message', () => {
    const msg = buildOrderMessage({ items, customer, date, lang: 'hi' });
    expect(msg).toContain('नया ऑर्डर');
    expect(msg).toContain('सिल्वर पत्तल 12 इंच (50 का पैकेट) – डिज़ाइन: सुनहरा बॉर्डर × 10 पैकेट');
    expect(msg).toContain('कृपया रेट बताएँ और मेरा ऑर्डर कन्फर्म करें। धन्यवाद!');
  });
});

it('formatItemLine numbers from 1', () => {
  expect(formatItemLine(items[1], 0, 'en')).toMatch(/^1\. /);
});

it('whatsappUrl encodes the message for the shop number', () => {
  const url = whatsappUrl('नमस्ते, test & more');
  expect(url.startsWith('https://wa.me/918445009955?text=')).toBe(true);
  expect(decodeURIComponent(url.split('text=')[1])).toBe('नमस्ते, test & more');
});
