import shop from '../config/shop';

/**
 * Formatting helpers. The website shows no prices — only quantities and dates.
 */

/** Indian digit grouping: 100000 → "1,00,000". */
export function formatNumber(value) {
  return new Intl.NumberFormat(shop.locale).format(Number(value) || 0);
}

/** Date → "DD/MM/YYYY" (accepts Date or "YYYY-MM-DD" from <input type="date">). */
export function formatDate(input) {
  if (!input) return '';
  const date = typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input) ? new Date(`${input}T00:00:00`) : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${date.getFullYear()}`;
}

/** Date → "HH:MM" (24-hour). */
export function formatTime(date) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
