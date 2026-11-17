import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Tag, X } from 'lucide-react';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';
import useToast from '../../hooks/useToast';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useFocusTrap from '../../hooks/useFocusTrap';
import { validate } from '../../utils/validation';
import { buildContactMessage, openWhatsApp } from '../../utils/whatsapp';
import { loadCustomer, saveCustomer } from '../../utils/orderStorage';
import Button from '../ui/Button';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { TextAreaField, TextField } from '../ui/FormField';

/**
 * WhatsApp enquiry form (pop-up). Bottom sheet on phones, centred dialog on
 * larger screens. Name and mobile are remembered on the device for next time.
 * Keyboard accessible: focus trapped inside, Escape closes, focus returns.
 */
const SCHEMA = { name: ['required', 'name'], mobile: ['required', 'mobile'], message: ['required'] };
const FIELD_ORDER = Object.keys(SCHEMA);

export default function EnquiryModal({ open, subject, initialMessage, onClose }) {
  const { t, lang } = useLanguage();
  const toast = useToast();
  const panelRef = useRef(null);
  const refs = useRef({});
  const titleId = useId();
  const [values, setValues] = useState({ name: '', mobile: '', message: '' });
  const [errors, setErrors] = useState({});

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, { onEscape: onClose });

  // Each time it opens: remembered name/mobile + the suggested message.
  useEffect(() => {
    if (!open) return;
    const saved = loadCustomer();
    setValues({ name: saved.name || '', mobile: saved.mobile || '', message: initialMessage || '' });
    setErrors({});
  }, [open, initialMessage]);

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
    openWhatsApp(buildContactMessage({ ...values, subject }, { lang }));
    saveCustomer({ ...loadCustomer(), name: values.name, mobile: values.mobile });
    toast({ title: t('enquiry.sentToast') });
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        // Plain wrapper + animated layers (same pattern as Drawer/Lightbox).
        <div key="enquiry" className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-cream shadow-lift focus:outline-none sm:max-w-lg sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-whatsapp text-white">
                  <WhatsAppIcon size={24} />
                </span>
                <div>
                  <h2 id={titleId} className="text-lg">
                    {t('enquiry.title')}
                  </h2>
                  <p className="text-xs text-ink-muted">{t('enquiry.text')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('common.close')}
                className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-cream-alt"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <form noValidate onSubmit={submit} className="space-y-4 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              {subject && (
                <p className="flex items-start gap-2 rounded-xl bg-accent-light px-3 py-2 text-sm text-[#6B4500]">
                  <Tag size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold">{t('enquiry.about')}:</span> {subject}
                  </span>
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={t('enquiry.name')} required autoComplete="name" {...field('name')} />
                <TextField
                  label={t('enquiry.mobile')}
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={14}
                  {...field('mobile')}
                />
              </div>
              <TextAreaField label={t('enquiry.message')} required rows={4} placeholder={t('enquiry.messagePlaceholder')} {...field('message')} />
              <Button type="submit" variant="whatsapp" size="lg" fullWidth icon={WhatsAppIcon}>
                {t('enquiry.submit')}
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-ink-muted">
                <span>{t('enquiry.orCall')}</span>
                {shop.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex min-h-[40px] items-center gap-1.5 font-semibold tabular-nums text-primary hover:underline">
                    <Phone size={14} aria-hidden="true" />
                    {p.display}
                  </a>
                ))}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
