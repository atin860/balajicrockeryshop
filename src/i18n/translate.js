/**
 * Pure translation helpers (no React) — easy to unit test and reuse,
 * e.g. by the WhatsApp message builder which must work outside components.
 */
import en from './en';
import hi from './hi';

export const dictionaries = { en, hi };
export const SUPPORTED_LANGUAGES = ['hi', 'en'];

/** Read a nested value like "cart.items" from an object. */
export function getByPath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), obj);
}

/** Replace {placeholders} in a string with values from `vars`. Unknown placeholders are left as-is. */
export function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) && vars[name] != null ? String(vars[name]) : match,
  );
}

/**
 * Translate a key for a language.
 * - Falls back to English if the key is missing in the chosen language.
 * - Falls back to the key itself (and warns in development) if missing everywhere.
 * - Strings are interpolated; arrays/objects (e.g. lists of steps) are returned as-is.
 */
export function translate(lang, key, vars) {
  const dict = dictionaries[lang] || dictionaries.en;
  let value = getByPath(dict, key);

  if (value === undefined && dict !== dictionaries.en) {
    value = getByPath(dictionaries.en, key);
  }

  if (value === undefined) {
    if (import.meta.env?.DEV) {
      console.warn(`[i18n] Missing translation key: "${key}"`);
    }
    return key;
  }

  return typeof value === 'string' ? interpolate(value, vars) : value;
}

/** Pick the right language from an object shaped like { en: '...', hi: '...' }. */
export function pickLang(lang, obj) {
  if (obj == null || typeof obj !== 'object') return obj;
  return obj[lang] ?? obj.en;
}

/**
 * Read a bilingual data field such as nameEn / nameHi from a product or category.
 * localizeField('hi', product, 'name') → product.nameHi (falls back to nameEn).
 */
export function localizeField(lang, item, field) {
  if (!item) return '';
  const hiValue = item[`${field}Hi`];
  const enValue = item[`${field}En`];
  return lang === 'hi' ? hiValue ?? enValue : enValue ?? hiValue;
}
