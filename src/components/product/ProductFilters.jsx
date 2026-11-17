import categories from '../../data/categories';
import useLanguage from '../../hooks/useLanguage';
import { getCategoryIcon } from '../ui/categoryIcons';

/**
 * Filter panel (desktop sidebar + mobile drawer).
 *
 *   value    = { category, materials: [], eco, inStock }
 *   onChange = (patch) => void      e.g. onChange({ eco: true })
 *   counts   = { all, byCategory: { dona: 5, … }, byMaterial: { paper: 9, … } }
 */
function Group({ title, children }) {
  return (
    <fieldset className="border-b border-line pb-5 last:border-0">
      <legend className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

const optionRow =
  'flex min-h-[44px] w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-200 hover:bg-cream-alt has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent';

export default function ProductFilters({ value, onChange, counts }) {
  const { t, localize } = useLanguage();
  const materials = Object.keys(counts.byMaterial);

  const toggleMaterial = (m) =>
    onChange({ materials: value.materials.includes(m) ? value.materials.filter((x) => x !== m) : [...value.materials, m] });

  return (
    <div className="space-y-5">
      <Group title={t('products.category')}>
        <div className="space-y-1">
          {[{ id: '', label: t('products.allCategories'), count: counts.all }, ...categories.map((c) => ({ id: c.id, label: localize(c, 'name'), count: counts.byCategory[c.id] || 0 }))].map(
            (opt) => {
              const Icon = opt.id ? getCategoryIcon(opt.id) : null;
              const active = value.category === opt.id;
              return (
                <label key={opt.id || 'all'} className={`${optionRow} ${active ? 'bg-white font-semibold text-primary shadow-soft' : 'text-ink'}`}>
                  <input
                    type="radio"
                    name="category"
                    className="sr-only"
                    checked={active}
                    onChange={() => onChange({ category: opt.id })}
                  />
                  {Icon ? <Icon size={16} aria-hidden="true" className="shrink-0 text-accent-dark" /> : <span className="w-4" aria-hidden="true" />}
                  <span className="flex-1">{opt.label}</span>
                  <span className="text-xs tabular-nums text-ink-muted">{opt.count}</span>
                </label>
              );
            },
          )}
        </div>
      </Group>

      <Group title={t('products.material')}>
        <div className="space-y-1">
          {materials.map((m) => (
            <label key={m} className={`${optionRow} text-ink`}>
              <input
                type="checkbox"
                checked={value.materials.includes(m)}
                onChange={() => toggleMaterial(m)}
                className="h-4 w-4 shrink-0 rounded accent-primary"
              />
              <span className="flex-1">{t(`products.materials.${m}`)}</span>
              <span className="text-xs tabular-nums text-ink-muted">{counts.byMaterial[m]}</span>
            </label>
          ))}
        </div>
      </Group>

      <Group title={t('products.availability')}>
        <div className="space-y-1">
          <label className={`${optionRow} text-ink`}>
            <input type="checkbox" checked={value.eco} onChange={(e) => onChange({ eco: e.target.checked })} className="h-4 w-4 shrink-0 rounded accent-eco" />
            <span className="flex-1">{t('products.ecoOnly')}</span>
          </label>
          <label className={`${optionRow} text-ink`}>
            <input
              type="checkbox"
              checked={value.inStock}
              onChange={(e) => onChange({ inStock: e.target.checked })}
              className="h-4 w-4 shrink-0 rounded accent-primary"
            />
            <span className="flex-1">{t('products.inStockOnly')}</span>
          </label>
        </div>
      </Group>
    </div>
  );
}
