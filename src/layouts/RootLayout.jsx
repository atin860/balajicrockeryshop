import { Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import useLanguage from '../hooks/useLanguage';
import useCart from '../hooks/useCart';
import CartDrawer from '../components/cart/CartDrawer';
import TopBar from '../components/layout/TopBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/layout/FloatingActions';
import shop from '../config/shop';
import PageLoader from '../components/ui/PageLoader';

/**
 * RootLayout — shared shell for every page:
 * skip link → top bar → sticky navbar → animated page → footer → floating call + WhatsApp buttons.
 *
 * Route transitions: fade + slight slide-up (AnimatePresence keyed by path).
 * MotionConfig reducedMotion="user" turns off movement for users who prefer reduced motion.
 */
const EASE_OUT = [0.22, 1, 0.36, 1];

export default function RootLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const outlet = useOutlet();
  const { summary, openDrawer } = useCart();

  // Switching category (/products → /products/dona) re-filters in place instead of
  // running the full page transition, so all product-list URLs share one key.
  const transitionKey = location.pathname.startsWith('/products') ? '/products' : location.pathname;

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        {t('common.skipToContent')}
      </a>

      <div className="flex min-h-screen flex-col">
        <TopBar />
        <Navbar cartCount={summary.lines} onCartClick={openDrawer} />

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <motion.div
              key={transitionKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <Suspense fallback={<PageLoader />}>{outlet}</Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      <FloatingActions />
      {/* ORDERING ON HOLD: the cart drawer only exists when ordering is switched on */}
      {shop.features.ordering && <CartDrawer />}
    </MotionConfig>
  );
}
