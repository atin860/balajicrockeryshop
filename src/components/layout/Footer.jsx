import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone } from 'lucide-react';
import shop from '../../config/shop';
import useEnquiry from '../../hooks/useEnquiry';
import categories from '../../data/categories';
import useLanguage from '../../hooks/useLanguage';
import Logo from './Logo';
import Button from '../ui/Button';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { footerNav } from './navLinks';

/** Site footer (every page): about, quick links, categories, contact, copyright + developer credit. */
export default function Footer() {
  const { t, pick, localize } = useLanguage();
  const { openEnquiry } = useEnquiry();

  const linkClass = 'inline-flex min-h-[36px] items-center text-white/70 transition-colors duration-200 hover:text-accent';

  return (
    <footer className="mt-auto bg-[#1C1917] text-white/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-12 lg:gap-8">
        {/* About */}
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{t('footer.about')}</p>
          <p className="mt-3 font-hindi text-sm text-accent">{shop.tagline.hi}</p>
          <Button onClick={() => openEnquiry()} variant="whatsapp" size="sm" icon={WhatsAppIcon} className="mt-6">
            {t('common.enquireWhatsApp')}
          </Button>
        </div>

        {/* Quick links */}
        <nav aria-labelledby="footer-quick" className="lg:col-span-2">
          <h2 id="footer-quick" className="mb-4 text-base text-white">
            {t('footer.quickLinks')}
          </h2>
          <ul className="space-y-1 text-sm">
            {footerNav.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={linkClass}>
                  {t(`nav.${link.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Categories */}
        <nav aria-labelledby="footer-categories" className="lg:col-span-3">
          <h2 id="footer-categories" className="mb-4 text-base text-white">
            {t('footer.categories')}
          </h2>
          <ul className="space-y-1 text-sm">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={cat.id === 'combo' ? '/party-packs' : `/products/${cat.id}`} className={linkClass}>
                  {localize(cat, 'name')}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-base text-white">{t('footer.contactInfo')}</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Phone size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <span className="flex flex-col">
                {shop.phones.map((phone) => (
                  <a key={phone.tel} href={`tel:${phone.tel}`} className={`${linkClass} tabular-nums`}>
                    {phone.display}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <address className="not-italic leading-relaxed">{pick(shop.address)}</address>
            </li>
            <li className="flex gap-3">
              <Clock size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <span>
                <span className="block text-white">{t('footer.hours')}</span>
                {pick(shop.hours)}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar: copyright + developer credit (required on every page) */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center gap-2 py-5 text-center text-xs md:flex-row md:justify-between md:text-left">
          <p>{t('footer.copyright', { year: shop.copyrightYear })}</p>
          <p className="md:text-right">
            {t('footer.designedBy')}{' '}
            <a
              href={shop.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline-offset-4 transition-colors duration-200 hover:underline"
            >
              {shop.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
