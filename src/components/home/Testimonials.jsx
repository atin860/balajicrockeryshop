import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import testimonials from '../../data/testimonials';
import useLanguage from '../../hooks/useLanguage';
import SectionTitle from '../ui/SectionTitle';

/** Customer reviews slider: auto-advances (paused on hover/focus), swipe on phones, arrows + dots. */
const INTERVAL = 7000;

export default function Testimonials() {
  const { t, localize } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [[index, direction], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta) => {
    setState(([i]) => [(i + delta + testimonials.length) % testimonials.length, delta]);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const timer = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, reduceMotion, go]);

  const review = testimonials[index];

  return (
    <section className="section bg-cream-alt" aria-labelledby="testimonials-title">
      <div className="container-page">
        <SectionTitle id="testimonials-title" title={t('home.testimonialsTitle')} subtitle={t('home.testimonialsSubtitle')} />

        <div
          className="relative mx-auto max-w-3xl"
          aria-roledescription="carousel"
          aria-label={t('home.testimonialsTitle')}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="relative min-h-[300px] overflow-hidden sm:min-h-[260px]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.figure
                key={review.id}
                custom={direction}
                variants={{
                  enter: (d) => ({ opacity: 0, x: d * 60 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d) => ({ opacity: 0, x: d * -60 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) go(1);
                  else if (info.offset.x > 50) go(-1);
                }}
                aria-roledescription="slide"
                aria-label={t('common.slideOf', { current: index + 1, total: testimonials.length })}
                className="cursor-grab rounded-3xl border border-line bg-white p-6 text-center shadow-card active:cursor-grabbing sm:p-10"
              >
                <Quote size={36} aria-hidden="true" className="mx-auto text-accent" />
                <div className="mt-3 flex justify-center gap-1" role="img" aria-label={`${review.rating}/5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} aria-hidden="true" className={i < review.rating ? 'fill-accent text-accent' : 'text-line'} />
                  ))}
                </div>
                <blockquote className="mt-4 text-base leading-relaxed text-ink sm:text-lg">“{localize(review, 'text')}”</blockquote>
                <figcaption className="mt-6">
                  <span className="block font-heading font-semibold text-ink">{localize(review, 'name')}</span>
                  <span className="text-sm text-ink-muted">
                    {localize(review, 'place')} · {localize(review, 'event')}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t('common.previous')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition-colors duration-200 hover:bg-cream"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <div className="flex">
              {testimonials.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={t('common.goToSlide', { number: i + 1 })}
                  aria-current={i === index ? 'true' : undefined}
                  className="group inline-flex h-11 w-7 items-center justify-center"
                >
                  <span className={`block h-2 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-primary' : 'w-2 bg-ink/20 group-hover:bg-ink/40'}`} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t('common.next')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft transition-colors duration-200 hover:bg-cream"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
