import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from './ProductCard';

/**
 * Responsive product grid (2 / 3 / 4 columns). Cards animate in with a small
 * stagger and smoothly re-arrange when filters change.
 */
export default function ProductGrid({ products, className = 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' }) {
  return (
    <ul className={`grid gap-3 sm:gap-4 lg:gap-5 ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((product, i) => (
          <motion.li
            key={product.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
          >
            <ProductCard product={product} priority={i < 4} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
