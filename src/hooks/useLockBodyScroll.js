import { useEffect } from 'react';

// Counts how many overlays are open so nested drawers don't unlock the page too early.
let lockCount = 0;
let savedOverflow = '';
let savedPadding = '';

/** Prevents the page behind a drawer / menu / lightbox from scrolling while `locked` is true. */
export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const { body, documentElement } = document;

    if (lockCount === 0) {
      // Compensate for the disappearing scrollbar so the layout doesn't jump on desktop.
      const scrollbar = window.innerWidth - documentElement.clientWidth;
      savedOverflow = body.style.overflow;
      savedPadding = body.style.paddingRight;
      body.style.overflow = 'hidden';
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.overflow = savedOverflow;
        body.style.paddingRight = savedPadding;
      }
    };
  }, [locked]);
}
