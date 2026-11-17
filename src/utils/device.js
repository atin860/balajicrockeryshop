/**
 * True on phones/tablets (touch-first devices). Used to decide how to open WhatsApp:
 * same tab on mobile (opens the WhatsApp app), new tab on desktop (WhatsApp Web).
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua)) return true;
  // iPadOS reports as Mac — detect touch support instead.
  return navigator.maxTouchPoints > 1 && /Macintosh/.test(ua);
}
