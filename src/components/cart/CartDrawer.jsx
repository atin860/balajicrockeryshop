import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, ShoppingBag } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useLanguage from '../../hooks/useLanguage';
import { formatNumber } from '../../utils/format';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import CartItem from './CartItem';

/**
 * Slide-in cart (from the right) with backdrop. Opened by the navbar cart icon
 * or the "View cart" button in the add-to-cart toast.
 */
export default function CartDrawer() {
  const { t } = useLanguage();
  const { items, summary, isDrawerOpen, closeDrawer } = useCart();
  const empty = items.length === 0;

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={closeDrawer}
      title={
        <span className="flex items-baseline gap-2">
          {t('cart.drawerTitle')}
          {!empty && <span className="text-sm font-normal text-ink-muted">({t('cart.items', { count: summary.lines })})</span>}
        </span>
      }
      footer={
        !empty && (
          <div className="space-y-3">
            <dl className="flex items-center justify-between text-sm">
              <dt className="text-ink-muted">{t('cart.totalPackets')}</dt>
              <dd className="font-heading text-lg font-bold tabular-nums text-ink">{formatNumber(summary.quantity)}</dd>
            </dl>
            <p className="flex gap-2 rounded-xl bg-accent-light px-3 py-2 text-xs text-[#6B4500]">
              <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              {t('cart.ratesNote')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button to="/cart" variant="secondary" onClick={closeDrawer}>
                {t('cart.viewCart')}
              </Button>
              <Button to="/checkout" iconRight={ArrowRight} onClick={closeDrawer}>
                {t('nav.checkout')}
              </Button>
            </div>
          </div>
        )
      }
    >
      {empty ? (
        <div className="flex h-full flex-col items-center justify-center py-12 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-alt text-accent-dark">
            <ShoppingBag size={34} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-xl">{t('cart.emptyTitle')}</h3>
          <p className="mt-2 max-w-xs text-sm text-ink-muted">{t('cart.emptyText')}</p>
          <Button to="/products" className="mt-6" onClick={closeDrawer}>
            {t('cart.continueShopping')}
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartItem key={item.key} item={item} onNavigate={closeDrawer} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  );
}
