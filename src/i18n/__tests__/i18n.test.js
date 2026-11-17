import { describe, it, expect } from 'vitest';
import en from '../en';
import hi from '../hi';
import { translate, interpolate, pickLang, localizeField } from '../translate';

/** Flatten an object into "a.b.c" paths. Arrays are compared by length at their own path. */
function flatten(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      return [
        [`${path}[length]`, value.length],
        ...value.flatMap((item, i) =>
          item && typeof item === 'object' ? flatten(item, `${path}.${i}`) : [[`${path}.${i}`, item]],
        ),
      ];
    }
    if (value && typeof value === 'object') return flatten(value, path);
    return [[path, value]];
  });
}

const placeholders = (str) => (typeof str === 'string' ? (str.match(/\{\w+\}/g) || []).sort() : []);

describe('dictionaries', () => {
  const enFlat = Object.fromEntries(flatten(en));
  const hiFlat = Object.fromEntries(flatten(hi));

  it('Hindi has exactly the same keys as English', () => {
    expect(Object.keys(hiFlat).sort()).toEqual(Object.keys(enFlat).sort());
  });

  it('arrays have the same number of items in both languages', () => {
    Object.keys(enFlat)
      .filter((k) => k.endsWith('[length]'))
      .forEach((k) => expect(hiFlat[k], k).toBe(enFlat[k]));
  });

  it('every translation uses the same {placeholders}', () => {
    Object.keys(enFlat).forEach((k) => {
      expect(placeholders(hiFlat[k]), k).toEqual(placeholders(enFlat[k]));
    });
  });

  it('no translation is empty', () => {
    [...Object.entries(enFlat), ...Object.entries(hiFlat)].forEach(([k, v]) => {
      if (typeof v === 'string') expect(v.trim().length, k).toBeGreaterThan(0);
    });
  });
});

describe('translate()', () => {
  it('returns the string for the chosen language', () => {
    expect(translate('en', 'nav.home')).toBe('Home');
    expect(translate('hi', 'nav.home')).toBe('होम');
  });

  it('interpolates placeholders', () => {
    expect(translate('en', 'cart.items', { count: 3 })).toBe('3 items');
    expect(translate('hi', 'cart.items', { count: 3 })).toBe('3 आइटम');
  });

  it('returns arrays as-is', () => {
    expect(Array.isArray(translate('hi', 'home.whyItems'))).toBe(true);
  });

  it('falls back to the key when missing', () => {
    expect(translate('en', 'does.not.exist')).toBe('does.not.exist');
  });

  it('falls back to English for an unknown language', () => {
    expect(translate('fr', 'nav.home')).toBe('Home');
  });
});

describe('helpers', () => {
  it('interpolate leaves unknown placeholders untouched', () => {
    expect(interpolate('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });

  it('pickLang chooses language with English fallback', () => {
    expect(pickLang('hi', { en: 'Hello', hi: 'नमस्ते' })).toBe('नमस्ते');
    expect(pickLang('hi', { en: 'Hello' })).toBe('Hello');
  });

  it('localizeField reads nameEn / nameHi', () => {
    const p = { nameEn: 'Silver Pattal', nameHi: 'सिल्वर पत्तल' };
    expect(localizeField('hi', p, 'name')).toBe('सिल्वर पत्तल');
    expect(localizeField('en', p, 'name')).toBe('Silver Pattal');
  });
});
