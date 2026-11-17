import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Phone, X } from 'lucide-react';
import shop from '../../config/shop';
import useEnquiry from '../../hooks/useEnquiry';
import useLanguage from '../../hooks/useLanguage';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import Button from '../ui/Button';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { mainNav } from './navLinks';

/** Full-screen animated menu for phones and tablets. */
const EASE_OUT = [0.22, 1, 0.36, 1];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

export default function MobileMenu({ open, onClose }) {
  const { t, pick } = useLanguage();
  const { openEnquiry } = useEnquiry();
  const panelRef = useRef(null);
  const { pathname } = useLocation();

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, { onEscape: onClose });

  // Close when the route changes (e.g. after tapping a link).
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mainNav')}
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-cream lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <div className="container-page flex h-16 shrink-0 items-center justify-between border-b border-line">
            <Logo onClick={onClose} />
            <button
              type="button"
              onClick={onClose}
              aria-label={t('nav.closeMenu')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-cream-alt"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          <nav className="container-page flex-1 py-6">
            <motion.ul variants={listVariants} initial="hidden" animate="show" className="space-y-1">
              {mainNav.map((link) => (
                <motion.li key={link.to} variants={itemVariants}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex min-h-[56px] items-center justify-between rounded-2xl px-4 font-heading text-2xl font-semibold transition-colors duration-200 ${
                        isActive ? 'bg-white text-primary shadow-soft' : 'text-ink hover:bg-white'
                      }`
                    }
                  >
                    {t(`nav.${link.key}`)}
                    <ArrowRight
                      size={20}
                      aria-hidden="true"
                      className="text-ink-muted transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </nav>

          <motion.div
            className="container-page shrink-0 space-y-4 border-t border-line bg-white py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-ink-muted">{t('meta.langName')}</span>
              <LanguageToggle />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {shop.phones.map((phone) => (
                <Button key={phone.tel} href={`tel:${phone.tel}`} variant="secondary" size="sm" icon={Phone} className="tabular-nums">
                  {phone.display.replace('+91 ', '')}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => {
                onClose();
                openEnquiry();
              }}
              variant="whatsapp"
              fullWidth
              icon={WhatsAppIcon}
            >
              {t('common.enquireWhatsApp')}
            </Button>
            <p className="text-center text-xs text-ink-muted">{pick(shop.address)}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
