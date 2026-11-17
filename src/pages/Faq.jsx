import { Phone } from 'lucide-react';
import shop from '../config/shop';
import useEnquiry from '../hooks/useEnquiry';
import faqs from '../data/faqs';
import useLanguage from '../hooks/useLanguage';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { Reveal } from '../components/ui/Reveal';

/** FAQ (/faq): accordion + FAQPage structured data for Google + contact CTA. */
export default function Faq() {
  const { t, localize } = useLanguage();
  const { openEnquiry } = useEnquiry();

  const items = faqs.map((f) => ({ id: f.id, title: localize(f, 'question'), content: <p className="leading-relaxed">{localize(f, 'answer')}</p> }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: localize(f, 'question'),
      acceptedAnswer: { '@type': 'Answer', text: localize(f, 'answer') },
    })),
  };

  return (
    <>
      <Seo page="faq" path="/faq">
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Seo>
      <PageHeader title={t('faq.title')} subtitle={t('faq.subtitle')} breadcrumbs={[{ label: t('nav.faq') }]} />

      <section className="container-page max-w-3xl py-10 md:py-16">
        <Reveal>
          <Accordion items={items} defaultOpen={faqs[0].id} headingLevel={2} />
        </Reveal>

        <Reveal className="mt-10 rounded-3xl bg-cream-alt p-6 text-center md:p-8">
          <h2 className="text-2xl">{t('faq.stillQuestions')}</h2>
          <p className="mt-2 text-ink-muted">{t('faq.stillText')}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => openEnquiry()} variant="whatsapp" icon={WhatsAppIcon}>
              {t('faq.askWhatsApp')}
            </Button>
            <Button href={`tel:${shop.phones[0].tel}`} variant="secondary" icon={Phone} className="tabular-nums">
              {shop.phones[0].display}
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
