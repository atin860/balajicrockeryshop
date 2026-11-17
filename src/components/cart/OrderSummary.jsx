import { Info } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import { formatNumber } from '../../utils/format';
import ImageWithFallback from '../ui/ImageWithFallback';
import { DesignSwatch } from '../product/DesignPicker';

/**
 * Compact order summary (no prices): each item with design × quantity,
 * then number of products and total packets. Used on Checkout.
 * `items` = cart items enriched with { product, design, quantity }.
 */
export default function OrderSummary({ items, children }) {
  const { t, localize } = useLanguage();
  const packets = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card md:p-6">
      <h2 className="text-xl">{t('checkout.summaryTitle')}</h2>
      <ul className="mt-4 max-h-[340px] divide-y divide-line overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-3 py-3">
            <ImageWithFallback
              src={item.product.images[0]}
              alt=""
              width={800}
              height={800}
              aspect="1 / 1"
              category={item.product.category}
              label=""
              className="w-12 shrink-0 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{localize(item.product, 'name')}</p>
              <p className="flex items-center gap-1.5 truncate text-xs text-ink-muted">
                {item.design && <DesignSwatch design={item.design} size="xs" />}
                {item.design ? `${localize(item.design, 'name')} · ` : ''}
                {localize(item.product, 'unit')}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">× {formatNumber(item.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-muted">{t('cart.totalItems')}</dt>
          <dd className="font-semibold tabular-nums text-ink">{formatNumber(items.length)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-ink-muted">{t('cart.totalPackets')}</dt>
          <dd className="font-heading text-2xl font-bold tabular-nums text-ink">{formatNumber(packets)}</dd>
        </div>
      </dl>
      <p className="mt-4 flex gap-2 rounded-xl bg-accent-light px-3 py-2 text-xs text-[#6B4500]">
        <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
        {t('cart.ratesNote')}
      </p>
      {children}
    </div>
  );
}
