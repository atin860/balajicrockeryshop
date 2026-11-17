import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';

/**
 * QuantitySelector — [-] 12 [+] with a typable number in the middle.
 * The value is clamped between `min` and `max` when the field loses focus.
 */
const sizes = {
  sm: { btn: 'h-11 w-11', input: 'h-11 w-12 text-sm', icon: 16 },
  md: { btn: 'h-12 w-12', input: 'h-12 w-16 text-base', icon: 18 },
};

export default function QuantitySelector({ value, onChange, min = 1, max = 9999, size = 'md', label, className = '' }) {
  const { t } = useLanguage();
  const s = sizes[size] || sizes.md;
  const [draft, setDraft] = useState(String(value));

  // Keep the text box in sync when the value changes from outside (e.g. cart updates).
  useEffect(() => setDraft(String(value)), [value]);

  const clamp = (v) => Math.min(max, Math.max(min, v));
  const commit = (raw) => {
    const parsed = parseInt(raw, 10);
    const next = Number.isNaN(parsed) ? value : clamp(parsed);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const btn = `${s.btn} inline-flex items-center justify-center text-ink transition-colors duration-200 ease-out hover:bg-cream-alt disabled:cursor-not-allowed disabled:opacity-40`;

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-2xl border border-line bg-white ${className}`}
      role="group"
      aria-label={label || t('common.quantity')}
    >
      <button type="button" className={btn} onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label={t('common.decrease')}>
        <Minus size={s.icon} aria-hidden="true" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 5))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit(e.currentTarget.value);
        }}
        aria-label={label || t('common.quantity')}
        className={`${s.input} border-x border-line bg-transparent text-center font-semibold tabular-nums text-ink focus:bg-cream-alt focus:outline-none`}
      />
      <button type="button" className={btn} onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label={t('common.increase')}>
        <Plus size={s.icon} aria-hidden="true" />
      </button>
    </div>
  );
}
