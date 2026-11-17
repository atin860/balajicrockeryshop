import { useEffect, useRef, useState } from 'react';
import { getCategoryIcon } from './categoryIcons';

/**
 * ImageWithFallback
 * -----------------
 * - Reserves space with a fixed aspect ratio + width/height (no layout shift).
 * - Lazy-loads by default; pass `priority` for above-the-fold images (hero).
 * - Fades the image in once loaded.
 * - If the file is missing or fails, shows a soft cream box with the category
 *   icon and the product name — the layout never breaks.
 *
 * Props:
 *   src, alt, width, height  – image + intrinsic size
 *   aspect                   – CSS aspect-ratio for the box, e.g. "1 / 1", "4 / 3"
 *   category                 – category id for the fallback icon
 *   label                    – text shown in the fallback (defaults to alt)
 *   className                – classes for the wrapper (rounded corners, etc.)
 *   imgClassName             – classes for the <img> (e.g. hover zoom)
 */
export default function ImageWithFallback({
  src,
  alt = '',
  width,
  height,
  aspect,
  category,
  label,
  priority = false,
  sizes,
  className = '',
  imgClassName = '',
  fallbackClassName = '',
  ...rest
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');
  const imgRef = useRef(null);

  // Reset when the source changes; detect images already loaded from cache.
  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }
    const img = imgRef.current;
    if (img && img.complete) {
      setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
    } else {
      setStatus('loading');
    }
  }, [src]);

  const Icon = getCategoryIcon(category);
  const failed = status === 'error';

  return (
    <div
      className={`relative overflow-hidden bg-cream-alt ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {!failed && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchpriority={priority ? 'high' : undefined}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          // Priority (above-the-fold) images show as soon as they arrive — no fade —
          // so they count for Largest Contentful Paint immediately.
          className={`h-full w-full object-cover ${
            priority ? '' : `transition-opacity duration-500 ease-out ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`
          } ${imgClassName}`}
          {...rest}
        />
      )}

      {/* Soft shimmer while loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream-alt to-cream" aria-hidden="true" />
      )}

      {failed && (
        <div
          role="img"
          aria-label={alt}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-cream-alt to-cream p-4 text-center ${fallbackClassName}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-accent-dark shadow-soft">
            <Icon size={28} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <span className="line-clamp-2 max-w-[90%] text-sm font-medium text-ink-muted">{label || alt}</span>
        </div>
      )}
    </div>
  );
}
