import { ArrowRight } from 'lucide-react';
import products from '../../data/products';
import useLanguage from '../../hooks/useLanguage';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import Carousel from '../ui/Carousel';
import ProductCard from '../product/ProductCard';

/** Best sellers = products marked isFeatured (excluding party packs, which have their own section). */
const bestSellers = products.filter((p) => p.isFeatured && p.category !== 'combo');

export default function BestSellers() {
  const { t } = useLanguage();

  return (
    <section className="section" aria-labelledby="bestsellers-title">
      <div className="container-page">
        <SectionTitle
          id="bestsellers-title"
          align="left"
          eyebrow={t('common.bestSeller')}
          title={t('home.bestSellersTitle')}
          subtitle={t('home.bestSellersSubtitle')}
          action={
            <Button to="/products" variant="secondary" iconRight={ArrowRight}>
              {t('common.viewAll')}
            </Button>
          }
          className="!mb-2"
        />
        <Carousel label={t('home.bestSellersTitle')}>
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
