import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/** Returns the `toast(options)` function. Must be used inside <ToastProvider>. */
export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast() must be used inside <ToastProvider>.');
  return ctx.toast;
}
