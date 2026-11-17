import { CalendarHeart, Clock, Handshake, MapPin, Package, Phone, ShieldCheck, Smile, Sparkles, Truck, Users } from 'lucide-react';
import shop, { directionsUrl } from '../config/shop';
import products from '../data/products';
import useLanguage from '../hooks/useLanguage';
import useCountUp from '../hooks/useCountUp';
import { formatNumber } from '../utils/format';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import useEnquiry from '../hooks/useEnquiry';

/** About (/about): story, animated stats, owner (Sunil Sharma) with photo, shop photos, values. */
function Stat({ icon: Icon, value, label }) {
  const [ref, current] = useCountUp(value);
  return (
    <div className="rounded-2xl bg-white/10 p-5 text-center backdrop-blur-sm md:p-6">
      <Icon size={26} aria-hidden="true" className="mx-auto text-accent" />
      <p className="mt-3 font-heading text-3xl font-bold tabular-nums text-white md:text-4xl">
        {/* Screen readers get the final number; the animation is visual only. */}
        <span ref={ref} aria-hidden="true">
          {formatNumber(current)}+
        </span>
        <span className="sr-only">{formatNumber(value)}+</span>
      </p>
      <p className="mt-1 text-sm text-white/80">{label}</p>
    </div>
  );
}

const VALUE_ICONS = [ShieldCheck, Handshake, Truck, Smile];

export default function About() {
  const { t, pick } = useLanguage();
  const { openEnquiry } = useEnquiry();

  const stats = [
    { icon: CalendarHeart, value: shop.stats.years, label: t('about.stats.years') },
    { icon: Users, value: shop.stats.customers, label: t('about.stats.customers') },
    { icon: Package, value: products.length, label: t('about.stats.products') },
    { icon: Sparkles, value: shop.stats.events, label: t('about.stats.events') },
  ];

  return (
    <>
      <Seo page="about" path="/about" image="/images/about/shop-front.webp" />
      <PageHeader title={t('about.title')} subtitle={t('about.subtitle')} breadcrumbs={[{ label: t('nav.about') }]} />

      {/* Story */}
      <section className="section" aria-labelledby="story-title">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 id="story-title" className="text-3xl md:text-4xl">
              {t('about.storyTitle')}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-muted md:text-lg">
              {t('about.story').map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <p className="mt-6 inline-block rounded-2xl bg-accent-light px-4 py-2 font-hindi text-lg font-semibold text-[#6B4500]">{shop.tagline.hi}</p>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <ImageWithFallback
              src="/images/about/shop-front.webp"
              alt={t('about.photoAlts.shopFront')}
              width={1200}
              height={800}
              aspect="3 / 2"
              className="rounded-3xl shadow-lift"
            />
            <div className="absolute -bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card sm:left-auto sm:max-w-xs">
              <MapPin size={22} aria-hidden="true" className="shrink-0 text-primary" />
              <p className="text-sm text-ink">{pick(shop.address)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#8E1B1B] py-14 md:py-20" aria-labelledby="stats-title">
        <div className="container-page">
          <h2 id="stats-title" className="text-center text-2xl text-white md:text-3xl">
            {t('about.statsTitle')}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-white/70">{t('about.statsNote')}</p>
        </div>
      </section>

      {/* Owner */}
      <section className="section" aria-labelledby="owners-title">
        <div className="container-page">
          <SectionTitle id="owners-title" title={t('about.proprietorsTitle')} subtitle={t('about.proprietorsSubtitle')} />
          {shop.proprietors.map((person) => {
            const name = pick(person);
            return (
              <div key={person.en} className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr] md:gap-12">
                <Reveal className="relative mx-auto w-full max-w-[320px]">
                  <ImageWithFallback
                    src={person.photo}
                    alt={t('about.ownerPhotoAlt', { name })}
                    width={800}
                    height={1000}
                    aspect="4 / 5"
                    label={name}
                    className="rounded-3xl shadow-lift"
                  />
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-card">
                    {t('about.proprietorRole')}
                  </span>
                </Reveal>
                <Reveal delay={0.1}>
                  <h3 className="text-3xl md:text-4xl">{name}</h3>
                  <p className="mt-1 text-ink-muted">
                    {t('about.proprietorRole')} · {pick(shop.name)}
                  </p>
                  <blockquote className="mt-5 border-l-4 border-accent pl-4 text-lg leading-relaxed text-ink">“{t('about.ownerQuote')}”</blockquote>
                  <p className="mt-3 font-hindi text-base font-semibold text-primary">{shop.tagline.hi}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {shop.phones.map((phone) => (
                      <Button key={phone.tel} href={`tel:${phone.tel}`} icon={Phone} className="tabular-nums" aria-label={`${t('about.callProprietor')} ${name}: ${phone.display}`}>
                        {phone.display}
                      </Button>
                    ))}
                    <Button variant="whatsapp" icon={WhatsAppIcon} onClick={() => openEnquiry()}>
                      {t('common.enquireWhatsApp')}
                    </Button>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop photos */}
      <section className="section bg-cream-alt" aria-labelledby="photos-title">
        <div className="container-page">
          <SectionTitle id="photos-title" title={t('about.photosTitle')} />
          <RevealGroup className="grid gap-4 md:grid-cols-3">
            {[
              ['/images/about/shop-front.webp', 'shopFront'],
              ['/images/about/stock.webp', 'stock'],
              ['/images/about/team.webp', 'team'],
            ].map(([src, key]) => (
              <RevealItem key={key} className="group overflow-hidden rounded-2xl shadow-soft">
                <ImageWithFallback
                  src={src}
                  alt={t(`about.photoAlts.${key}`)}
                  width={1200}
                  height={800}
                  aspect="3 / 2"
                  imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Values */}
      <section className="section" aria-labelledby="values-title">
        <div className="container-page">
          <SectionTitle id="values-title" title={t('about.valuesTitle')} />
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t('about.values').map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <RevealItem key={v.title} className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg">{v.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{v.text}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>

          {/* Visit CTA */}
          <Reveal className="mt-12 flex flex-col items-start gap-4 rounded-3xl bg-cream-alt p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <h2 className="text-2xl">{t('about.visitTitle')}</h2>
              <p className="mt-1 text-ink-muted">{t('about.visitText')}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                <Clock size={14} aria-hidden="true" /> {pick(shop.hours)}
              </p>
            </div>
            <Button href={directionsUrl} icon={MapPin}>
              {t('contact.getDirections')}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
