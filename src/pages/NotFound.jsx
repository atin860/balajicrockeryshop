import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import Seo from '../components/ui/Seo';
import Button from '../components/ui/Button';

/** 404 page. */
export default function NotFound() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  return (
    <>
      <Seo page="notFound" path={pathname} noindex />
      <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {/* Empty plate illustration */}
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-white to-[#D9DDE2] shadow-lift md:h-56 md:w-56">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#E9ECEF] to-[#C7CCD2] md:h-40 md:w-40">
              <span className="font-heading text-4xl font-bold text-ink/70 md:text-5xl">404</span>
            </div>
          </div>
          <motion.span
            className="absolute -right-2 top-4 h-8 w-8 rounded-full bg-accent"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t('notFound.title')}</p>
        <h1 className="mt-3 max-w-xl text-3xl md:text-4xl">{t('notFound.heading')}</h1>
        <p className="mt-3 max-w-md text-ink-muted">{t('notFound.text')}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/" icon={Home}>
            {t('common.goHome')}
          </Button>
          <Button to="/products" variant="secondary" icon={ShoppingBag}>
            {t('notFound.browse')}
          </Button>
        </div>
      </section>
    </>
  );
}
