import { Phone, ClipboardList } from 'lucide-react';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';
import Button from '../ui/Button';
import { Reveal } from '../ui/Reveal';

/** Big red banner inviting caterers and big events to request a bulk quote. */
export default function BulkCta() {
  const { t } = useLanguage();

  return (
    <section className="container-page py-8 md:py-12" aria-labelledby="bulk-cta-title">
      <Reveal className="relative isolate overflow-hidden rounded-3xl bg-[#8E1B1B] px-6 py-12 text-white shadow-lift sm:px-10 md:px-14 md:py-16">
        <img
          src="/images/banners/bulk-order.webp"
          alt=""
          aria-hidden="true"
          width="1600"
          height="500"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-90"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#8E1B1B] via-[#8E1B1B]/90 to-[#8E1B1B]/20" aria-hidden="true" />
        <div className="max-w-xl">
          <h2 id="bulk-cta-title" className="text-3xl text-white md:text-4xl">
            {t('home.bulkCtaTitle')}
          </h2>
          <p className="mt-4 text-base text-white/85 md:text-lg">{t('home.bulkCtaText')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/bulk-order" variant="light" size="lg" icon={ClipboardList}>
              {t('home.bulkCtaButton')}
            </Button>
            <Button href={`tel:${shop.phones[0].tel}`} variant="outlineLight" size="lg" icon={Phone} className="tabular-nums">
              {shop.phones[0].display}
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
