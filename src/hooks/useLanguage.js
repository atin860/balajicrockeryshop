import { useContext } from 'react';
import { LanguageContext } from '../i18n/LanguageContext';

/**
 * Access the current language and translation helpers.
 * Must be used inside <LanguageProvider> (set up in main.jsx).
 */
export default function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage() must be used inside <LanguageProvider>.');
  }
  return ctx;
}
