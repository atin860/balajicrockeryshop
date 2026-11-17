import { useMemo, useState } from 'react';
import gallery from '../data/gallery';
import useLanguage from '../hooks/useLanguage';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import MasonryGrid from '../components/gallery/MasonryGrid';
import Lightbox from '../components/gallery/Lightbox';

/** Gallery (/gallery): filter tabs + masonry grid + lightbox. */
const TABS = ['all', 'products', 'events', 'shop'];

export default function Gallery() {
  const { t, localize } = useLanguage();
  const [tab, setTab] = useState('all');
  const [openIndex, setOpenIndex] = useState(null);

  const items = useMemo(
    () => gallery.filter((p) => tab === 'all' || p.category === tab).map((p) => ({ ...p, title: localize(p, 'title') })),
    [tab, localize],
  );
  const count = (id) => (id === 'all' ? gallery.length : gallery.filter((p) => p.category === id).length);

  return (
    <>
      <Seo page="gallery" path="/gallery" image={gallery[0].src} />
      <PageHeader title={t('gallery.title')} subtitle={t('gallery.subtitle')} breadcrumbs={[{ label: t('nav.gallery') }]} />

      <section className="container-page py-8 md:py-12">
        <div role="group" aria-label={t('gallery.filterLabel')} className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0">
          {TABS.map((id) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setTab(id)}
                className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors duration-200 ${
                  active ? 'border-primary bg-primary text-white shadow-soft' : 'border-line bg-white text-ink hover:border-ink/30'
                }`}
              >
                {t(`gallery.tabs.${id}`)}
                <span className={`rounded-full px-1.5 text-xs ${active ? 'bg-primary-dark' : 'bg-cream-alt text-ink-muted'}`}>{count(id)}</span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {t('gallery.photos', { count: items.length })}
        </p>
        <MasonryGrid items={items} onOpen={setOpenIndex} />
      </section>

      <Lightbox items={items} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  );
}
