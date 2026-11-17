/**
 * Badge — small label for product states (New, Eco-friendly, Wholesale price applied…).
 */
const variants = {
  primary: 'bg-primary-light text-primary-dark',
  solid: 'bg-primary text-white',
  accent: 'bg-accent-light text-[#7A4D00]',
  eco: 'bg-eco-light text-eco-dark',
  neutral: 'bg-cream-alt text-ink-muted',
  dark: 'bg-ink/80 text-white backdrop-blur-sm',
};

export default function Badge({ variant = 'neutral', icon: Icon, className = '', children, ...rest }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none ${variants[variant] || variants.neutral} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={12} aria-hidden="true" className="shrink-0" />}
      {children}
    </span>
  );
}
