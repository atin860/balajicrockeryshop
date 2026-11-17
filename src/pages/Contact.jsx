import { useRef, useState } from 'react';
import { CheckCircle2, Clock, MapPin, Navigation, Phone } from 'lucide-react';
import shop, { directionsUrl, mapEmbedUrl } from '../config/shop';
import useEnquiry from '../hooks/useEnquiry';
import useLanguage from '../hooks/useLanguage';
import useToast from '../hooks/useToast';
import { validate } from '../utils/validation';
import { buildContactMessage, openWhatsApp } from '../utils/whatsapp';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal';
import { TextAreaField, TextField } from '../components/ui/FormField';

/** Contact (/contact): info cards, contact form → WhatsApp, Google Map + directions. */
const SCHEMA = { name: ['required', 'name'], mobile: ['required', 'mobile'], message: ['required'] };
const FIELD_ORDER = Object.keys(SCHEMA);

function InfoCard({ icon: Icon, tint, title, children }) {
  return (
    <RevealItem className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft">
      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg">{title}</h2>
      <div className="mt-1 flex-1 text-sm text-ink-muted">{children}</div>
    </RevealItem>
  );
}

export default function Contact() {
  const { t, lang, pick } = useLanguage();
  const { openEnquiry } = useEnquiry();
  const toast = useToast();
  const [values, setValues] = useState({ name: '', mobile: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const refs = useRef({});

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
      if (!values[name] && !errors[name]) return;
      setErrors((errs) => ({ ...errs, [name]: validate(values, { [name]: SCHEMA[name] })[name] }));
    },
  });

  const submit = (e) => {
    e.preventDefault();
    const result = validate(values, SCHEMA);
    setErrors(result);
    const first = FIELD_ORDER.find((f) => result[f]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    openWhatsApp(buildContactMessage(values, { lang }));
    setSent(true);
    toast({ title: t('contact.sentToast') });
  };

  return (
    <>
      <Seo page="contact" path="/contact" image="/images/about/shop-front.webp" />
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} breadcrumbs={[{ label: t('nav.contact') }]} />

      <section className="container-page py-10 md:py-14">
        {/* Info cards */}
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={WhatsAppIcon} tint="bg-eco-light text-whatsapp-deep" title={t('contact.whatsappCard')}>
            <p>{t('contact.whatsappText')}</p>
            <Button onClick={() => openEnquiry()} variant="whatsapp" size="sm" className="mt-3" icon={WhatsAppIcon}>
              {t('contact.chatNow')}
            </Button>
          </InfoCard>
          <InfoCard icon={Phone} tint="bg-primary-light text-primary" title={t('contact.phoneCard')}>
            <ul>
              {shop.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="inline-flex min-h-[40px] items-center text-base font-semibold tabular-nums text-ink hover:text-primary">
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard icon={MapPin} tint="bg-accent-light text-accent-dark" title={t('contact.addressCard')}>
            <address className="not-italic leading-relaxed text-ink">{pick(shop.address)}</address>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 font-semibold text-primary hover:underline">
              <Navigation size={14} aria-hidden="true" />
              {t('contact.getDirections')}
            </a>
          </InfoCard>
          <InfoCard icon={Clock} tint="bg-eco-light text-eco" title={t('contact.hoursCard')}>
            <p className="text-base font-semibold text-ink">{pick(shop.hours)}</p>
            <p className="mt-1">{t('contact.openDaily')}</p>
          </InfoCard>
        </RevealGroup>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Reveal>
            <form noValidate onSubmit={submit} className="h-full rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8" aria-labelledby="contact-form-title">
              <h2 id="contact-form-title" className="text-2xl">
                {t('contact.formTitle')}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{t('contact.formText')}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <TextField label={t('contact.name')} required autoComplete="name" {...field('name')} />
                <TextField label={t('contact.mobile')} required type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} hint={t('checkout.mobileHint')} {...field('mobile')} />
                <TextAreaField label={t('contact.message')} required rows={5} placeholder={t('contact.messagePlaceholder')} className="sm:col-span-2" {...field('message')} />
              </div>
              <Button type="submit" variant="whatsapp" size="lg" fullWidth icon={WhatsAppIcon} className="mt-6">
                {t('contact.submit')}
              </Button>
              {sent && (
                <p role="status" className="mt-3 flex items-center justify-center gap-2 text-sm text-eco">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {t('bulk.sentNote')}
                </p>
              )}
            </form>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.1} className="flex flex-col">
            <h2 className="mb-4 text-2xl">{t('contact.mapTitle')}</h2>
            <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-3xl border border-line bg-cream-alt shadow-card">
              <iframe
                title={t('contact.mapLabel')}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <Button href={directionsUrl} icon={Navigation} variant="secondary" className="mt-4 self-start">
              {t('contact.getDirections')}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
