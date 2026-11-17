import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Home, ShoppingBag, PackageSearch } from 'lucide-react';
import shop from '../config/shop';
import useLanguage from '../hooks/useLanguage';
import { loadLastOrder } from '../utils/orderStorage';
import { openWhatsApp } from '../utils/whatsapp';
import { formatDate, formatNumber, formatTime } from '../utils/format';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { Reveal } from '../components/ui/Reveal';

/**
 * Order Success (/order-success): order ID, summary, "send again" if WhatsApp
 * didn't open, and what happens next. Reads the last order saved by Checkout.
 */
export default function OrderSuccess() {
  const { t, localize } = useLanguage();
  const [order] = useState(loadLastOrder);

  if (!order) {
    return (
      <>
        <Seo page="orderSuccess" path="/order-success" noindex />
        <PageHeader title={t('orderSuccess.noOrderTitle')} breadcrumbs={[{ label: t('orderSuccess.title') }]} />
        <section className="container-page flex flex-col items-center py-16 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-alt text-accent-dark">
            <PackageSearch size={34} aria-hidden="true" />
          </span>
          <p className="mt-5 max-w-sm text-lg text-ink">{t('orderSuccess.noOrderText')}</p>
          <Button to="/products" className="mt-6">
            {t('notFound.browse')}
          </Button>
        </section>
      </>
    );
  }

  const date = new Date(order.date);
  const packets = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Seo page="orderSuccess" path="/order-success" noindex />
      <section className="container-page max-w-3xl py-12 md:py-16">
        {/* Animated tick */}
        <div className="flex flex-col items-center text-center">
          <motion.span
            className="flex h-24 w-24 items-center justify-center rounded-full bg-eco text-white shadow-lift"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            aria-hidden="true"
          >
            <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 0.3 }}>
              <Check size={48} strokeWidth={3} />
            </motion.span>
          </motion.span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-eco">{t('orderSuccess.title')}</p>
          <h1 className="mt-2 text-3xl md:text-4xl">{t('orderSuccess.heading', { name: order.name })}</h1>
          <p className="mt-3 max-w-xl text-ink-muted">{t('orderSuccess.text')}</p>
        </div>

        {/* Order card */}
        <Reveal className="mt-10 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <dl className="grid grid-cols-2 gap-4 border-b border-line bg-cream-alt p-5 sm:grid-cols-3 md:p-6">
            <div>
              <dt className="text-xs text-ink-muted">{t('orderSuccess.orderId')}</dt>
              <dd className="mt-0.5 font-heading font-bold tabular-nums text-ink">{order.orderId}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">{t('orderSuccess.date')}</dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-ink">
                {formatDate(date)}, {formatTime(date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">{t('orderSuccess.deliveryMethod')}</dt>
              <dd className="mt-0.5 font-semibold text-ink">{order.delivery === 'pickup' ? t('checkout.storePickup') : t('checkout.homeDelivery')}</dd>
            </div>
          </dl>
          <div className="p-5 md:p-6">
            <h2 className="text-lg">{t('orderSuccess.summary')}</h2>
            <ul className="mt-3 divide-y divide-line">
              {order.items.map((item) => (
                <li key={`${item.slug}-${item.designEn}`} className="flex items-center gap-3 py-3">
                  <ImageWithFallback src={item.image} alt="" width={800} height={800} aspect="1 / 1" category={item.category} label="" className="w-12 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{localize(item, 'name')}</p>
                    <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                      {item.swatch && <span className="inline-block h-3.5 w-3.5 rounded-full border border-black/10" style={{ background: item.swatch }} aria-hidden="true" />}
                      {item.designEn ? `${localize(item, 'design')} · ` : ''}
                      {localize(item, 'unit')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">× {formatNumber(item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 flex justify-between border-t border-line pt-4 text-sm">
              <span className="text-ink-muted">{t('cart.totalPackets')}</span>
              <span className="font-heading text-xl font-bold tabular-nums">{formatNumber(packets)}</span>
            </p>
          </div>
        </Reveal>

        {/* Send again */}
        <Reveal className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line bg-white p-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-ink">{t('orderSuccess.notOpened')}</p>
          <Button variant="whatsapp" icon={WhatsAppIcon} onClick={() => openWhatsApp(order.message)}>
            {t('orderSuccess.sendAgain')}
          </Button>
        </Reveal>

        {/* Next steps */}
        <Reveal className="mt-10">
          <h2 className="text-center text-xl">{t('orderSuccess.nextTitle')}</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {t('orderSuccess.nextSteps').map((step, i) => (
              <li key={step} className="rounded-2xl bg-cream-alt p-4 text-sm text-ink">
                <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white font-heading font-bold text-primary shadow-soft">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/" variant="secondary" icon={Home}>
            {t('common.goHome')}
          </Button>
          <Button to="/products" icon={ShoppingBag}>
            {t('cart.continueShopping')}
          </Button>
        </div>
        <p className="mt-8 text-center text-sm text-ink-muted">
          {shop.phones.map((p, i) => (
            <span key={p.tel}>
              {i > 0 && ' · '}
              <a href={`tel:${p.tel}`} className="font-semibold tabular-nums text-primary hover:underline">
                {p.display}
              </a>
            </span>
          ))}
        </p>
      </section>
    </>
  );
}
