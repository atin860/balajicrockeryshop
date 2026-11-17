import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home, MapPin, PartyPopper, ShieldCheck, ShoppingBag, Store, User } from 'lucide-react';
import shop from '../config/shop';
import EVENT_TYPES from '../data/eventTypes';
import useCart from '../hooks/useCart';
import useLanguage from '../hooks/useLanguage';
import { validate, todayISO } from '../utils/validation';
import { buildOrderMessage, generateOrderId, openWhatsApp } from '../utils/whatsapp';
import { isMobileDevice } from '../utils/device';
import { loadCustomer, saveCustomer, saveLastOrder } from '../utils/orderStorage';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { SelectField, TextAreaField, TextField } from '../components/ui/FormField';
import OrderSummary from '../components/cart/OrderSummary';
import PageLoader from '../components/ui/PageLoader';

/**
 * Checkout (/checkout): customer details, delivery method, optional event details,
 * order summary and "Place Order on WhatsApp".
 *
 * Flow on submit: validate → build message with order ID → save order (for the
 * success page) → open WhatsApp → clear cart → /order-success.
 *  - Desktop: WhatsApp Web opens in a new tab straight from the click (pop-up safe).
 *  - Mobile: go to the success page first, then hand over to the WhatsApp app,
 *    so the success page is there when the customer comes back.
 */
const SCHEMA = {
  name: ['required', 'name'],
  mobile: ['required', 'mobile'],
  address: ['required'],
  village: ['required'],
  pincode: ['required', 'pincode'],
  eventDate: ['futureDate'],
  guests: ['guests'],
};
const FIELD_ORDER = Object.keys(SCHEMA);

function Card({ icon: Icon, title, optional, children }) {
  const { t } = useLanguage();
  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-soft md:p-6">
      <h2 className="mb-5 flex items-center gap-2.5 text-lg md:text-xl">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Icon size={18} aria-hidden="true" />
        </span>
        {title}
        {optional && <span className="text-sm font-normal text-ink-muted">({t('common.optional')})</span>}
      </h2>
      {children}
    </section>
  );
}

export default function Checkout() {
  const { t, lang, pick } = useLanguage();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const refs = useRef({});
  const [values, setValues] = useState(() => ({
    name: '',
    mobile: '',
    address: '',
    village: '',
    pincode: '',
    landmark: '',
    delivery: 'home',
    eventType: '',
    eventDate: '',
    guests: '',
    notes: '',
    ...loadCustomer(), // remembered from a previous order on this device
  }));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [placed, setPlaced] = useState(false); // order sent → avoid flashing the empty-cart view

  const field = (name) => ({
    name,
    value: values[name],
    error: errors[name],
    ref: (el) => (refs.current[name] = el),
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }));
      if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
    },
    onBlur: () => {
      if (!SCHEMA[name] || (!values[name] && !errors[name])) return;
      setErrors((errs) => ({ ...errs, [name]: validate(values, { [name]: SCHEMA[name] })[name] }));
    },
  });

  const placeOrder = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const result = validate(values, SCHEMA);
    setErrors(result);
    const first = FIELD_ORDER.find((f) => result[f]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }

    const date = new Date();
    const orderId = generateOrderId(date);
    const message = buildOrderMessage({
      items,
      customer: values,
      event: { type: values.eventType, date: values.eventDate, guests: values.guests },
      notes: values.notes,
      orderId,
      date,
      lang,
    });
    saveLastOrder({ orderId, date, customer: values, items, message });
    saveCustomer(values);

    const mobile = isMobileDevice();
    if (!mobile) openWhatsApp(message);
    setPlaced(true);
    clearCart();
    navigate('/order-success', { replace: true });
    if (mobile) setTimeout(() => openWhatsApp(message), 300);
  };

  if (placed) return <PageLoader />;

  if (items.length === 0) {
    return (
      <>
        <Seo page="checkout" path="/checkout" noindex />
        <PageHeader title={t('checkout.title')} breadcrumbs={[{ label: t('nav.cart'), to: '/cart' }, { label: t('nav.checkout') }]} />
        <section className="container-page py-16 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream-alt text-accent-dark">
            <ShoppingBag size={34} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className="mx-auto mt-5 max-w-sm text-lg text-ink">{t('checkout.emptyCart')}</p>
          <Button to="/products" className="mt-6">
            {t('cart.continueShopping')}
          </Button>
        </section>
      </>
    );
  }

  const hasErrors = submitted && Object.values(errors).some(Boolean);
  const deliveryOptions = [
    { id: 'home', icon: Home, title: t('checkout.homeDelivery'), text: t('checkout.homeDeliveryText') },
    { id: 'pickup', icon: Store, title: t('checkout.storePickup'), text: t('checkout.storePickupText') },
  ];

  return (
    <>
      <Seo page="checkout" path="/checkout" noindex />
      <PageHeader title={t('checkout.title')} subtitle={t('checkout.subtitle')} breadcrumbs={[{ label: t('nav.cart'), to: '/cart' }, { label: t('nav.checkout') }]} />

      <form noValidate onSubmit={placeOrder} className="container-page grid gap-6 py-8 md:py-12 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-8">
        <div className="space-y-6">
          {/* Customer details */}
          <Card icon={User} title={t('checkout.customerTitle')}>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label={t('checkout.fullName')} required autoComplete="name" {...field('name')} />
              <TextField
                label={t('checkout.mobile')}
                required
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={14}
                hint={t('checkout.mobileHint')}
                {...field('mobile')}
              />
              <TextField label={t('checkout.address')} required autoComplete="street-address" className="sm:col-span-2" {...field('address')} />
              <TextField label={t('checkout.village')} required autoComplete="address-level2" {...field('village')} />
              <TextField label={t('checkout.pincode')} required inputMode="numeric" autoComplete="postal-code" maxLength={6} {...field('pincode')} />
              <TextField label={t('checkout.landmark')} className="sm:col-span-2" {...field('landmark')} />
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
              <ShieldCheck size={14} aria-hidden="true" className="text-eco" />
              {t('checkout.savedNote')}
            </p>
          </Card>

          {/* Delivery method */}
          <Card icon={MapPin} title={t('checkout.deliveryTitle')}>
            <fieldset>
              <legend className="sr-only">{t('checkout.deliveryTitle')}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {deliveryOptions.map((opt) => {
                  const active = values.delivery === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                        active ? 'border-primary bg-primary-light/60' : 'border-line bg-white hover:border-ink/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.id}
                        checked={active}
                        onChange={() => setValues((v) => ({ ...v, delivery: opt.id }))}
                        className="mt-1 h-4 w-4 shrink-0 accent-primary"
                      />
                      <span>
                        <span className="flex items-center gap-2 font-semibold text-ink">
                          <opt.icon size={18} aria-hidden="true" className="text-primary" />
                          {opt.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-ink-muted">{opt.text}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <p className="mt-4 rounded-xl bg-cream-alt p-3 text-sm text-ink-muted">
              {values.delivery === 'pickup' ? (
                t('checkout.pickupFrom', { address: pick(shop.address) })
              ) : (
                <>
                  <strong className="font-semibold text-ink">{t('checkout.deliveryAreas')}:</strong> {pick(shop.delivery.areas)}
                </>
              )}
            </p>
          </Card>

          {/* Event details (optional) */}
          <Card icon={PartyPopper} title={t('checkout.eventTitle')} optional>
            <div className="grid gap-5 sm:grid-cols-3">
              <SelectField label={t('checkout.eventType')} {...field('eventType')}>
                <option value="">{t('selectEventType')}</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`eventTypes.${type}`)}
                  </option>
                ))}
              </SelectField>
              <TextField label={t('checkout.eventDate')} type="date" min={todayISO()} {...field('eventDate')} />
              <TextField label={t('checkout.guests')} type="number" inputMode="numeric" min={1} {...field('guests')} />
              <TextAreaField label={t('checkout.notes')} rows={3} placeholder={t('checkout.notesPlaceholder')} className="sm:col-span-3" {...field('notes')} />
            </div>
          </Card>
        </div>

        {/* Summary + place order */}
        <aside className="lg:sticky lg:top-28">
          <OrderSummary items={items}>
            {hasErrors && (
              <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-primary-light px-3 py-2 text-sm text-primary-dark">
                <AlertCircle size={16} aria-hidden="true" className="shrink-0" />
                {t('checkout.errors.fixErrors')}
              </p>
            )}
            <Button type="submit" variant="whatsapp" size="lg" fullWidth icon={WhatsAppIcon} className="mt-5">
              {t('checkout.placeOrder')}
            </Button>
            <p className="mt-3 text-center text-xs text-ink-muted">{t('checkout.whatsappNote')}</p>
            <p className="mt-2 text-center text-xs text-ink-muted">{t('checkout.paymentNote')}</p>
            <Link to="/cart" className="mt-4 flex min-h-[44px] items-center justify-center gap-2 text-sm font-semibold text-ink-muted hover:text-primary">
              <ArrowLeft size={16} aria-hidden="true" />
              {t('checkout.editCart')}
            </Link>
          </OrderSummary>
        </aside>
      </form>
    </>
  );
}
