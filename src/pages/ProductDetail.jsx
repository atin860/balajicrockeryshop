import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Info, Leaf, PackageX, Phone, ShoppingBag, ShoppingCart, Sparkles } from 'lucide-react';
import products, { getProductBySlug } from '../data/products';
import { getCategory } from '../data/categories';
import { getDesign } from '../data/designs';
import shop from '../config/shop';
import useLanguage from '../hooks/useLanguage';
import useCart from '../hooks/useCart';
import useEnquiry from '../hooks/useEnquiry';
import { buildOrderMessage, generateOrderId, openWhatsApp } from '../utils/whatsapp';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import QuantitySelector from '../components/ui/QuantitySelector';
import SectionTitle from '../components/ui/SectionTitle';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import DesignPicker from '../components/product/DesignPicker';
import ProductGallery from '../components/product/ProductGallery';
import ProductGrid from '../components/product/ProductGrid';
import StickyAddToCart from '../components/product/StickyAddToCart';

/** Up to 4 related products: same category first, then best sellers. */
function relatedTo(product) {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const others = products.filter((p) => p.isFeatured && p.category !== product.category && p.category !== 'combo');
  return [...same, ...others].slice(0, 4);
}

function ProductNotFound() {
  const { t } = useLanguage();
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <Seo page="notFound" path="/product" noindex />
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-alt text-accent-dark">
        <PackageX size={30} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-3xl">{t('product.notFoundTitle')}</h1>
      <p className="mt-2 max-w-md text-ink-muted">{t('product.notFoundText')}</p>
      <Button to="/products" className="mt-6" icon={ShoppingBag}>
        {t('notFound.browse')}
      </Button>
    </section>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { t, lang, localize, pick } = useLanguage();
  const { addItem, getQuantity } = useCart();
  const { openEnquiry } = useEnquiry();
  const ordering = shop.features.ordering; // ORDERING ON HOLD when false
  const [designId, setDesignId] = useState(product?.designs[0] ?? null);
  const [quantity, setQuantity] = useState(product?.minQty ?? 1);
  const [showSticky, setShowSticky] = useState(false);
  const addButtonRef = useRef(null);

  // Show the sticky mobile bar once the main action button (Add to Cart / Enquire) has scrolled above the screen.
  // (A throttled scroll check rather than IntersectionObserver: a fast fling can jump past
  // the button without ever "intersecting", which would leave the bar hidden.)
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = addButtonRef.current;
      if (el) setShowSticky(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [product]);

  if (!product) return <ProductNotFound />;

  const name = localize(product, 'name');
  const otherName = lang === 'hi' ? product.nameEn : product.nameHi;
  const category = getCategory(product.category);
  const design = getDesign(designId);
  const inCart = getQuantity(product.id, designId);

  const addToCart = () => addItem(product.id, { designId, quantity });
  const orderOnWhatsApp = () =>
    openWhatsApp(buildOrderMessage({ items: [{ product, design, quantity }], orderId: generateOrderId(), lang }));

  // Enquiry (while ordering is on hold): opens the WhatsApp form about this product + chosen design.
  const enquirySubject = design
    ? `${t('product.enquiryFor', { name, design: localize(design, 'name') })} (${localize(product, 'unit')})`
    : `${name} (${localize(product, 'unit')})`;
  const enquire = () => openEnquiry({ subject: enquirySubject, message: t('product.enquiryMessage', { item: enquirySubject }) });
  const callHref = `tel:${shop.phones[0].tel}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameEn,
    alternateName: product.nameHi,
    description: product.descriptionEn,
    image: product.images.map((src) => `${shop.siteUrl.replace(/\/$/, '')}${src}`),
    category: category?.nameEn,
    material: product.material,
    brand: { '@type': 'Brand', name: shop.name.en },
  };

  const specs = [
    [t('product.size'), localize(product, 'size')],
    [t('product.unit'), localize(product, 'unit')],
    [t('product.material'), t(`products.materials.${product.material}`)],
    [t('product.category'), localize(category, 'name')],
  ];

  return (
    <>
      <Seo page="product" vars={{ name, unit: localize(product, 'unit') }} path={`/product/${product.slug}`} image={product.images[0]} type="product">
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Seo>
      <PageHeader
        compact
        title={localize(category, 'name')}
        breadcrumbs={[
          { label: t('nav.products'), to: '/products' },
          { label: localize(category, 'name'), to: `/products/${category.id}` },
          { label: name },
        ]}
      />

      <section className="container-page py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery
            images={product.images}
            name={name}
            category={product.category}
            badges={
              <>
                {product.isNew && (
                  <Badge variant="solid" icon={Sparkles}>
                    {t('common.new')}
                  </Badge>
                )}
                {product.isEcoFriendly && (
                  <Badge variant="eco" icon={Leaf}>
                    {t('common.ecoFriendly')}
                  </Badge>
                )}
              </>
            }
          />

          {/* Info */}
          <div>
            <Link
              to={`/products/${category.id}`}
              className="inline-flex min-h-[32px] items-center text-sm font-semibold uppercase tracking-wider text-primary hover:underline"
            >
              {localize(category, 'name')}
            </Link>
            <h1 className="mt-1 text-3xl md:text-4xl">{name}</h1>
            <p className="mt-1 text-lg text-ink-muted" lang={lang === 'hi' ? 'en' : 'hi'}>
              {otherName}
            </p>

            <p className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${product.inStock ? 'text-eco' : 'text-primary'}`}>
              <span className={`h-2 w-2 rounded-full ${product.inStock ? 'bg-eco' : 'bg-primary'}`} aria-hidden="true" />
              {product.inStock ? t('common.inStock') : t('common.outOfStock')}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(([label, val]) => (
                <div key={label} className="rounded-2xl border border-line bg-white p-3">
                  <dt className="text-xs text-ink-muted">{label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink">{val}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 leading-relaxed text-ink-muted">{localize(product, 'description')}</p>

            {product.designs.length > 0 && (
              <DesignPicker
                className="mt-6"
                designIds={product.designs}
                value={designId}
                onChange={setDesignId}
                label={ordering ? undefined : t('product.availableDesigns')}
              />
            )}

            {ordering ? (
              /* ORDERING ON HOLD — quantity, Add to Cart and Order Now (shown only when ordering is on) */
              <>
            <div className="mt-6">
              <p className="mb-2 text-sm text-ink-muted">{t('product.quantityIn', { unit: localize(product, 'unit') })}</p>
              <div className="flex flex-wrap items-center gap-3">
                <QuantitySelector value={quantity} onChange={setQuantity} min={product.minQty} max={shop.maxQtyPerItem} />
                {inCart > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-eco">
                    <Check size={16} aria-hidden="true" />
                    {t('product.inCart', { count: t('common.packets', { count: inCart }) })}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button ref={addButtonRef} size="lg" icon={ShoppingCart} onClick={addToCart} disabled={!product.inStock}>
                {t('common.addToCart')}
              </Button>
              <Button size="lg" variant="whatsapp" icon={WhatsAppIcon} onClick={orderOnWhatsApp}>
                {t('product.orderNowWhatsApp')}
              </Button>
            </div>
            <p className="mt-3 flex gap-2 rounded-2xl bg-accent-light px-4 py-3 text-sm text-[#6B4500]">
              <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              {t('product.orderNowNote')}
            </p>
              </>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button ref={addButtonRef} size="lg" variant="whatsapp" icon={WhatsAppIcon} onClick={enquire}>
                    {t('common.enquireWhatsApp')}
                  </Button>
                  <Button size="lg" href={callHref} icon={Phone} className="tabular-nums">
                    {t('common.callNow')}
                  </Button>
                </div>
                <p className="mt-3 flex gap-2 rounded-2xl bg-accent-light px-4 py-3 text-sm text-[#6B4500]">
                  <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                  {t('product.enquireNote')}
                </p>
              </>
            )}

            <div className="mt-8 rounded-2xl border border-line bg-white p-5">
              <h2 className="text-lg">{t('product.features')}</h2>
              <ul className="mt-3 space-y-2">
                {product.features.map((f) => (
                  <li key={f.en} className="flex gap-2.5 text-sm text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-eco-light text-eco">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {pick(f)}
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/products" className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink-muted hover:text-primary">
              <ArrowLeft size={16} aria-hidden="true" />
              {t('product.backToProducts')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-cream-alt" aria-labelledby="related-title">
        <div className="container-page">
          <SectionTitle id="related-title" align="left" title={t('product.related')} />
          <ProductGrid products={relatedTo(product)} className="grid-cols-2 lg:grid-cols-4" />
        </div>
      </section>

      <StickyAddToCart
        visible={showSticky && (product.inStock || !ordering)}
        product={product}
        design={design}
        quantity={quantity}
        enquiryMode={!ordering}
        callHref={callHref}
        onAdd={addToCart}
        onWhatsApp={ordering ? orderOnWhatsApp : enquire}
      />
    </>
  );
}
