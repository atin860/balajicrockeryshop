import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import ImageWithFallback from '../ui/ImageWithFallback';
import Badge from '../ui/Badge';

/**
 * Product photo gallery with thumbnails and zoom.
 * - Desktop: hover the photo to zoom 2× following the mouse.
 * - Phone/tablet: tap to zoom in/out at the tapped point; swipe to change photo.
 */
export default function ProductGallery({ images, name, category, badges }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  const pointFrom = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const show = (i) => {
    setActive((i + images.length) % images.length);
    setZoom((z) => ({ ...z, on: false }));
  };

  return (
    <div className="lg:sticky lg:top-28">
      <div
        className="relative cursor-zoom-in overflow-hidden rounded-3xl border border-line bg-white shadow-soft"
        onPointerMove={(e) => e.pointerType === 'mouse' && setZoom({ on: true, ...pointFrom(e) })}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setZoom((z) => ({ ...z, on: false }))}
        onClick={(e) => {
          // Touch devices: tap toggles zoom at the tapped point.
          if (window.matchMedia('(hover: none)').matches) setZoom((z) => ({ on: !z.on, ...pointFrom(e) }));
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            drag={zoom.on ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) show(active + 1);
              else if (info.offset.x > 50) show(active - 1);
            }}
          >
            <ImageWithFallback
              src={images[active]}
              alt={t('product.imageAlt', { name, number: active + 1 })}
              width={800}
              height={800}
              aspect="1 / 1"
              priority={active === 0}
              category={category}
              label={name}
              draggable="false"
              imgClassName="transition-transform duration-200 ease-out will-change-transform"
              style={{
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transform: zoom.on ? 'scale(2)' : 'scale(1)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {badges && <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-1.5">{badges}</div>}
        <Badge variant="dark" icon={ZoomIn} className="pointer-events-none absolute bottom-4 right-4">
          {t('product.zoomHint')}
        </Badge>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3" role="group" aria-label={name}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => show(i)}
              aria-label={t('product.showImage', { number: i + 1 })}
              aria-pressed={i === active}
              className={`w-20 overflow-hidden rounded-2xl border-2 bg-white transition-colors duration-200 sm:w-24 ${
                i === active ? 'border-primary' : 'border-line hover:border-ink/30'
              }`}
            >
              <ImageWithFallback src={src} alt="" width={800} height={800} aspect="1 / 1" category={category} label="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
