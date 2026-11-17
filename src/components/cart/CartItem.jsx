import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Trash2 } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useLanguage from '../../hooks/useLanguage';
import shop from '../../config/shop';
import ImageWithFallback from '../ui/ImageWithFallback';
import QuantitySelector from '../ui/QuantitySelector';
import DesignPicker, { DesignSwatch } from '../product/DesignPicker';

/**
 * One cart line: photo, name, size · unit, chosen design (changeable) and quantity.
 * No prices — rates are shared on WhatsApp.
 */
export default function CartItem({ item, onNavigate }) {
  const { t, localize } = useLanguage();
  const { updateQuantity, changeDesign, removeItem } = useCart();
  const [editingDesign, setEditingDesign] = useState(false);
  const { product, design } = item;
  const name = localize(product, 'name');

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3 rounded-2xl border border-line bg-white p-3"
    >
      <Link to={`/product/${product.slug}`} onClick={onNavigate} className="shrink-0 self-start" tabIndex={-1} aria-hidden="true">
        <ImageWithFallback
          src={product.images[0]}
          alt=""
          width={800}
          height={800}
          aspect="1 / 1"
          category={product.category}
          label={name}
          className="w-20 rounded-xl sm:w-24"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/product/${product.slug}`}
              onClick={onNavigate}
              className="line-clamp-2 font-heading text-[15px] font-semibold leading-snug text-ink transition-colors duration-200 hover:text-primary"
            >
              {name}
            </Link>
            <p className="mt-0.5 text-xs text-ink-muted">
              {localize(product, 'size')} · {localize(product, 'unit')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            aria-label={t('cart.removeItem', { name })}
            className="-mr-1 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-200 hover:bg-primary-light hover:text-primary"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>

        {design && (
          <div className="mt-2">
            {product.designs.length > 1 ? (
              <button
                type="button"
                onClick={() => setEditingDesign((v) => !v)}
                aria-expanded={editingDesign}
                aria-label={t('cart.changeDesign', { name })}
                className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-line bg-cream px-2.5 text-xs font-medium text-ink transition-colors duration-200 hover:border-accent"
              >
                <DesignSwatch design={design} size="xs" />
                {localize(design, 'name')}
                <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${editingDesign ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
                <DesignSwatch design={design} size="xs" />
                {localize(design, 'name')}
              </span>
            )}
            {editingDesign && (
              <DesignPicker
                size="sm"
                className="mt-3"
                designIds={product.designs}
                value={item.designId}
                onChange={(id) => {
                  changeDesign(item.key, id);
                  setEditingDesign(false);
                }}
              />
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            min={product.minQty}
            max={shop.maxQtyPerItem}
            onChange={(q) => updateQuantity(item.key, q)}
            label={`${t('common.quantity')} – ${name}`}
          />
          <span className="text-xs text-ink-muted">{localize(product, 'unit')}</span>
        </div>
      </div>
    </motion.li>
  );
}
