import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Phone } from 'lucide-react';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';
import useScrolled from '../../hooks/useScrolled';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import CartIcon from './CartIcon';
import MobileMenu from './MobileMenu';
import { mainNav } from './navLinks';

/**
 * Sticky navbar with backdrop blur; gains a shadow once the page scrolls.
 * Desktop (lg+): inline links. Mobile/tablet: hamburger → full-screen menu.
 */
export default function Navbar({ cartCount = 0, onCartClick }) {
  const { t } = useLanguage();
  const scrolled = useScrolled(8);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
        scrolled ? 'border-line bg-cream/85 shadow-nav backdrop-blur-md' : 'border-transparent bg-cream/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Logo />

        <nav aria-label={t('nav.mainNav')} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded-xl px-2.5 text-[15px] font-medium transition-colors duration-200 xl:px-3.5 ${
                      isActive ? 'text-primary' : 'text-ink hover:text-primary'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(`nav.${link.key}`)}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <LanguageToggle compact className="sm:hidden" />
          {shop.features.ordering ? (
            <CartIcon count={cartCount} onClick={onCartClick} />
          ) : (
            // ORDERING ON HOLD: a tap-to-call button takes the cart icon's place.
            <a
              href={`tel:${shop.phones[0].tel}`}
              aria-label={t('callButton.label', { number: shop.phones[0].display })}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors duration-200 hover:bg-primary-light"
            >
              <Phone size={21} aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-cream-alt lg:hidden"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
