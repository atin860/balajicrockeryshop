import { Link } from 'react-router-dom';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';

/** Logo mark + two-line shop name in the current language. `tone="light"` for dark backgrounds. */
export default function Logo({ tone = 'dark', onClick, className = '' }) {
  const { pick } = useLanguage();
  const light = tone === 'light';

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={pick(shop.name)}
      className={`group inline-flex min-h-[44px] items-center gap-3 rounded-xl ${className}`}
    >
      <img
        src="/images/logo/logo.svg"
        alt=""
        width="44"
        height="44"
        className="h-10 w-10 shrink-0 transition-transform duration-300 ease-out group-hover:rotate-12 md:h-11 md:w-11"
      />
      <span className="flex flex-col leading-tight">
        <span className={`font-heading text-[17px] font-bold md:text-lg ${light ? 'text-white' : 'text-ink'}`}>
          {pick(shop.shortName)}
        </span>
        <span className={`text-xs font-medium tracking-wide ${light ? 'text-white/70' : 'text-ink-muted'}`}>
          {pick(shop.brandLine)}
        </span>
      </span>
    </Link>
  );
}
