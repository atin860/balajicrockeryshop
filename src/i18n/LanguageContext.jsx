import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import shop from '../config/shop';
import { SUPPORTED_LANGUAGES, translate, pickLang, localizeField } from './translate';

/**
 * LanguageContext
 * ---------------
 * Holds the current language ('hi' | 'en'), saves it to localStorage and keeps
 * <html lang="..."> in sync (important for screen readers, fonts and SEO).
 *
 * Components use it through the useLanguage() hook:
 *   const { t, lang, toggleLang, pick, localize } = useLanguage();
 *   t('cart.items', { count: 3 })     → "3 items" / "3 आइटम"
 *   pick(shop.address)                → address in the current language
 *   localize(product, 'name')         → product.nameHi or product.nameEn
 */
export const LanguageContext = createContext(null);

const storageKey = shop.storageKeys.language;

/** Read the saved language safely (localStorage can throw in private mode). */
function getInitialLanguage() {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
  } catch {
    /* storage unavailable — use default */
  }
  return shop.defaultLanguage;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLanguage);

  // Persist and reflect the language on <html>.
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(storageKey, lang);
    } catch {
      /* ignore storage errors */
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    if (SUPPORTED_LANGUAGES.includes(next)) setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((current) => (current === 'hi' ? 'en' : 'hi'));
  }, []);

  const value = useMemo(
    () => ({
      lang,
      isHindi: lang === 'hi',
      setLang,
      toggleLang,
      t: (key, vars) => translate(lang, key, vars),
      pick: (obj) => pickLang(lang, obj),
      localize: (item, field) => localizeField(lang, item, field),
    }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
