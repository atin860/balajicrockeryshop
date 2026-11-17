import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, ShoppingCart } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import ImageWithFallback from '../ui/ImageWithFallback';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { DesignSwatch } from './DesignPicker';

/**
 * Sticky bottom bar on phones/tablets (product page). Appears once the main
 * action button scrolls out of view. Lifts the floating buttons above itself
 * via the --wa-offset CSS variable.
 *
 * enquiryMode (ordering on hold): WhatsApp opens the enquiry form and the main
 * button calls the shop. Otherwise: WhatsApp order + Add to Cart.
 */
export default function StickyAddToCart({ visible, product, design, quantity, onAdd, onWhatsApp, enquiryMode = false, callHref }) {
  const { t, localize } = useLanguage();
  const name = localize(product, 'name');

  useEffect(() => {
    const isSmall = window.matchMedia('(max-width: 1023px)').matches;
    document.body.style.setProperty('--wa-offset', visible && isSmall ? '76px' : '0px');
    return () => document.body.style.setProperty('--wa-offset', '0px');
  }, [visible]);

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-12px_rgba(31,31,31,0.18)] backdrop-blur-md lg:hidden"
        >
          <div className="container-page flex h-[68px] items-center gap-3">
            <ImageWithFallback
              src={product.images[0]}
              alt=""
              width={800}
              height={800}
              aspect="1 / 1"
              category={product.category}
              label=""
              className="hidden w-11 shrink-0 rounded-xl sm:block"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="flex items-center gap-1.5 truncate text-xs text-ink-muted">
                {design && <DesignSwatch design={design} size="xs" />}
                {design ? localize(design, 'name') : localize(product, 'unit')}
                {!enquiryMode && ` · ${t('common.packets', { count: quantity })}`}
              </p>
            </div>
            <button
              type="button"
              onClick={onWhatsApp}
              aria-label={enquiryMode ? t('common.enquireWhatsApp') : t('product.orderNowWhatsApp')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-whatsapp-deep text-white transition-colors duration-200 hover:bg-whatsapp-deeper"
            >
              <WhatsAppIcon size={22} />
            </button>
            {enquiryMode ? (
              <a
                href={callHref}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
              >
                <Phone size={16} aria-hidden="true" />
                {t('common.callNow')}
              </a>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                disabled={!product.inStock}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:opacity-50"
              >
                <ShoppingCart size={16} aria-hidden="true" />
                {t('common.addToCart')}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
