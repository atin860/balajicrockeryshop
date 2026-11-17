import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import shop from '../../config/shop';
import useEnquiry from '../../hooks/useEnquiry';
import useLanguage from '../../hooks/useLanguage';
import Button from '../ui/Button';
import WhatsAppIcon from '../ui/WhatsAppIcon';

/**
 * Home hero slider
 * - 3 slides, auto-advance every 6s (paused on hover/focus, by the pause button,
 *   or when the visitor prefers reduced motion)
 * - Background photo cross-fades with a slow zoom; headline fades in
 * - Round product photos float gently on the right (tablet/desktop)
 * - Swipe left/right on phones; arrows, dots and keyboard-accessible controls
 */
const SLIDES = [
  {
    image: '/images/hero/hero-1.webp',
    altEn: 'Elegant table setting with silver-coated disposable plates, dona and paper cups',
    altHi: 'सिल्वर कोटेड डिस्पोजल प्लेट, दोना और पेपर कप के साथ सुंदर टेबल सजावट',
    floats: ['silver-pattal-12-inch', 'silver-dona-medium', 'paper-tea-cup-150ml'],
  },
  {
    image: '/images/hero/hero-2.webp',
    altEn: 'Stacks of green leaf pattal and dona, eco-friendly look',
    altHi: 'हरे पत्तों की पत्तल और दोने के ढेर, इको-फ्रेंडली रूप',
    floats: ['sal-leaf-pattal', 'sal-leaf-dona', 'areca-leaf-plate'],
  },
  {
    image: '/images/hero/hero-3.webp',
    altEn: 'Wedding buffet setup with compartment thali and disposable glasses',
    altHi: 'खाने वाली थाली और डिस्पोजल गिलास के साथ शादी का बुफे',
    floats: ['thali-5-compartment', 'plastic-glass-200ml', 'silver-katori'],
  },
];

const INTERVAL = 6000;
const EASE_OUT = [0.22, 1, 0.36, 1];

// Position, size and float timing for the three round product photos.
const FLOAT_LAYOUT = [
  { className: 'right-[6%] top-[14%] h-56 w-56 xl:h-64 xl:w-64', duration: 6, delay: 0 },
  { className: 'right-[30%] top-[52%] h-36 w-36 xl:h-40 xl:w-40', duration: 7, delay: 0.6 },
  { className: 'right-[4%] bottom-[12%] h-28 w-28 xl:h-32 xl:w-32', duration: 5.5, delay: 1.2 },
];

export default function HeroSlider() {
  const { t, lang } = useLanguage();
  const { openEnquiry } = useEnquiry();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const slidesText = t('home.heroSlides');
  const paused = hovered || userPaused || reduceMotion;

  const go = useCallback((next) => setIndex((next + SLIDES.length) % SLIDES.length), []);

  // Auto-advance
  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, go]);

  const slide = SLIDES[index];
  const text = slidesText[index];

  return (
    <motion.section
      aria-roledescription="carousel"
      aria-label={t('home.heroLabel')}
      className="relative isolate overflow-hidden bg-cream-alt"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (info.offset.x < -60) go(index + 1);
        else if (info.offset.x > 60) go(index - 1);
      }}
    >
      {/* Background photos (cross-fade + slow zoom) */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.img
            src={slide.image}
            alt={lang === 'hi' ? slide.altHi : slide.altEn}
            width="1600"
            height="900"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchpriority={index === 0 ? 'high' : undefined}
            draggable="false"
            className="h-full w-full object-cover object-[70%_center]"
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 9, ease: 'easeOut' }}
          />
        </motion.div>
      </AnimatePresence>
      {/* Readability overlay */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-cream via-cream/90 to-cream/30 md:via-cream/75 md:to-transparent"
        aria-hidden="true"
      />

      <div className="container-page relative flex min-h-[540px] items-center pb-24 pt-12 md:min-h-[600px] md:py-16 lg:h-[calc(100svh-108px)] lg:max-h-[760px]">
        {/* Text */}
        <div
          className="relative z-10 max-w-xl lg:max-w-2xl"
          aria-roledescription="slide"
          aria-label={t('common.slideOf', { current: index + 1, total: SLIDES.length })}
          aria-live={paused ? 'polite' : 'off'}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
              }}
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } }}
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-soft backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {text.eyebrow}
              </motion.p>
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } } }}
                className="text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
              >
                {text.title}
              </motion.h1>
              <motion.p
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } }}
                className="mt-5 max-w-lg text-base text-ink-muted sm:text-lg"
              >
                {text.subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <p className="mt-3 font-hindi text-base font-medium text-ink/80">{shop.tagline.hi}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => openEnquiry()} variant="whatsapp" size="lg" icon={WhatsAppIcon}>
              {t('common.enquireWhatsApp')}
            </Button>
            <Button to="/products" variant="secondary" size="lg" iconRight={ArrowRight}>
              {t('common.viewProducts')}
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
            {t('home.heroBadges').map((badge) => (
              <li key={badge} className="inline-flex items-center gap-1.5">
                <Check size={16} aria-hidden="true" className="text-eco" />
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {/* Floating product photos (tablet & desktop) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            {slide.floats.map((slug, i) => {
              const layout = FLOAT_LAYOUT[i];
              return (
                <motion.div
                  key={`${index}-${slug}`}
                  className={`absolute ${layout.className}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 0.15 * i, ease: EASE_OUT }}
                >
                  <img
                    src={`/images/products/${slug}-1.webp`}
                    alt=""
                    width="800"
                    height="800"
                    loading="lazy"
                    draggable="false"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden';
                    }}
                    // CSS float (runs on the GPU; switched off by prefers-reduced-motion in index.css)
                    className="h-full w-full animate-float rounded-full border-[6px] border-white object-cover shadow-lift"
                    style={{ animationDuration: `${layout.duration}s`, animationDelay: `${layout.delay}s` }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="absolute bottom-5 left-0 right-0 z-10">
          <div className="container-page flex items-center justify-between gap-4">
            <div className="flex items-center" role="group" aria-label={t('home.heroLabel')}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={t('common.goToSlide', { number: i + 1 })}
                  aria-current={i === index ? 'true' : undefined}
                  className="group inline-flex h-11 w-8 items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ease-out ${
                      i === index ? 'w-6 bg-primary' : 'w-2 bg-ink/25 group-hover:bg-ink/50'
                    }`}
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? t('home.playSlider') : t('home.pauseSlider')}
                className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                {userPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              </button>
            </div>
            {/* Right margin keeps the arrows clear of the floating WhatsApp button */}
            <div className="hidden gap-2 sm:mr-16 sm:flex">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label={t('common.previous')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-soft backdrop-blur-sm transition-colors duration-200 hover:bg-white"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label={t('common.next')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-soft backdrop-blur-sm transition-colors duration-200 hover:bg-white"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
