import { Phone, Store } from 'lucide-react';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';

/** Thin info bar above the navbar: wholesale & retail + both phone numbers. */
export default function TopBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-ink text-white/90">
      <div className="container-page flex items-center justify-between gap-4 text-xs sm:text-sm">
        <p className="hidden items-center gap-2 sm:flex">
          <Store size={14} aria-hidden="true" className="text-accent" />
          {t('topbar.tagline')}
        </p>
        <ul className="flex w-full items-center justify-center gap-x-4 sm:w-auto sm:justify-end" aria-label={t('topbar.callUs')}>
          {shop.phones.map((phone) => (
            <li key={phone.tel}>
              <a
                href={`tel:${phone.tel}`}
                className="inline-flex min-h-[40px] items-center gap-1.5 font-medium tabular-nums transition-colors duration-200 hover:text-accent"
              >
                <Phone size={13} aria-hidden="true" className="text-accent" />
                <span className="sr-only">{t('topbar.callUs')}: </span>
                {phone.display}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
