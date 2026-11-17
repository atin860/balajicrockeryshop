import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { getProductsByCategory } from '../../data/products';
import { getDesign } from '../../data/designs';
import useLanguage from '../../hooks/useLanguage';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import ImageWithFallback from '../ui/ImageWithFallback';
import { DesignSwatch } from '../product/DesignPicker';
import { RevealGroup, RevealItem } from '../ui/Reveal';

/** Preview of the 4 party combo packs (50 / 100 / 250 / 500 guests). */
const packs = getProductsByCategory('combo');

export default function PartyPacksPreview() {
  const { t, localize, pick } = useLanguage();

  return (
    <section className="section bg-cream-alt" aria-labelledby="packs-title">
      <div className="container-page">
        <SectionTitle id="packs-title" title={t('home.packsTitle')} subtitle={t('home.packsSubtitle')} />
        <RevealGroup as="ul" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {packs.map((pack) => {
            const guests = pack.sizeEn.split(' ')[0];
            const featured = pack.isFeatured;
            return (
              <RevealItem as="li" key={pack.id}>
                <Link
                  to={`/party-packs?guests=${guests}`}
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-card ${
                    featured ? 'border-accent ring-2 ring-accent/30' : 'border-line'
                  }`}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={pack.images[0]}
                      alt={localize(pack, 'name')}
                      width={800}
                      height={800}
                      aspect="4 / 3"
                      category="combo"
                      label={localize(pack, 'name')}
                      imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-ink">{t('common.bestSeller')}</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="flex items-center gap-2 text-ink-muted">
                      <Users size={16} aria-hidden="true" className="text-primary" />
                      <span className="text-sm">{t('partyPacks.forGuests', { count: guests })}</span>
                    </p>
                    <p className="mt-1 font-heading text-3xl font-bold text-ink md:text-4xl">{guests}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{pick(pack.features[0])}</p>
                    <div className="mt-auto flex items-center gap-1.5 pt-3">
                      {pack.designs.map((id) => (
                        <DesignSwatch key={id} design={getDesign(id)} size="xs" />
                      ))}
                      <ArrowRight size={16} aria-hidden="true" className="ml-auto text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <div className="mt-8 text-center">
          <Button to="/party-packs" iconRight={ArrowRight}>
            {t('home.packsCta')}
          </Button>
        </div>
      </div>
    </section>
  );
}
