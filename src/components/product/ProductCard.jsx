import { Link } from 'react-router-dom';
import { Leaf, MessageCircle, ShoppingCart, Sparkles } from 'lucide-react';
import shop from '../../config/shop';
import useEnquiry from '../../hooks/useEnquiry';
import { getDesign } from '../../data/designs';
import useLanguage from '../../hooks/useLanguage';
import useCart from '../../hooks/useCart';
import ImageWithFallback from '../ui/ImageWithFallback';
import Badge from '../ui/Badge';
import { DesignSwatch } from './DesignPicker';

/**
 * ProductCard — image-led card (no prices).
 * - Image zooms on hover and cross-fades to the second photo.
 * - The action button slides up on hover (always visible on touch screens):
 *   "Enquire" (opens the WhatsApp enquiry form for this product) while ordering
 *   is on hold, or "Add to Cart" when shop.features.ordering is true.
 * - Design swatches preview the available designs.
 */
export default function ProductCard({ product, priority = false, className = '' }) {
  const { t, localize } = useLanguage();
  const { addItem } = useCart();
  const { openEnquiry } = useEnquiry();
  const name = localize(product, 'name');
  const url = `/product/${product.slug}`;
  const designs = product.designs.map(getDesign).filter(Boolean);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-shadow duration-300 ease-out hover:shadow-card ${className}`}
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-white">
        <Link to={url} aria-label={name} className="block">
          <ImageWithFallback
            src={product.images[0]}
            alt={t('product.imageAlt', { name, number: 1 })}
            width={800}
            height={800}
            aspect="1 / 1"
            priority={priority}
            category={product.category}
            label={name}
            imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Second photo fades in on hover (desktop) */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 ease-out [@media(hover:hover)]:group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <Badge variant="solid" icon={Sparkles}>
              {t('common.new')}
            </Badge>
          )}
          {product.isEcoFriendly && (
            <Badge variant="eco" icon={Leaf}>
              {t('common.ecoFriendly')}
            </Badge>
          )}
          {!product.inStock && <Badge variant="dark">{t('common.outOfStock')}</Badge>}
        </div>

        {/* Action button — slides up on hover, always shown on touch devices */}
        <div className="absolute inset-x-3 bottom-3 transition-transform duration-300 ease-out [@media(hover:hover)]:translate-y-[140%] [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0">
          {!shop.features.ordering ? (
            <button
              type="button"
              onClick={() =>
                openEnquiry({
                  subject: `${name} (${localize(product, 'unit')})`,
                  message: t('product.enquiryMessage', { item: name }),
                })
              }
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-ink/90 px-3 text-sm font-semibold text-white shadow-card backdrop-blur-sm transition-colors duration-200 hover:bg-whatsapp-deep"
              aria-label={`${t('common.enquire')}: ${name}`}
            >
              <MessageCircle size={16} aria-hidden="true" />
              {t('common.enquire')}
            </button>
          ) : (
          // ORDERING ON HOLD: quick add to cart (only when ordering is switched on)
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => addItem(product.id, { designId: product.designs[0], quantity: product.minQty })}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-ink/90 px-3 text-sm font-semibold text-white shadow-card backdrop-blur-sm transition-colors duration-200 hover:bg-primary disabled:cursor-not-allowed disabled:bg-ink/50"
            aria-label={`${t('common.addToCart')}: ${name}`}
          >
            <ShoppingCart size={16} aria-hidden="true" />
            {product.inStock ? t('common.addToCart') : t('common.outOfStock')}
          </button>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-heading text-[15px] font-semibold leading-snug md:text-base">
          <Link to={url} className="line-clamp-2 transition-colors duration-200 hover:text-primary">
            {name}
          </Link>
        </h3>
        <p className="text-sm text-ink-muted">
          {localize(product, 'size')} · {localize(product, 'unit')}
        </p>
        {designs.length > 0 && (
          <div className="mt-auto flex items-center gap-1.5 pt-2" aria-label={t('product.designCount', { count: designs.length })}>
            {designs.slice(0, 4).map((d) => (
              <DesignSwatch key={d.id} design={d} size="xs" />
            ))}
            <span className="ml-1 text-xs text-ink-muted">{t('product.designCount', { count: designs.length })}</span>
          </div>
        )}
      </div>
    </article>
  );
}
