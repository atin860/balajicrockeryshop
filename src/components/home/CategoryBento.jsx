import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import categories from '../../data/categories';
import products from '../../data/products';
import useLanguage from '../../hooks/useLanguage';
import SectionTitle from '../ui/SectionTitle';
import ImageWithFallback from '../ui/ImageWithFallback';
import { getCategoryIcon } from '../ui/categoryIcons';
import { RevealGroup, RevealItem } from '../ui/Reveal';

/**
 * "Shop by Category" bento grid.
 * Desktop (4 columns): first tile 2×2, last tile (party packs) 2 wide.
 * Phone (2 columns): first and last tiles full width.
 */
const counts = products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {});

function tileClass(index, total) {
  if (index === 0) return 'col-span-2 row-span-2';
  if (index === total - 1) return 'col-span-2';
  return '';
}

export default function CategoryBento() {
  const { t, localize } = useLanguage();

  return (
    <section className="section bg-cream-alt" aria-labelledby="categories-title">
      <div className="container-page">
        <SectionTitle id="categories-title" title={t('home.categoriesTitle')} subtitle={t('home.categoriesSubtitle')} />
        <RevealGroup as="ul" className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {categories.map((cat, i) => {
            const Icon = getCategoryIcon(cat.id);
            const big = i === 0;
            const to = cat.id === 'combo' ? '/party-packs' : `/products/${cat.id}`;
            return (
              <RevealItem as="li" key={cat.id} className={tileClass(i, categories.length)}>
                <Link
                  to={to}
                  className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-shadow duration-300 hover:shadow-card"
                >
                  <ImageWithFallback
                    src={cat.image}
                    alt={localize(cat, 'imageAlt')}
                    width={600}
                    height={600}
                    category={cat.id}
                    label={localize(cat, 'name')}
                    className="!absolute inset-0 h-full w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" aria-hidden="true" />
                  <div className="relative flex items-end justify-between gap-3 p-4 md:p-5">
                    <div className="min-w-0">
                      <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-accent-dark shadow-soft">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <h3 className={`font-heading font-semibold leading-tight ${big ? 'text-2xl md:text-3xl' : 'text-base md:text-lg'}`}>
                        {localize(cat, 'name')}
                      </h3>
                      <p className="mt-0.5 text-xs text-ink-muted md:text-sm">{t('home.productsInCategory', { count: counts[cat.id] || 0 })}</p>
                      {big && <p className="mt-2 hidden max-w-xs text-sm text-ink-muted md:block">{localize(cat, 'description')}</p>}
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-primary">
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
