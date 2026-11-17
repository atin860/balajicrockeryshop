import { BadgePercent, HeartHandshake, Truck, Warehouse } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import SectionTitle from '../ui/SectionTitle';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { RevealGroup, RevealItem } from '../ui/Reveal';

/** Five reasons to buy here — text comes from home.whyItems in the i18n files (same order as these icons). */
const ICONS = [BadgePercent, Warehouse, Truck, WhatsAppIcon, HeartHandshake];
const TINTS = ['bg-primary-light text-primary', 'bg-accent-light text-accent-dark', 'bg-eco-light text-eco', 'bg-eco-light text-whatsapp-deep', 'bg-primary-light text-primary'];

export default function WhyChooseUs() {
  const { t } = useLanguage();
  const items = t('home.whyItems');

  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container-page">
        <SectionTitle id="why-title" title={t('home.whyTitle')} subtitle={t('home.whySubtitle')} />
        <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <RevealItem
                as="li"
                key={item.title}
                className={`rounded-2xl border border-line bg-white p-6 shadow-soft transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-card ${
                  i === items.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${TINTS[i]}`}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{item.text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
