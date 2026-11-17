import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Phone } from 'lucide-react';
import shop from '../config/shop';
import EVENT_TYPES from '../data/eventTypes';
import useLanguage from '../hooks/useLanguage';
import useToast from '../hooks/useToast';
import { validate, todayISO } from '../utils/validation';
import { buildBulkMessage, openWhatsApp } from '../utils/whatsapp';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { Reveal } from '../components/ui/Reveal';
import { SelectField, TextAreaField, TextField } from '../components/ui/FormField';

/**
 * Bulk Order (/bulk-order): quotation form for caterers, tent houses and big events.
 * Sends a formatted message on WhatsApp. ?event=wedding pre-selects the event type
 * (used by the occasion tiles on the Home page).
 */
const SCHEMA = {
  name: ['required', 'name'],
  mobile: ['required', 'mobile'],
  eventDate: ['futureDate'],
  guests: ['guests'],
  items: ['required'],
};
const FIELD_ORDER = Object.keys(SCHEMA);

export default function BulkOrder() {
  const { t, lang } = useLanguage();
  const toast = useToast();
  const [params] = useSearchParams();
  const initialEvent = EVENT_TYPES.includes(params.get('event')) ? params.get('event') : '';
  const [values, setValues] = useState({ name: '', mobile: '', eventType: initialEvent, eventDate: '', guests: '', items: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const refs = useRef({});

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };
  // Re-check a field when the visitor leaves it (only if it already had an error or has a value).
  const check = (field) => () => {
    if (!SCHEMA[field] || (!values[field] && !errors[field])) return;
    const result = validate(values, { [field]: SCHEMA[field] });
    setErrors((errs) => ({ ...errs, [field]: result[field] }));
  };

  const submit = (event) => {
    event.preventDefault();
    const result = validate(values, SCHEMA);
    setErrors(result);
    const firstError = FIELD_ORDER.find((f) => result[f]);
    if (firstError) {
      refs.current[firstError]?.focus();
      return;
    }
    openWhatsApp(buildBulkMessage(values, { lang }));
    setSent(true);
    toast({ title: t('bulk.sentToast'), variant: 'success' });
  };

  const field = (name) => ({
    name,
    value: values[name],
    onChange: set(name),
    onBlur: check(name),
    error: errors[name],
    ref: (el) => (refs.current[name] = el),
  });

  return (
    <>
      <Seo page="bulkOrder" path="/bulk-order" image="/images/banners/bulk-order.webp" />
      <PageHeader title={t('bulk.title')} subtitle={t('bulk.subtitle')} breadcrumbs={[{ label: t('nav.bulkOrder') }]} image="/images/banners/bulk-order.webp" />

      <section className="container-page py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Info */}
          <Reveal>
            <h2 className="text-2xl md:text-3xl">{t('bulk.introTitle')}</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">{t('bulk.introText')}</p>

            <h3 className="mt-8 text-lg">{t('bulk.whoTitle')}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t('bulk.who').map((who) => (
                <li key={who} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink">
                  {who}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-lg">{t('bulk.benefitsTitle')}</h3>
            <ul className="mt-3 space-y-2.5">
              {t('bulk.benefits').map((b) => (
                <li key={b} className="flex gap-2.5 text-ink">
                  <CheckCircle2 size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-eco" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-cream-alt p-5">
              <p className="font-medium text-ink">{t('bulk.callInstead')}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {shop.phones.map((p) => (
                  <Button key={p.tel} href={`tel:${p.tel}`} variant="secondary" size="sm" icon={Phone} className="tabular-nums">
                    {p.display}
                  </Button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form noValidate onSubmit={submit} className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8" aria-labelledby="bulk-form-title">
              <h2 id="bulk-form-title" className="text-2xl">
                {t('bulk.formTitle')}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{t('bulk.requiredNote')}</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <TextField label={t('bulk.name')} required autoComplete="name" {...field('name')} />
                <TextField
                  label={t('bulk.mobile')}
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={14}
                  hint={t('checkout.mobileHint')}
                  {...field('mobile')}
                />
                <SelectField label={t('bulk.eventType')} {...field('eventType')}>
                  <option value="">{t('selectEventType')}</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`eventTypes.${type}`)}
                    </option>
                  ))}
                </SelectField>
                <TextField label={t('bulk.eventDate')} type="date" min={todayISO()} {...field('eventDate')} />
                <TextField label={t('bulk.guests')} type="number" inputMode="numeric" min={1} max={100000} className="sm:col-span-2" {...field('guests')} />
                <TextAreaField
                  label={t('bulk.itemsNeeded')}
                  required
                  rows={5}
                  placeholder={t('bulk.itemsPlaceholder')}
                  className="sm:col-span-2"
                  {...field('items')}
                />
              </div>

              <Button type="submit" variant="whatsapp" size="lg" fullWidth icon={WhatsAppIcon} className="mt-6">
                {t('bulk.submit')}
              </Button>
              <p className={`mt-3 flex items-center justify-center gap-2 text-center text-sm ${sent ? 'text-eco' : 'text-ink-muted'}`} role="status">
                {sent && <CheckCircle2 size={16} aria-hidden="true" />}
                {t('bulk.sentNote')}
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
