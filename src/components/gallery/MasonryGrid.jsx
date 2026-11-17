import { AnimatePresence, motion } from 'framer-motion';
import { Expand } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import ImageWithFallback from '../ui/ImageWithFallback';

/**
 * Masonry photo grid (CSS columns: 2 / 3 / 4) with hover zoom.
 * Each photo is a button that opens the lightbox.
 */
export default function MasonryGrid({ items, onOpen }) {
  const { t } = useLanguage();

  return (
    <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
      <AnimatePresence initial={false}>
        {items.map((photo, i) => (
          <motion.li
            key={photo.id}
            className="mb-3 break-inside-avoid sm:mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: Math.min(i, 8) * 0.04 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <button
              type="button"
              onClick={() => onOpen(i)}
              aria-label={t('gallery.openImage', { title: photo.title })}
              className="group relative block w-full overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-card"
            >
              <ImageWithFallback
                src={photo.src}
                alt=""
                width={photo.width}
                height={photo.height}
                aspect={`${photo.width} / ${photo.height}`}
                label={photo.title}
                imgClassName="transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-left text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.title}
                <Expand size={16} aria-hidden="true" className="shrink-0" />
              </span>
            </button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
