import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import occasions from '../../data/occasions';
import useLanguage from '../../hooks/useLanguage';
import SectionTitle from '../ui/SectionTitle';
import ImageWithFallback from '../ui/ImageWithFallback';
import { RevealGroup, RevealItem } from '../ui/Reveal';

/** "For every occasion" — swipeable row on phones, 6-column grid on desktop. */
export default function OccasionsStrip() {
  const { t, localize } = useLanguage();

  return (
    <section className="section" aria-labelledby="occasions-title">
      <div className="container-page">
        <SectionTitle id="occasions-title" eyebrow={t('common.wholesaleRetail')} title={t('home.occasionsTitle')} subtitle={t('home.occasionsSubtitle')} />
        <RevealGroup
          as="ul"
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0"
        >
          {occasions.map((o) => (
            <RevealItem as="li" key={o.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-auto">
              <Link
                to={`/bulk-order?event=${o.id}`}
                className="group relative block overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-card"
              >
                <ImageWithFallback
                  src={o.image}
                  alt={localize(o, 'alt')}
                  width={800}
                  height={600}
                  aspect="4 / 5"
                  label={localize(o, 'name')}
                  imgClassName="transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-white">
                  <span>
                    <span className="block font-heading text-base font-semibold leading-tight">{localize(o, 'name')}</span>
                    <span className="text-xs text-white/80">{t('home.occasionCta')}</span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
