import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';

/**
 * Full-screen photo viewer.
 * - Opens with fade + scale; Escape / backdrop / ✕ closes
 * - ← → keys, on-screen arrows, or swipe on phones to change photo
 * - Keyboard focus is trapped inside while open and returns afterwards
 *
 *   <Lightbox items={photos} index={i} onChange={setI} onClose={() => setI(null)} />
 *   onChange must accept an updater function (a React state setter does).
 *   items: [{ src, width, height, title }]
 */
export default function Lightbox({ items, index, onChange, onClose }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const open = index !== null && index >= 0;

  useLockBodyScroll(open);
  useFocusTrap(ref, open, { onEscape: onClose });

  // Functional update so quick repeated key presses always step from the latest photo.
  const go = (delta) => onChange((i) => (i + delta + items.length) % items.length);

  // Arrow keys
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Preload neighbours for instant switching
  useEffect(() => {
    if (!open) return;
    [index + 1, index - 1].forEach((i) => {
      const item = items[(i + items.length) % items.length];
      if (item) new Image().src = item.src;
    });
  }, [open, index, items]);

  const item = open ? items[index] : null;
  const btn =
    'inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25';

  return createPortal(
    <AnimatePresence>
      {open && (
        // Plain wrapper + animated layers (same pattern as Drawer) so the closed
        // viewer is reliably removed from the page after its exit animation.
        <div key="lightbox" ref={ref} role="dialog" aria-modal="true" aria-label={t('gallery.lightboxLabel')} className="fixed inset-0 z-[90]">
          <motion.div
            className="absolute inset-0 bg-black/90"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        <motion.div
          className="relative flex h-full flex-col"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 p-3 text-white sm:p-4">
            <p className="text-sm tabular-nums text-white/80" aria-live="polite">
              {t('gallery.counter', { current: index + 1, total: items.length })}
            </p>
            <button type="button" onClick={onClose} aria-label={t('common.close')} className={btn}>
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          {/* Photo */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onClick={(e) => e.target === e.currentTarget && onClose()}>
            {/* Keyed by src: a new photo re-mounts and plays its enter animation.
                (No nested AnimatePresence here — it kept the closed dialog in the DOM.) */}
            <motion.div
              key={item.src}
              className="flex h-full max-h-full max-w-full cursor-grab touch-pan-y items-center justify-center active:cursor-grabbing"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
            >
              <img
                src={item.src}
                alt={item.title}
                width={item.width}
                height={item.height}
                draggable="false"
                className="max-h-full max-w-full select-none rounded-xl object-contain shadow-lift"
              />
            </motion.div>

            {items.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label={t('common.previous')} className={`${btn} absolute left-2 top-1/2 hidden -translate-y-1/2 sm:inline-flex sm:left-4`}>
                  <ChevronLeft size={26} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label={t('common.next')} className={`${btn} absolute right-2 top-1/2 hidden -translate-y-1/2 sm:inline-flex sm:right-4`}>
                  <ChevronRight size={26} aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {/* Caption + phone arrows */}
          <div className="flex items-center justify-between gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-white">
            <button type="button" onClick={() => go(-1)} aria-label={t('common.previous')} className={`${btn} sm:invisible`}>
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <p className="flex-1 text-center text-sm font-medium sm:text-base">{item.title}</p>
            <button type="button" onClick={() => go(1)} aria-label={t('common.next')} className={`${btn} sm:invisible`}>
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
