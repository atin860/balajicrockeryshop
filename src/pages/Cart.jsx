import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Info, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useLanguage from '../hooks/useLanguage';
import { formatNumber } from '../utils/format';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import CartItem from '../components/cart/CartItem';

/** Cart page (/cart): every line with design + quantity, totals (no prices), checkout. */
export default function Cart() {
  const { t } = useLanguage();
  const { items, summary, clearCart } = useCart();
  const empty = items.length === 0;

  const confirmClear = () => {
    if (window.confirm(t('cart.confirmClear'))) clearCart();
  };

  return (
    <>
      <Seo page="cart" path="/cart" noindex />
      <PageHeader title={t('cart.title')} subtitle={empty ? undefined : t('cart.summary', { items: summary.lines, packets: formatNumber(summary.quantity) })} breadcrumbs={[{ label: t('nav.cart') }]} />

      <section className="container-page py-8 md:py-12">
        {empty ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-alt text-accent-dark">
              <ShoppingBag size={34} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl">{t('cart.emptyTitle')}</h2>
            <p className="mt-2 text-ink-muted">{t('cart.emptyText')}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button to="/products">{t('cart.continueShopping')}</Button>
              <Button to="/party-packs" variant="secondary">
                {t('nav.partyPacks')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItem key={item.key} item={item} />
                  ))}
                </AnimatePresence>
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Link to="/products" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink-muted hover:text-primary">
                  <ArrowLeft size={16} aria-hidden="true" />
                  {t('cart.continueShopping')}
                </Link>
                <button
                  type="button"
                  onClick={confirmClear}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-semibold text-ink-muted transition-colors duration-200 hover:bg-primary-light hover:text-primary"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  {t('cart.clearCart')}
                </button>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28" aria-labelledby="cart-summary-title">
              <div className="rounded-3xl border border-line bg-white p-5 shadow-card md:p-6">
                <h2 id="cart-summary-title" className="text-xl">
                  {t('cart.summaryTitle')}
                </h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">{t('cart.totalItems')}</dt>
                    <dd className="font-semibold tabular-nums">{formatNumber(summary.lines)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-line pt-3">
                    <dt className="text-ink-muted">{t('cart.totalPackets')}</dt>
                    <dd className="font-heading text-2xl font-bold tabular-nums text-ink">{formatNumber(summary.quantity)}</dd>
                  </div>
                </dl>
                <p className="mt-4 flex gap-2 rounded-xl bg-accent-light px-3 py-2 text-xs text-[#6B4500]">
                  <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
                  {t('cart.ratesNote')}
                </p>
                <Button to="/checkout" size="lg" fullWidth iconRight={ArrowRight} className="mt-5">
                  {t('cart.checkout')}
                </Button>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
