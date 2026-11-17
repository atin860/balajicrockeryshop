import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';

/**
 * Carousel — lightweight horizontal slider using native scroll-snap
 * (smooth touch swiping on phones, no extra library).
 * Prev/next buttons scroll one "page"; they disable at the ends.
 *
 *   <Carousel label="Best sellers" itemClassName="w-[75%] sm:w-[45%] lg:w-[23.5%]">{cards}</Carousel>
 */
export default function Carousel({ label, children, itemClassName = 'w-[78%] sm:w-[46%] lg:w-[calc(25%-12px)]', className = '' }) {
  const { t } = useLanguage();
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    el?.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el?.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollByPage = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' });
  };

  const navBtn =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition-[opacity,background-color] duration-200 hover:bg-cream-alt disabled:cursor-default disabled:opacity-40';

  return (
    <section aria-roledescription="carousel" aria-label={label} className={className}>
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" className={navBtn} onClick={() => scrollByPage(-1)} disabled={edges.start} aria-label={t('common.previous')}>
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button type="button" className={navBtn} onClick={() => scrollByPage(1)} disabled={edges.end} aria-label={t('common.next')}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {Children.map(children, (child) => (
          <li className={`shrink-0 snap-start ${itemClassName}`}>{child}</li>
        ))}
      </ul>
    </section>
  );
}
