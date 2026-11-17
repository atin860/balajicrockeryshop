import useLanguage from '../../hooks/useLanguage';

/**
 * LanguageToggle — segmented [हिं | EN] switch. Choice is saved by LanguageContext.
 */
const options = [
  { value: 'hi', label: 'हिं', aria: 'हिंदी' },
  { value: 'en', label: 'EN', aria: 'English' },
];

export default function LanguageToggle({ compact = false, className = '' }) {
  const { lang, setLang, toggleLang, t } = useLanguage();

  // Compact: one 44px button showing the OTHER language (used in the phone navbar).
  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleLang}
        lang={lang === 'hi' ? 'en' : 'hi'}
        aria-label={`${t('meta.switchTo')} – ${t('meta.switchToLabel')}`}
        className={`inline-flex h-11 min-w-[44px] items-center justify-center rounded-full border border-line bg-white px-2 text-sm font-semibold text-ink transition-colors duration-200 hover:border-accent ${className}`}
      >
        {t('meta.switchTo')}
      </button>
    );
  }

  return (
    <div role="group" aria-label="Language / भाषा" className={`inline-flex rounded-full border border-line bg-white p-1 ${className}`}>
      {options.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            lang={opt.value}
            aria-pressed={active}
            aria-label={opt.aria}
            onClick={() => setLang(opt.value)}
            className={`min-h-[36px] min-w-[44px] rounded-full px-3 text-sm font-semibold transition-colors duration-200 ease-out ${
              active ? 'bg-primary text-white shadow-soft' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
