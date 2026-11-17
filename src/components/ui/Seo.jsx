import { Helmet } from 'react-helmet-async';
import shop from '../../config/shop';
import useLanguage from '../../hooks/useLanguage';

/**
 * Seo — per-page <title>, description, canonical link and Open Graph / Twitter tags.
 *
 *   <Seo page="home" path="/" />                               uses seo.home.* from i18n
 *   <Seo page="product" vars={{ name, unit… }} path="/product/x" image="/images/…" />
 *   <Seo title="Custom" description="…" path="/x" noindex />
 */
export default function Seo({ page, vars, title, description, path = '/', image, type = 'website', noindex = false, children }) {
  const { t, lang } = useLanguage();

  const finalTitle = title || (page ? t(`seo.${page}.title`, vars) : shop.name.en);
  const finalDescription = description || (page ? t(`seo.${page}.description`, vars) : '');
  const base = shop.siteUrl.replace(/\/$/, '');
  const url = `${base}${path}`;
  const imageUrl = `${base}${image || '/images/logo/og-image.jpg'}`;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      {finalDescription && <meta name="description" content={finalDescription} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:title" content={finalTitle} />
      {finalDescription && <meta property="og:description" content={finalDescription} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={lang === 'hi' ? 'hi_IN' : 'en_IN'} />

      <meta name="twitter:title" content={finalTitle} />
      {finalDescription && <meta name="twitter:description" content={finalDescription} />}
      <meta name="twitter:image" content={imageUrl} />
      {children}
    </Helmet>
  );
}
