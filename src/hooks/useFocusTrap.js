import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps keyboard focus inside `ref` while `active` (drawers, mobile menu, lightbox).
 * - Moves focus into the container on open (to `initialFocusRef` if given).
 * - Tab / Shift+Tab cycle within the container.
 * - Escape calls `onEscape`.
 * - Focus returns to the element that opened it when closed.
 */
export default function useFocusTrap(ref, active, { onEscape, initialFocusRef } = {}) {
  // Always call the latest onEscape without re-running the trap on every render.
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const container = ref.current;
    const previouslyFocused = document.activeElement;

    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Wait a frame so enter animations have mounted the content.
    const raf = window.requestAnimationFrame(() => {
      const target = initialFocusRef?.current || getFocusable()[0] || container;
      target.focus({ preventScroll: true });
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && escapeRef.current) {
        event.stopPropagation();
        escapeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      container.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
