import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import shop from './config/shop';
// Home is the main landing page, so it ships in the first bundle (no extra round trip).
import Home from './pages/Home';

/**
 * App routes. Every other page is code-split with React.lazy and wrapped in
 * <Suspense> inside RootLayout. Unknown URLs show the 404 page.
 */
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const PartyPacks = lazy(() => import('./pages/PartyPacks'));
const BulkOrder = lazy(() => import('./pages/BulkOrder'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Faq = lazy(() => import('./pages/Faq'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:category" element={<Products />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="party-packs" element={<PartyPacks />} />
        <Route path="bulk-order" element={<BulkOrder />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        {/* ORDERING ON HOLD — these pages only exist when shop.features.ordering is true.
            While it is false, /cart, /checkout and /order-success show the 404 page. */}
        {shop.features.ordering && (
          <>
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
