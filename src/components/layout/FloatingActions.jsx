import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';
import useEnquiry from '../../hooks/useEnquiry';
import WhatsAppIcon from '../ui/WhatsAppIcon';

/**
 * Floating buttons on every page (bottom-right):
 *  - Phone: tap to call the shop directly (tel: link)
 *  - WhatsApp: opens the enquiry form (name, mobile, message → WhatsApp), with a gentle pulse
 * Pages with a sticky bottom bar lift them via the CSS variable --wa-offset on <body>.
 * They fade away while the footer is on screen (the footer has its own call/WhatsApp
 * buttons), so they never cover footer links or the developer credit.
 */
const EASE = { type: 'spring', stiffness: 260, damping: 18 };

function Tooltip({ children }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-xl bg-ink px-3 py-2 text-sm font-medium text-white opacity-0 shadow-card transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block"
    >
      {children}
    </span>
  );
}

export default function FloatingActions() {
  const { t } = useLanguage();
  const { openEnquiry } = useEnquiry();
  const phone = shop.phones[0];
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return undefined;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { rootMargin: '0px 0px -40px 0px' });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      // `inert` (not just aria-hidden) also removes the hidden buttons from keyboard focus
      inert={footerVisible ? '' : undefined}
      className={`fixed right-4 z-40 flex flex-col items-center gap-3 transition-[opacity,transform] duration-300 ease-out sm:right-6 ${
        footerVisible ? 'pointer-events-none translate-y-4 opacity-0' : ''
      }`}
      style={{ bottom: 'calc(1rem + var(--wa-offset, 0px) + env(safe-area-inset-bottom))' }}
    >
      <motion.a
        href={`tel:${phone.tel}`}
        aria-label={t('callButton.label', { number: phone.display })}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lift"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...EASE, delay: 0.9 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        <Phone size={24} aria-hidden="true" />
        <Tooltip>
          {t('callButton.tooltip')} · {phone.display}
        </Tooltip>
      </motion.a>

      <motion.button
        type="button"
        onClick={() => openEnquiry()}
        aria-label={t('whatsappButton.label')}
        aria-haspopup="dialog"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...EASE, delay: 0.8 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* gentle pulse ring */}
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-whatsapp animate-wa-ring" aria-hidden="true" />
        <WhatsAppIcon size={30} />
        <Tooltip>{t('whatsappButton.tooltip')}</Tooltip>
      </motion.button>
    </div>
  );
}
