/**
 * WhatsApp ordering
 * =================
 * Builds the order text and opens WhatsApp with it. No prices are included —
 * the shop replies with rates for the customer's quantity.
 *
 *   const orderId = generateOrderId();
 *   const text = buildOrderMessage({ items, customer, event, notes, orderId, lang });
 *   openWhatsApp(text);
 *
 * items:    [{ product, design, quantity }]   (design may be null)
 * customer: { name, mobile, address, landmark, village, pincode, delivery: 'home' | 'pickup' }  (optional)
 * event:    { type, date: 'YYYY-MM-DD', guests }                                                (optional)
 */
import shop, { whatsappLink } from '../config/shop';
import { translate, pickLang, localizeField } from '../i18n/translate';
import { formatDate, formatTime, formatNumber } from './format';
import { isMobileDevice } from './device';
import { normalizeMobile } from './validation';

/** Order ID in the format SBD-YYYYMMDD-XXXX (XXXX = 4 random digits). */
export function generateOrderId(date = new Date(), random = Math.random) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const suffix = String(Math.floor(random() * 10000)).padStart(4, '0');
  return `${shop.orderIdPrefix}-${y}${m}${d}-${suffix}`;
}

const clean = (v) => String(v ?? '').trim();

/** One numbered line per item: "1. Silver Pattal 12 inch (Packet of 50) – Design: Golden Border × 10 packets" */
export function formatItemLine(item, index, lang) {
  const L = (key) => translate(lang, `waMessage.${key}`);
  const name = localizeField(lang, item.product, 'name');
  const unit = localizeField(lang, item.product, 'unit');
  const design = item.design ? ` – ${L('design')}: ${localizeField(lang, item.design, 'name')}` : '';
  return `${index + 1}. ${name} (${unit})${design} × ${formatNumber(item.quantity)} ${L('packets')}`;
}

export function buildOrderMessage({ items = [], customer, event, notes, orderId, date = new Date(), lang = 'hi' }) {
  const L = (key) => translate(lang, `waMessage.${key}`);
  const lines = [];

  lines.push(`🛒 *${L('newOrder')} – ${pickLang(lang, shop.name)}*`);
  if (orderId) lines.push(`${L('orderId')}: ${orderId}`);
  lines.push(`${L('date')}: ${formatDate(date)}, ${formatTime(date)}`);

  // Customer details (checkout only)
  if (customer && clean(customer.name)) {
    lines.push('', `👤 *${L('customerDetails')}*`);
    lines.push(`${L('name')}: ${clean(customer.name)}`);
    lines.push(`${L('mobile')}: ${normalizeMobile(customer.mobile)}`);
    const landmark = clean(customer.landmark);
    lines.push(`${L('address')}: ${clean(customer.address)}${landmark ? `, ${L('landmark')}: ${landmark}` : ''}`);
    lines.push(`${L('villageTown')}: ${clean(customer.village)} – ${L('pincode')}: ${clean(customer.pincode)}`);
    lines.push(`${L('delivery')}: ${customer.delivery === 'pickup' ? L('storePickup') : L('homeDelivery')}`);
  }

  // Event details — omitted completely when empty
  const ev = event ? eventLine(event, lang) : '';
  if (ev) lines.push('', `🎉 *${L('eventDetails')}*`, ev);

  // Items
  lines.push('', `📦 *${L('orderItems')}*`);
  items.forEach((item, i) => lines.push(formatItemLine(item, i, lang)));
  const totalPackets = items.reduce((sum, i) => sum + i.quantity, 0);
  lines.push(`*${L('totalSummary')}: ${translate(lang, 'cart.summary', { items: items.length, packets: formatNumber(totalPackets) })}*`);

  if (clean(notes)) lines.push('', `📝 ${L('notes')}: ${clean(notes)}`);

  lines.push('', L('closing'));
  return lines.join('\n');
}

/** Event line "Event: Wedding | Date: 05/12/2026 | Guests: 300" (empty string when nothing filled). */
function eventLine({ type, date, guests }, lang) {
  const L = (key) => translate(lang, `waMessage.${key}`);
  const parts = [];
  if (clean(type)) parts.push(`${L('event')}: ${translate(lang, `eventTypes.${type}`)}`);
  if (clean(date)) parts.push(`${L('eventDate')}: ${formatDate(date)}`);
  if (clean(guests)) parts.push(`${L('guests')}: ${clean(guests)}`);
  return parts.join(' | ');
}

/**
 * Bulk order / quotation request from the Bulk Order page.
 * form = { name, mobile, eventType, eventDate, guests, items }
 */
export function buildBulkMessage(form, { date = new Date(), lang = 'hi' } = {}) {
  const L = (key) => translate(lang, `waMessage.${key}`);
  const lines = [
    `📋 *${L('bulkTitle')} – ${pickLang(lang, shop.name)}*`,
    `${L('date')}: ${formatDate(date)}, ${formatTime(date)}`,
    '',
    `👤 *${L('customerDetails')}*`,
    `${L('name')}: ${clean(form.name)}`,
    `${L('mobile')}: ${normalizeMobile(form.mobile)}`,
  ];
  const ev = eventLine({ type: form.eventType, date: form.eventDate, guests: form.guests }, lang);
  if (ev) lines.push('', `🎉 *${L('eventDetails')}*`, ev);
  lines.push('', `📦 *${L('itemsNeeded')}*`, clean(form.items), '', L('bulkClosing'));
  return lines.join('\n');
}

/**
 * General enquiry (Contact page and the WhatsApp enquiry pop-up).
 * form = { name, mobile, message, subject? }  — subject e.g. "Silver Pattal 12 inch – Golden Border design"
 */
export function buildContactMessage(form, { date = new Date(), lang = 'hi' } = {}) {
  const L = (key) => translate(lang, `waMessage.${key}`);
  const lines = [
    `💬 *${L('contactTitle')} – ${pickLang(lang, shop.name)}*`,
    `${L('date')}: ${formatDate(date)}, ${formatTime(date)}`,
    '',
    `${L('name')}: ${clean(form.name)}`,
    `${L('mobile')}: ${normalizeMobile(form.mobile)}`,
  ];
  if (clean(form.subject)) lines.push(`${L('about')}: ${clean(form.subject)}`);
  lines.push('', `${L('message')}:`, clean(form.message));
  return lines.join('\n');
}

/** wa.me URL for the shop with the message encoded. */
export const whatsappUrl = (message) => whatsappLink(message);

/**
 * Open WhatsApp with a message: same tab on mobile (launches the app),
 * new tab on desktop (WhatsApp Web). Returns the URL used.
 */
export function openWhatsApp(message) {
  const url = whatsappUrl(message);
  if (isMobileDevice()) {
    window.location.href = url;
  } else {
    // Note: passing "noopener" makes window.open() always return null, so detach the opener manually.
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // pop-up blocked → fall back to same tab
  }
  return url;
}
