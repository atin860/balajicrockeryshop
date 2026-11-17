import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

/**
 * Toast notifications ("Silver Pattal added to cart · View cart").
 *
 *   const toast = useToast();
 *   toast({ title: '…', description: '…', action: { label: 'Undo', onClick } });
 *
 * Shown at the top (below the navbar) so they never cover the WhatsApp button.
 * Announced to screen readers via an aria-live region.
 */
export const ToastContext = createContext(null);

const MAX_TOASTS = 3;
let nextId = 1;

const icons = { success: CheckCircle2, info: Info };

export function ToastProvider({ children }) {
  const { t: tr } = useLanguage();
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'success', action, image, duration = 3500 }) => {
      const id = nextId++;
      setToasts((list) => [...list, { id, title, description, variant, action, image }].slice(-MAX_TOASTS));
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      );
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="false"
          className="pointer-events-none fixed inset-x-0 top-[72px] z-[80] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:top-24 sm:items-end"
        >
          <AnimatePresence initial={false}>
            {toasts.map((t) => {
              const Icon = icons[t.variant] || CheckCircle2;
              return (
                <motion.div
                  key={t.id}
                  layout
                  role="status"
                  initial={{ opacity: 0, y: -16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-2 shadow-lift"
                >
                  {t.image ? (
                    <img src={t.image} alt="" width="48" height="48" className="h-12 w-12 shrink-0 rounded-xl bg-cream-alt object-cover" />
                  ) : (
                    <Icon size={22} aria-hidden="true" className={t.variant === 'info' ? 'text-ink-muted' : 'text-eco'} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">{t.title}</p>
                    {t.description && <p className="line-clamp-1 text-xs text-ink-muted">{t.description}</p>}
                  </div>
                  {t.action && (
                    <button
                      type="button"
                      onClick={() => {
                        t.action.onClick();
                        dismiss(t.id);
                      }}
                      className="min-h-[44px] shrink-0 rounded-xl px-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary-light"
                    >
                      {t.action.label}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    aria-label={tr('common.close')}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-200 hover:bg-cream-alt"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
