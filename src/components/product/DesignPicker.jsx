import { useRef } from 'react';
import { Check } from 'lucide-react';
import { getDesign } from '../../data/designs';
import useLanguage from '../../hooks/useLanguage';

/** Round colour chip for a design. */
export function DesignSwatch({ design, size = 'md', className = '' }) {
  const sizes = { xs: 'h-4 w-4', sm: 'h-6 w-6', md: 'h-9 w-9' };
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full border border-black/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] ${sizes[size]} ${className}`}
      style={{ background: design?.swatch || '#FFFFFF' }}
    />
  );
}

/**
 * DesignPicker — choose a design (accessible radio group of colour swatches).
 *
 *   <DesignPicker designIds={product.designs} value={designId} onChange={setDesignId} />
 *
 * Keyboard: arrow keys move between designs (standard radio-group behaviour).
 * `size="sm"` is a compact version for the cart drawer.
 */
export default function DesignPicker({ designIds = [], value, onChange, size = 'md', label, className = '' }) {
  const { t, localize } = useLanguage();
  const refs = useRef([]);
  if (designIds.length === 0) return null;

  const options = designIds.map(getDesign).filter(Boolean);
  const selected = options.find((d) => d.id === value) || options[0];
  const compact = size === 'sm';

  const onKeyDown = (event, index) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (index + keys[event.key] + options.length) % options.length;
    onChange(options[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className={className}>
      <p className={`mb-2 ${compact ? 'text-xs' : 'text-sm'} text-ink-muted`} id={`dp-${designIds.join('-')}`}>
        {label || t('product.chooseDesign')}: <span className="font-semibold text-ink">{localize(selected, 'name')}</span>
      </p>
      <div role="radiogroup" aria-labelledby={`dp-${designIds.join('-')}`} className="flex flex-wrap gap-2">
        {options.map((design, index) => {
          const active = design.id === selected.id;
          return (
            <button
              key={design.id}
              ref={(el) => (refs.current[index] = el)}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={localize(design, 'name')}
              title={localize(design, 'name')}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(design.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`relative inline-flex items-center justify-center rounded-full transition-[box-shadow,transform] duration-200 ease-out hover:scale-105 ${
                compact ? 'h-9 w-9' : 'h-11 w-11'
              } ${active ? 'ring-2 ring-primary ring-offset-2 ring-offset-white' : 'ring-1 ring-line'}`}
            >
              <DesignSwatch design={design} size={compact ? 'sm' : 'md'} />
              {active && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={10} strokeWidth={3} aria-hidden="true" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
