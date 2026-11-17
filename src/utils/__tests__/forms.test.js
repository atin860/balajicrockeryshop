import { describe, it, expect } from 'vitest';
import { normalizeMobile, isValidMobile, isValidPincode, isTodayOrLater, validate, todayISO } from '../validation';
import { packetsFor, clampGuests, createPackState, applyStyle, buildPackItems } from '../partyPack';
import { buildBulkMessage, buildContactMessage } from '../whatsapp';

describe('buildContactMessage', () => {
  it('formats a contact enquiry with a clean mobile number', () => {
    const msg = buildContactMessage(
      { name: ' Sunita ', mobile: '+91 98765 43210', message: 'Do you have red border pattal?' },
      { date: new Date(2026, 10, 17, 10, 0), lang: 'en' },
    );
    expect(msg).toContain('💬 *New Enquiry from Website – Shri Balaji Dona Pattal Store*');
    expect(msg).toContain('Name: Sunita');
    expect(msg).toContain('Mobile: 9876543210');
    expect(msg).toContain('Message:\nDo you have red border pattal?');
    expect(msg).not.toContain('Enquiry about');
  });

  it('adds the product/pack the enquiry is about', () => {
    const msg = buildContactMessage(
      { name: 'Sunita', mobile: '9876543210', message: 'Rate please', subject: 'Silver Pattal 12 inch – Golden Border design' },
      { date: new Date(2026, 10, 17, 10, 0), lang: 'en' },
    );
    expect(msg).toContain('Mobile: 9876543210\nEnquiry about: Silver Pattal 12 inch – Golden Border design\n\nMessage:\nRate please');
  });
});

describe('validation', () => {
  it('normalizes Indian mobile numbers', () => {
    expect(normalizeMobile('+91 98765-43210')).toBe('9876543210');
    expect(normalizeMobile('09876543210')).toBe('9876543210');
  });
  it('accepts only valid 10-digit mobiles starting 6–9', () => {
    expect(isValidMobile('9876543210')).toBe(true);
    expect(isValidMobile('+91 84450 09955')).toBe(true);
    expect(isValidMobile('5876543210')).toBe(false);
    expect(isValidMobile('98765')).toBe(false);
  });
  it('checks 6-digit pincodes', () => {
    expect(isValidPincode('262202')).toBe(true);
    expect(isValidPincode('062202')).toBe(false);
    expect(isValidPincode('26220')).toBe(false);
  });
  it('dates must be today or later', () => {
    expect(isTodayOrLater(todayISO())).toBe(true);
    expect(isTodayOrLater('2000-01-01')).toBe(false);
    expect(isTodayOrLater('')).toBe(true);
  });
  it('validate returns the first failing rule per field', () => {
    const errors = validate(
      { name: '', mobile: '123', guests: 'abc', date: '2000-01-01', items: 'x' },
      { name: ['required', 'name'], mobile: ['required', 'mobile'], guests: ['guests'], date: ['futureDate'], items: ['required'] },
    );
    expect(errors).toEqual({
      name: 'checkout.errors.required',
      mobile: 'checkout.errors.mobile',
      guests: 'checkout.errors.guests',
      date: 'checkout.errors.date',
    });
  });
});

describe('party pack', () => {
  it('rounds packets up', () => {
    expect(packetsFor(100, 1, 50)).toBe(2);
    expect(packetsFor(101, 1, 50)).toBe(3);
    expect(packetsFor(10, 1, 100)).toBe(1);
  });
  it('clamps guests', () => {
    expect(clampGuests(3)).toBe(10);
    expect(clampGuests(999999)).toBe(5000);
    expect(clampGuests('250')).toBe(250);
  });
  it('builds items for the chosen set and guests', () => {
    const items = buildPackItems(createPackState('silver-set', 250));
    expect(items.map((i) => [i.product.slug, i.quantity])).toEqual([
      ['silver-pattal-12-inch', 5], // packet of 50
      ['silver-dona-medium', 3], // packet of 100
      ['plastic-glass-200ml', 3], // packet of 100
      ['plastic-spoon', 3], // packet of 100
    ]);
    expect(items[0].design.id).toBe('plain-silver');
  });
  it('optional bowl slot is excluded by default; manual quantity overrides', () => {
    const state = createPackState('leaf-set', 100);
    state.slots.bowl.included = true;
    state.slots.plate.quantity = 9;
    const items = buildPackItems(state);
    expect(items.find((i) => i.slotId === 'bowl')).toBeTruthy();
    expect(items.find((i) => i.slotId === 'plate')).toMatchObject({ quantity: 9, calculated: 2 });
  });
  it('applyStyle swaps products but keeps guests and included slots', () => {
    const state = createPackState('silver-set', 300);
    state.slots.spoon.included = false;
    const next = applyStyle(state, 'leaf-set');
    expect(next.guests).toBe(300);
    expect(next.slots.plate.productId).toBe('sal-leaf-pattal');
    expect(next.slots.spoon.included).toBe(false);
  });
});

describe('buildBulkMessage', () => {
  const date = new Date(2026, 10, 17, 18, 30);
  it('formats a bulk quote request', () => {
    const msg = buildBulkMessage(
      { name: 'Shyam Caterers', mobile: '9876543210', eventType: 'wedding', eventDate: '2026-12-10', guests: '800', items: '800 silver pattal\n800 glasses' },
      { date, lang: 'en' },
    );
    expect(msg).toContain('📋 *Bulk Order Quote Request – Shri Balaji Dona Pattal Store*');
    expect(msg).toContain('Name: Shyam Caterers');
    expect(msg).toContain('Event: Wedding | Date: 10/12/2026 | Guests: 800');
    expect(msg).toContain('📦 *Items needed*\n800 silver pattal\n800 glasses');
    expect(msg).toContain('Please share your best rate and availability. धन्यवाद!');
  });
  it('omits the event section when empty', () => {
    const msg = buildBulkMessage({ name: 'A B', mobile: '9876543210', items: 'x' }, { date, lang: 'en' });
    expect(msg).not.toContain('Event Details');
  });
});
