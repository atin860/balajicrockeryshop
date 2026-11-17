import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gallery from '../../data/gallery';
import useLanguage from '../../hooks/useLanguage';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import ImageWithFallback from '../ui/ImageWithFallback';
import { RevealGroup, RevealItem } from '../ui/Reveal';

/** First 6 gallery photos in a masonry layout + "View Gallery". */
const preview = gallery.slice(0, 6);

export default function GalleryPreview() {
  const { t, localize } = useLanguage();

  return (
    <section className="section" aria-labelledby="gallery-preview-title">
      <div className="container-page">
        <SectionTitle id="gallery-preview-title" title={t('home.galleryTitle')} subtitle={t('home.gallerySubtitle')} />
        <RevealGroup as="ul" className="columns-2 gap-3 sm:gap-4 md:columns-3">
          {preview.map((photo) => (
            <RevealItem as="li" key={photo.id} className="mb-3 break-inside-avoid sm:mb-4">
              <Link to="/gallery" className="group relative block overflow-hidden rounded-2xl shadow-soft">
                <ImageWithFallback
                  src={photo.src}
                  alt="" /* the caption below names the link — avoids repeating it */
                  width={photo.width}
                  height={photo.height}
                  aspect={`${photo.width} / ${photo.height}`}
                  label={localize(photo, 'title')}
                  imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/70 to-transparent p-3 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {localize(photo, 'title')}
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-8 text-center">
          <Button to="/gallery" variant="secondary" iconRight={ArrowRight}>
            {t('home.viewGallery')}
          </Button>
        </div>
      </div>
    </section>
  );
}
