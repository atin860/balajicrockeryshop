import { createContext, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import shop from '../config/shop';
import { getDesign } from '../data/designs';
import useLanguage from '../hooks/useLanguage';
import useToast from '../hooks/useToast';
import { cartReducer, cartSummary, getProduct, lineKey, loadCart, resolveDesign, saveCart } from '../utils/cart';

/**
 * CartContext
 * -----------
 * Holds the cart (product + design + quantity per line), saves it to localStorage,
 * keeps it in sync across browser tabs, and controls the slide-in cart drawer.
 *
 *   const { items, summary, addItem, updateQuantity, changeDesign, removeItem,
 *           clearCart, isDrawerOpen, openDrawer, closeDrawer } = useCart();
 *
 * `items` are enriched with `product` and `design` objects for easy rendering.
 */
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { t, localize } = useLanguage();
  const toast = useToast();
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({ items: loadCart() }));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const fromOtherTab = useRef(false);

  // Save on every change (skip when the change came from another tab, to avoid loops).
  useEffect(() => {
    if (fromOtherTab.current) {
      fromOtherTab.current = false;
      return;
    }
    saveCart(state.items);
  }, [state.items]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== shop.storageKeys.cart) return;
      try {
        fromOtherTab.current = true;
        dispatch({ type: 'HYDRATE', items: event.newValue ? JSON.parse(event.newValue).items : [] });
      } catch {
        fromOtherTab.current = false;
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const items = useMemo(
    () =>
      state.items.map((item) => ({
        ...item,
        product: getProduct(item.productId),
        design: getDesign(item.designId),
      })),
    [state.items],
  );

  const summary = useMemo(() => cartSummary(state.items), [state.items]);

  /** Add a product. Shows a toast with a "View cart" shortcut unless `silent`. */
  const addItem = useCallback(
    (productId, { designId, quantity, silent = false } = {}) => {
      const product = getProduct(productId);
      if (!product) return;
      dispatch({ type: 'ADD', productId, designId, quantity });
      if (!silent) {
        const design = getDesign(resolveDesign(product, designId));
        toast({
          title: t('product.addedToast', { name: localize(product, 'name') }),
          description: [design ? localize(design, 'name') : null, quantity ? t('common.packets', { count: quantity }) : null]
            .filter(Boolean)
            .join(' · '),
          image: product.images[0],
          action: { label: t('product.viewCart'), onClick: () => setDrawerOpen(true) },
        });
      }
    },
    [toast, t, localize],
  );

  const updateQuantity = useCallback((key, quantity) => dispatch({ type: 'SET_QUANTITY', key, quantity }), []);

  const changeDesign = useCallback((key, designId) => dispatch({ type: 'CHANGE_DESIGN', key, designId }), []);

  /** Remove a line, with an "Undo" toast. */
  const removeItem = useCallback(
    (key) => {
      const index = state.items.findIndex((i) => i.key === key);
      if (index === -1) return;
      const item = state.items[index];
      dispatch({ type: 'REMOVE', key });
      toast({
        title: t('cart.removedToast', { name: localize(getProduct(item.productId), 'name') }),
        variant: 'info',
        action: { label: t('cart.undo'), onClick: () => dispatch({ type: 'RESTORE', item, index }) },
        duration: 5000,
      });
    },
    [state.items, toast, t, localize],
  );

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  /** Quantity already in the cart for a product (optionally a specific design). */
  const getQuantity = useCallback(
    (productId, designId) => {
      const product = getProduct(productId);
      if (designId !== undefined) {
        const key = lineKey(productId, resolveDesign(product, designId));
        return state.items.find((i) => i.key === key)?.quantity || 0;
      }
      return state.items.filter((i) => i.productId === productId).reduce((sum, i) => sum + i.quantity, 0);
    },
    [state.items],
  );

  const value = useMemo(
    () => ({
      items,
      summary,
      addItem,
      updateQuantity,
      changeDesign,
      removeItem,
      clearCart,
      getQuantity,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, summary, addItem, updateQuantity, changeDesign, removeItem, clearCart, getQuantity, isDrawerOpen, openDrawer, closeDrawer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
