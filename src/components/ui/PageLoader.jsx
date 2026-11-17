import useLanguage from '../../hooks/useLanguage';

/** Shown briefly while a lazy-loaded page downloads. */
export default function PageLoader() {
  const { t } = useLanguage();
  return (
    // Full screen height so the footer stays below the fold while a page loads (no layout shift).
    <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-primary" aria-hidden="true" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}
