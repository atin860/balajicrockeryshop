import Seo from '../components/ui/Seo';
import HeroSlider from '../components/home/HeroSlider';
import OccasionsStrip from '../components/home/OccasionsStrip';
import CategoryBento from '../components/home/CategoryBento';
import BestSellers from '../components/home/BestSellers';
import PartyPacksPreview from '../components/home/PartyPacksPreview';
import WhyChooseUs from '../components/home/WhyChooseUs';
import BulkCta from '../components/home/BulkCta';
import Testimonials from '../components/home/Testimonials';
import GalleryPreview from '../components/home/GalleryPreview';

/**
 * Home page (/). Sections alternate between the cream and light-orange backgrounds.
 * The top info bar, navbar and footer come from RootLayout.
 */
export default function Home() {
  return (
    <>
      <Seo page="home" path="/" />
      <HeroSlider />
      <OccasionsStrip />
      {/* Sections further down render lazily (content-visibility) to keep the first load fast */}
      <div className="defer-render">
        <CategoryBento />
      </div>
      <div className="defer-render">
        <BestSellers />
        <PartyPacksPreview />
      </div>
      <div className="defer-render">
        <WhyChooseUs />
        <BulkCta />
      </div>
      <div className="defer-render">
        <Testimonials />
        <GalleryPreview />
      </div>
    </>
  );
}
