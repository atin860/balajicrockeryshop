import { motion } from 'framer-motion';

/**
 * Scroll-reveal helpers. Animations are automatically reduced for users who
 * prefer reduced motion (MotionConfig reducedMotion="user" in RootLayout).
 *
 *   <Reveal>…</Reveal>                         fade + slide up when scrolled into view
 *   <RevealGroup><RevealItem/>…</RevealGroup>   staggered children (card grids)
 */
const EASE_OUT = [0.22, 1, 0.36, 1];

export function Reveal({ as = 'div', delay = 0, y = 24, className = '', children, ...rest }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

const groupVariants = {
  hidden: {},
  show: (stagger = 0.08) => ({ transition: { staggerChildren: stagger } }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

export function RevealGroup({ as = 'div', stagger = 0.08, className = '', children, ...rest }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      variants={groupVariants}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function RevealItem({ as = 'div', className = '', children, ...rest }) {
  const Component = motion[as] || motion.div;
  return (
    <Component className={className} variants={itemVariants} {...rest}>
      {children}
    </Component>
  );
}

export default Reveal;
