import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * Button — one component for every clickable call-to-action.
 *
 * Renders:
 *  - <Link>   when `to` is given (internal route)
 *  - <a>      when `href` is given (external / tel: / wa.me). External http links open in a new tab.
 *  - <button> otherwise
 *
 * All sizes are at least 44px tall for comfortable tapping.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-heading font-semibold leading-none ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap';

const variants = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary-dark hover:shadow-card',
  secondary: 'border border-line bg-white text-ink hover:border-ink/25 hover:shadow-soft',
  accent: 'bg-accent text-ink shadow-soft hover:bg-accent-dark',
  whatsapp: 'bg-whatsapp-deep text-white shadow-soft hover:bg-whatsapp-deeper hover:shadow-card',
  ghost: 'text-ink hover:bg-cream-alt',
  light: 'bg-white text-ink shadow-soft hover:bg-cream',
  outlineLight: 'border border-white/60 text-white hover:bg-white/10',
};

const sizes = {
  sm: 'min-h-[44px] px-4 text-sm',
  md: 'min-h-[48px] px-6 text-[15px]',
  lg: 'min-h-[56px] px-8 text-base',
  icon: 'h-11 w-11 p-0',
};

const iconSizes = { sm: 16, md: 18, lg: 20, icon: 20 };

const Button = forwardRef(function Button(
  {
    to,
    href,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    fullWidth = false,
    loading = false,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const classes = [base, variants[variant] || variants.primary, sizes[size], fullWidth ? 'w-full' : '', className]
    .filter(Boolean)
    .join(' ');

  const iconSize = iconSizes[size];
  const content = (
    <>
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon size={iconSize} aria-hidden="true" className="shrink-0" />
      )}
      {children}
      {IconRight && <IconRight size={iconSize} aria-hidden="true" className="shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} disabled={loading || rest.disabled} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  );
});

export default Button;
