import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';

/**
 * PageHeader — banner with page title, subtitle and breadcrumb (every page except Home).
 *
 *   <PageHeader
 *     title="All Products"
 *     subtitle="…"
 *     breadcrumbs={[{ label: 'Products', to: '/products' }, { label: 'Dona' }]}
 *   />
 * "Home" is added automatically as the first breadcrumb. The last item is the current page.
 * Also outputs BreadcrumbList structured data for Google.
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  image = '/images/banners/page-header.webp',
  compact = false, // smaller banner (product page), title shown as a label instead of the page <h1>
  children,
}) {
  const TitleTag = compact ? motion.p : motion.h1;
  const { t } = useLanguage();
  const trail = [{ label: t('common.home'), to: '/' }, ...breadcrumbs];
  const base = shop.siteUrl.replace(/\/$/, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${base}${item.to}` } : {}),
    })),
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-cream-alt">
      {/* Decorative banner image, faded so text stays readable */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        width="1600"
        height="500"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cream via-cream/90 to-cream/40" aria-hidden="true" />

      <div className={`container-page ${compact ? 'py-5 md:py-7' : 'py-10 md:py-16'}`}>
        <nav aria-label={t('nav.breadcrumb')}>
          <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
            {trail.map((item, i) => {
              const isLast = i === trail.length - 1;
              return (
                <li key={`${item.label}-${i}`} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={14} aria-hidden="true" className="text-ink-muted/60" />}
                  {isLast || !item.to ? (
                    <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium text-ink' : ''}>
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.to}
                      className="inline-flex min-h-[32px] items-center gap-1 rounded-md transition-colors duration-200 hover:text-primary"
                    >
                      {i === 0 && <Home size={14} aria-hidden="true" />}
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Slide only (no fade): the title is often the page's largest text, and starting
            it invisible would delay "Largest Contentful Paint" for speed scores. */}
        <TitleTag
          className={compact ? 'mt-2 font-heading text-lg font-semibold text-ink-muted' : 'mt-4 text-3xl md:text-5xl'}
          initial={{ y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </TitleTag>
        {subtitle && (
          <motion.p
            className="mt-3 max-w-2xl text-base text-ink-muted md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
    </section>
  );
}
