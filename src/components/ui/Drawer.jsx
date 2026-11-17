import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';
import useLanguage from '../../hooks/useLanguage';

/**
 * Drawer — slide-in panel with backdrop (cart drawer, mobile filters).
 * Keyboard accessible: focus is trapped inside, Escape closes, focus returns on close.
 *
 *   <Drawer open={open} onClose={close} title="Cart" side="right" footer={<Button/>}>…</Drawer>
 */
const panelPosition = {
  right: 'inset-y-0 right-0 w-full max-w-md',
  left: 'inset-y-0 left-0 w-full max-w-sm',
};

const panelMotion = {
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
};

export default function Drawer({ open, onClose, title, side = 'right', footer, children, className = '' }) {
  const { t } = useLanguage();
  const panelRef = useRef(null);
  const titleId = useId();

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, { onEscape: onClose });

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`absolute flex flex-col bg-cream shadow-lift focus:outline-none ${panelPosition[side]} ${className}`}
            {...panelMotion[side]}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
              <h2 id={titleId} className="text-lg">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('common.close')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-cream-alt"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
            {footer && <footer className="border-t border-line bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</footer>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
