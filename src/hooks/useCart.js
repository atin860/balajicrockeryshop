import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/** Access the cart. Must be used inside <CartProvider> (set up in main.jsx). */
export default function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart() must be used inside <CartProvider>.');
  return ctx;
}
