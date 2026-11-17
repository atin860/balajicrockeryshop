/**
 * Form validation helpers (bulk order, contact and checkout forms).
 * Each validator returns an i18n error key (e.g. 'checkout.errors.mobile') or '' when valid.
 */

/** Keep only the 10-digit Indian mobile number: "+91 98765-43210" → "9876543210". */
export function normalizeMobile(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export const isValidMobile = (value) => /^[6-9]\d{9}$/.test(normalizeMobile(value));
export const isValidPincode = (value) => /^[1-9]\d{5}$/.test(String(value || '').trim());

/** "YYYY-MM-DD" today or later (local time). */
export function isTodayOrLater(value) {
  if (!value) return true;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/** Today as "YYYY-MM-DD" for the min attribute of date inputs. */
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const E = (key) => `checkout.errors.${key}`;

export const validators = {
  required: (v) => (String(v ?? '').trim() ? '' : E('required')),
  name: (v) => (String(v ?? '').trim().length >= 2 ? '' : E('name')),
  mobile: (v) => (isValidMobile(v) ? '' : E('mobile')),
  pincode: (v) => (isValidPincode(v) ? '' : E('pincode')),
  /** Optional number of guests: empty is fine, otherwise 1–100000. */
  guests: (v) => {
    if (String(v ?? '').trim() === '') return '';
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 100000 ? '' : E('guests');
  },
  futureDate: (v) => (isTodayOrLater(v) ? '' : E('date')),
};

/**
 * Validate values against a schema: { field: ['required', 'mobile'] }.
 * Returns { field: errorKey } for the first failing rule of each field.
 */
export function validate(values, schema) {
  const errors = {};
  Object.entries(schema).forEach(([field, rules]) => {
    for (const rule of rules) {
      const error = validators[rule](values[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  return errors;
}
