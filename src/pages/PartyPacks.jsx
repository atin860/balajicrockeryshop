import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, Phone, RotateCcw, ShoppingCart, Users } from 'lucide-react';
import { GUEST_PRESETS, MAX_GUESTS, MIN_GUESTS, PACK_SLOTS, SET_STYLES } from '../data/partyPacks';
import { getProductBySlug } from '../data/products';
import { getDesign } from '../data/designs';
import shop from '../config/shop';
import useLanguage from '../hooks/useLanguage';
import useCart from '../hooks/useCart';
import useToast from '../hooks/useToast';
import useEnquiry from '../hooks/useEnquiry';
import { applyStyle, buildPackItems, clampGuests, createPackState } from '../utils/partyPack';
import { buildOrderMessage, generateOrderId, openWhatsApp } from '../utils/whatsapp';
import { formatNumber } from '../utils/format';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import QuantitySelector from '../components/ui/QuantitySelector';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { Reveal } from '../components/ui/Reveal';
import DesignPicker, { DesignSwatch } from '../components/product/DesignPicker';

/**
 * Party Packs (/party-packs): pick guests + set style, adjust each item, then
 * enquire about the pack on WhatsApp (form) or call. No prices.
 * When shop.features.ordering is true (ORDERING ON HOLD for now) the buttons
 * instead add the pack to the cart / order it directly on WhatsApp.
 * Supports ?guests=250 (used by the Home page pack cards).
 */
function Step({ number, title, children }) {
  return (
    <Reveal as="section" className="rounded-3xl border border-line bg-white p-5 shadow-soft md:p-6" aria-labelledby={`step-${number}`}>
      <h2 id={`step-${number}`} className="mb-4 flex items-center gap-3 text-lg md:text-xl">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{number}</span>
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

export default function PartyPacks() {
  const { t, lang, localize } = useLanguage();
  const { addItem, openDrawer } = useCart();
  const toast = useToast();
  const { openEnquiry } = useEnquiry();
  const ordering = shop.features.ordering;
  const callHref = `tel:${shop.phones[0].tel}`;
  const [params] = useSearchParams();
  const [pack, setPack] = useState(() => createPackState('silver-set', Number(params.get('guests')) || 100));
  const [guestDraft, setGuestDraft] = useState(String(pack.guests));

  const items = useMemo(() => buildPackItems(pack), [pack]);

  // Lift the floating WhatsApp button above the sticky pack bar on phones/tablets.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const apply = () => document.body.style.setProperty('--wa-offset', mq.matches ? '76px' : '0px');
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.body.style.setProperty('--wa-offset', '0px');
    };
  }, []);
  const totalPackets = items.reduce((sum, i) => sum + i.quantity, 0);

  const setGuests = (value) => {
    const guests = clampGuests(value);
    setGuestDraft(String(guests));
    // New guest count → recalculate every quantity.
    setPack((p) => ({
      ...p,
      guests,
      slots: Object.fromEntries(Object.entries(p.slots).map(([id, s]) => [id, { ...s, quantity: null }])),
    }));
  };

  const updateSlot = (slotId, patch) =>
    setPack((p) => ({ ...p, slots: { ...p.slots, [slotId]: { ...p.slots[slotId], ...patch } } }));

  const chooseProduct = (slotId, productId) =>
    updateSlot(slotId, { productId, designId: getProductBySlug(productId)?.designs[0] ?? null, quantity: null });

  const addPackToCart = () => {
    items.forEach((i) => addItem(i.product.id, { designId: i.design?.id, quantity: i.quantity, silent: true }));
    toast({
      title: t('partyPacks.packAddedTitle', { count: pack.guests }),
      description: t('cart.summary', { items: items.length, packets: formatNumber(totalPackets) }),
      action: { label: t('product.viewCart'), onClick: openDrawer },
    });
  };

  // Enquiry while ordering is on hold: the form opens with the whole pack written out.
  const enquirePack = () =>
    openEnquiry({
      subject: t('partyPacks.customLabel', { count: pack.guests }),
      message: [
        t('partyPacks.enquiryIntro', { count: pack.guests }),
        ...items.map(
          (i) =>
            `• ${localize(i.product, 'name')}${i.design ? ` (${localize(i.design, 'name')})` : ''} — ${i.quantity} × ${localize(i.product, 'unit')}`,
        ),
      ].join('\n'),
    });

  const orderPack = () =>
    openWhatsApp(
      buildOrderMessage({
        items,
        event: { guests: String(pack.guests) },
        notes: t('partyPacks.customLabel', { count: pack.guests }),
        orderId: generateOrderId(),
        lang,
      }),
    );

  return (
    <>
      <Seo page="partyPacks" path="/party-packs" image="/images/categories/combo.webp" />
      <PageHeader title={t('partyPacks.title')} subtitle={t('partyPacks.subtitle')} breadcrumbs={[{ label: t('nav.partyPacks') }]} />

      <section className="container-page py-8 md:py-12">
        {/* How it works */}
        <ol className="mb-8 grid gap-3 sm:grid-cols-3">
          {t('partyPacks.howSteps').map((step, i) => (
            <li key={step} className="flex items-center gap-3 rounded-2xl bg-cream-alt px-4 py-3 text-sm text-ink">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-heading font-bold text-primary shadow-soft">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            {/* 1. Guests */}
            <Step number={1} title={t('partyPacks.chooseGuests')}>
              <div role="radiogroup" aria-label={t('partyPacks.chooseGuests')} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {GUEST_PRESETS.map((g) => {
                  const active = pack.guests === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setGuests(g)}
                      className={`flex min-h-[88px] flex-col items-center justify-center rounded-2xl border-2 transition-colors duration-200 ${
                        active ? 'border-primary bg-primary-light text-primary' : 'border-line bg-white text-ink hover:border-ink/30'
                      }`}
                    >
                      <span className="font-heading text-3xl font-bold">{g}</span>
                      <span className="text-xs">{t('partyPacks.guests', { count: g }).replace(String(g), '').trim()}</span>
                    </button>
                  );
                })}
              </div>
              <label className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
                <Users size={18} aria-hidden="true" className="text-primary" />
                {t('partyPacks.customGuests')}
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  value={guestDraft}
                  onChange={(e) => setGuestDraft(e.target.value)}
                  onBlur={() => setGuests(guestDraft)}
                  onKeyDown={(e) => e.key === 'Enter' && setGuests(guestDraft)}
                  className="h-11 w-28 rounded-xl border border-line bg-white px-3 text-base font-semibold text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </label>
            </Step>

            {/* 2. Set style */}
            <Step number={2} title={t('partyPacks.setStyle')}>
              <div role="radiogroup" aria-label={t('partyPacks.setStyle')} className="grid gap-3 sm:grid-cols-3">
                {Object.keys(SET_STYLES).map((style) => {
                  const design = getDesign(style);
                  const active = pack.style === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPack((p) => applyStyle(p, style))}
                      className={`flex min-h-[64px] items-center gap-3 rounded-2xl border-2 px-4 text-left transition-colors duration-200 ${
                        active ? 'border-primary bg-primary-light' : 'border-line bg-white hover:border-ink/30'
                      }`}
                    >
                      <DesignSwatch design={design} size="md" />
                      <span className="flex-1 font-semibold text-ink">{localize(design, 'name')}</span>
                      {active && <Check size={18} aria-hidden="true" className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </Step>

            {/* 3. Customize items */}
            <Step number={3} title={t('partyPacks.customize')}>
              <ul className="space-y-4">
                {PACK_SLOTS.map((slot) => {
                  const state = pack.slots[slot.id];
                  const item = items.find((i) => i.slotId === slot.id);
                  const product = getProductBySlug(state.productId);
                  const slotName = t(`partyPacks.slots.${slot.id}`);
                  return (
                    <li key={slot.id} className={`rounded-2xl border p-4 transition-colors duration-200 ${state.included ? 'border-line bg-cream' : 'border-dashed border-line bg-white'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="flex items-center gap-2 text-base">
                          {slotName}
                          {!slot.included && <span className="rounded-full bg-cream-alt px-2 py-0.5 text-xs font-normal text-ink-muted">{t('partyPacks.optionalItem')}</span>}
                        </h3>
                        {/* Include / exclude switch */}
                        <label className="relative inline-flex min-h-[44px] cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={state.included}
                            onChange={(e) => updateSlot(slot.id, { included: e.target.checked })}
                            aria-label={t('partyPacks.includeItem', { name: slotName })}
                          />
                          <span className="h-7 w-12 rounded-full bg-line transition-colors duration-200 peer-checked:bg-eco peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2" />
                          <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow-soft transition-transform duration-200 peer-checked:translate-x-5" />
                        </label>
                      </div>

                      {state.included && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }} className="overflow-hidden">
                          {/* Product options */}
                          <div role="radiogroup" aria-label={`${slotName} – ${t('partyPacks.product')}`} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {slot.options.map((slug) => {
                              const option = getProductBySlug(slug);
                              if (!option) return null;
                              const active = state.productId === slug;
                              return (
                                <button
                                  key={slug}
                                  type="button"
                                  role="radio"
                                  aria-checked={active}
                                  onClick={() => chooseProduct(slot.id, slug)}
                                  className={`flex min-h-[56px] items-center gap-3 rounded-xl border p-2 pr-3 text-left transition-colors duration-200 ${
                                    active ? 'border-primary bg-white shadow-soft' : 'border-line bg-white/60 hover:border-ink/30'
                                  }`}
                                >
                                  <ImageWithFallback src={option.images[0]} alt="" width={800} height={800} aspect="1 / 1" category={option.category} label="" className="w-10 shrink-0 rounded-lg" />
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold text-ink">{localize(option, 'name')}</span>
                                    <span className="block text-xs text-ink-muted">{localize(option, 'unit')}</span>
                                  </span>
                                  {active && <Check size={16} aria-hidden="true" className="shrink-0 text-primary" />}
                                </button>
                              );
                            })}
                          </div>

                          {product?.designs.length > 0 && (
                            <DesignPicker size="sm" className="mt-4" designIds={product.designs} value={state.designId} onChange={(designId) => updateSlot(slot.id, { designId })} />
                          )}

                          {item && (
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <QuantitySelector
                                size="sm"
                                value={item.quantity}
                                min={1}
                                max={shop.maxQtyPerItem}
                                onChange={(q) => updateSlot(slot.id, { quantity: q })}
                                label={`${t('common.quantity')} – ${slotName}`}
                              />
                              <span className="text-sm text-ink-muted">
                                {localize(product, 'unit')} · {t('partyPacks.calculated', { guests: formatNumber(pack.guests) })}
                              </span>
                              {item.quantity !== item.calculated && (
                                <button
                                  type="button"
                                  onClick={() => updateSlot(slot.id, { quantity: null })}
                                  className="inline-flex min-h-[36px] items-center gap-1 text-sm font-semibold text-primary hover:underline"
                                >
                                  <RotateCcw size={14} aria-hidden="true" />
                                  {t('partyPacks.resetQty', { count: item.calculated })}
                                </button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Step>
          </div>

          {/* Summary (sticky on desktop) */}
          <aside className="lg:sticky lg:top-28" aria-labelledby="pack-summary-title">
            <div className="rounded-3xl border border-line bg-white p-5 shadow-card md:p-6">
              <h2 id="pack-summary-title" className="flex items-center gap-2 text-xl">
                <Package size={22} aria-hidden="true" className="text-primary" />
                {t('partyPacks.summaryTitle')}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                {t('partyPacks.forGuests', { count: formatNumber(pack.guests) })} · {localize(getDesign(pack.style), 'name')}
              </p>

              {items.length > 0 ? (
                <ul className="mt-4 divide-y divide-line" aria-live="polite">
                  {items.map((i) => (
                    <li key={i.slotId} className="flex items-start justify-between gap-3 py-3 text-sm">
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{localize(i.product, 'name')}</span>
                        {i.design && (
                          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                            <DesignSwatch design={i.design} size="xs" />
                            {localize(i.design, 'name')}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-ink">× {formatNumber(i.quantity)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-xl bg-cream-alt p-3 text-sm text-ink-muted">{t('partyPacks.emptyPack')}</p>
              )}

              <dl className="mt-2 flex items-center justify-between border-t border-line pt-4">
                <dt className="text-sm text-ink-muted">{t('cart.totalPackets')}</dt>
                <dd className="font-heading text-2xl font-bold tabular-nums text-ink">{formatNumber(totalPackets)}</dd>
              </dl>

              <div className="mt-5 space-y-3">
                {ordering ? (
                  /* ORDERING ON HOLD — shown only when ordering is switched on */
                  <>
                    <Button fullWidth size="lg" icon={ShoppingCart} onClick={addPackToCart} disabled={items.length === 0}>
                      {t('partyPacks.addPack')}
                    </Button>
                    <Button fullWidth variant="whatsapp" icon={WhatsAppIcon} onClick={orderPack} disabled={items.length === 0}>
                      {t('partyPacks.orderWhatsApp')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button fullWidth size="lg" variant="whatsapp" icon={WhatsAppIcon} onClick={enquirePack} disabled={items.length === 0}>
                      {t('partyPacks.enquirePack')}
                    </Button>
                    <Button fullWidth href={callHref} icon={Phone} className="tabular-nums" aria-label={`${t('common.callNow')}: ${shop.phones[0].display}`}>
                      {shop.phones[0].display}
                    </Button>
                  </>
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-muted">{t('partyPacks.packNote')}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Phone/tablet: sticky bar so the pack can be added without scrolling to the summary */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-12px_rgba(31,31,31,0.18)] backdrop-blur-md lg:hidden">
        <div className="container-page flex h-[68px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{t('partyPacks.forGuests', { count: formatNumber(pack.guests) })}</p>
            <p className="text-xs text-ink-muted">{t('cart.summary', { items: items.length, packets: formatNumber(totalPackets) })}</p>
          </div>
          <button
            type="button"
            onClick={ordering ? orderPack : enquirePack}
            disabled={items.length === 0}
            aria-label={ordering ? t('partyPacks.orderWhatsApp') : t('partyPacks.enquirePack')}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-whatsapp-deep text-white transition-colors duration-200 hover:bg-whatsapp-deeper disabled:opacity-50"
          >
            <WhatsAppIcon size={22} />
          </button>
          {ordering ? (
            <button
              type="button"
              onClick={addPackToCart}
              disabled={items.length === 0}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:opacity-50"
            >
              <ShoppingCart size={16} aria-hidden="true" />
              {t('partyPacks.addPack')}
            </button>
          ) : (
            <a
              href={callHref}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            >
              <Phone size={16} aria-hidden="true" />
              {t('common.callNow')}
            </a>
          )}
        </div>
      </div>
      {/* Space so the footer isn't hidden behind the sticky bar */}
      <div className="h-[68px] lg:hidden" aria-hidden="true" />
    </>
  );
}
