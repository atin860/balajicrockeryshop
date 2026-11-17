import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';

/**
 * CartIcon — bag icon with item-count badge.
 * When the count goes up, the icon bounces and the badge pops.
 */
export default function CartIcon({ count = 0, onClick }) {
  const { t } = useLanguage();
  const controls = useAnimationControls();
  const previous = useRef(count);

  useEffect(() => {
    if (count > previous.current) {
      controls.start({
        y: [0, -6, 0, -3, 0],
        rotate: [0, -8, 6, -3, 0],
        transition: { duration: 0.6, ease: 'easeOut' },
      });
    }
    previous.current = count;
  }, [count, controls]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('nav.openCart', { count })}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-cream-alt"
    >
      <motion.span animate={controls} className="inline-flex">
        <ShoppingBag size={22} aria-hidden="true" />
      </motion.span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white ring-2 ring-cream"
            aria-hidden="true"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
