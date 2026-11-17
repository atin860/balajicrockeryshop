import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react';
import products from '../data/products';
import categories, { getCategory } from '../data/categories';
import useLanguage from '../hooks/useLanguage';
import { filterProducts, sortProducts, SORT_OPTIONS } from '../utils/productSearch';
import Seo from '../components/ui/Seo';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';
import ProductFilters from '../components/product/ProductFilters';
import ProductGrid from '../components/product/ProductGrid';
import NotFound from './NotFound';

/**
 * Products (/products) and category pages (/products/:category).
 * Filters live in the URL (?q=&material=paper,leaf&eco=1&stock=1&sort=nameAZ)
 * so results can be shared and the back button works.
 */
function countBy(list, key) {
  return list.reduce((acc, p) => ({ ...acc, [p[key]]: (acc[p[key]] || 0) + 1 }), {});
}

export default function Products() {
  const { t, lang, localize } = useLanguage();
  const { category = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ---- Read filters from the URL ----
  const q = params.get('q') || '';
  const materials = (params.get('material') || '').split(',').filter(Boolean);
  const eco = params.get('eco') === '1';
  const inStock = params.get('stock') === '1';
  const sort = SORT_OPTIONS.includes(params.get('sort')) ? params.get('sort') : 'featured';

  // Search box updates instantly; the URL follows after a short pause.
  const [query, setQuery] = useState(q);
  useEffect(() => setQuery(q), [q]);
  useEffect(() => {
    if (query === q) return undefined;
    const timer = setTimeout(() => update({ q: query }), 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /** Apply a change to the filters. Changing category changes the route. */
  function update(patch) {
    const next = new URLSearchParams(params);
    const set = (key, val) => (val ? next.set(key, val) : next.delete(key));
    if ('q' in patch) set('q', patch.q.trim());
    if ('materials' in patch) set('material', patch.materials.join(','));
    if ('eco' in patch) set('eco', patch.eco ? '1' : '');
    if ('inStock' in patch) set('stock', patch.inStock ? '1' : '');
    if ('sort' in patch) set('sort', patch.sort === 'featured' ? '' : patch.sort);
    if ('category' in patch && patch.category !== category) {
      if (!('materials' in patch)) next.delete('material'); // materials differ per category
      const search = next.toString() ? `?${next}` : '';
      navigate(`/products${patch.category ? `/${patch.category}` : ''}${search}`);
    } else {
      setParams(next, { replace: true });
    }
  }

  const clearAll = () => {
    setQuery('');
    navigate(category ? `/products/${category}` : '/products');
  };

  // ---- Results & counts ----
  const base = { q, eco, inStock };
  const results = useMemo(
    () => sortProducts(filterProducts(products, { ...base, category, materials }), sort, lang),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, eco, inStock, category, materials.join(','), sort, lang],
  );
  const counts = useMemo(() => {
    const withoutCategory = filterProducts(products, { ...base, materials });
    const withoutMaterial = filterProducts(products, { ...base, category });
    return {
      all: withoutCategory.length,
      byCategory: countBy(withoutCategory, 'category'),
      byMaterial: countBy(withoutMaterial.length ? withoutMaterial : filterProducts(products, { category }), 'material'),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, eco, inStock, category, materials.join(',')]);

  const cat = category ? getCategory(category) : null;
  if (category && !cat) return <NotFound />;

  const title = cat ? localize(cat, 'name') : t('products.title');
  const activeChips = [
    ...(q ? [{ key: 'q', label: t('products.resultsFor', { q }), onRemove: () => { setQuery(''); update({ q: '' }); } }] : []),
    ...materials.map((m) => ({ key: m, label: t(`products.materials.${m}`), onRemove: () => update({ materials: materials.filter((x) => x !== m) }) })),
    ...(eco ? [{ key: 'eco', label: t('products.ecoOnly'), onRemove: () => update({ eco: false }) }] : []),
    ...(inStock ? [{ key: 'stock', label: t('products.inStockOnly'), onRemove: () => update({ inStock: false }) }] : []),
  ];
  const filterCount = materials.length + Number(eco) + Number(inStock);
  const filterValue = { category, materials, eco, inStock };

  return (
    <>
      <Seo
        page={cat ? 'category' : 'products'}
        vars={cat ? { category: localize(cat, 'name') } : undefined}
        path={cat ? `/products/${cat.id}` : '/products'}
        image={cat?.image}
      />
      <PageHeader
        title={title}
        subtitle={cat ? localize(cat, 'description') : t('products.subtitle')}
        breadcrumbs={cat ? [{ label: t('nav.products'), to: '/products' }, { label: title }] : [{ label: t('nav.products') }]}
      />

      <section className="container-page py-8 md:py-12">
        {/* Category chips (phones/tablets) */}
        <nav aria-label={t('products.category')} className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden">
          {[{ id: '', name: t('products.allCategories') }, ...categories.map((c) => ({ id: c.id, name: localize(c, 'name') }))].map((c) => {
            const active = category === c.id;
            return (
              <Link
                key={c.id || 'all'}
                to={`/products${c.id ? `/${c.id}` : ''}${params.toString() ? `?${params}` : ''}`}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex min-h-[40px] shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-200 ${
                  active ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink hover:border-ink/30'
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block" aria-label={t('products.filters')}>
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-line bg-white p-4 shadow-soft">
              <ProductFilters value={filterValue} onChange={update} counts={counts} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('products.searchPlaceholder')}
                  aria-label={t('products.searchLabel')}
                  className="h-12 w-full rounded-2xl border border-line bg-white pl-11 pr-11 text-[15px] text-ink shadow-soft placeholder:text-ink-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      update({ q: '' });
                    }}
                    aria-label={t('products.clearSearch')}
                    className="absolute right-1 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-ink-muted hover:bg-cream-alt"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  icon={SlidersHorizontal}
                  onClick={() => setFiltersOpen(true)}
                  className="flex-1 lg:hidden"
                  aria-label={t('products.openFilters')}
                >
                  {t('products.filters')}
                  {filterCount > 0 && (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] text-white">{filterCount}</span>
                  )}
                </Button>
                <label className="relative flex-1 sm:w-52 sm:flex-none">
                  <span className="sr-only">{t('products.sortBy')}</span>
                  <select
                    value={sort}
                    onChange={(e) => update({ sort: e.target.value })}
                    className="h-12 w-full appearance-none rounded-2xl border border-line bg-white px-4 pr-10 text-[15px] text-ink shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {t('products.sortBy')}: {t(`products.sort.${opt}`)}
                      </option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted">
                    ▼
                  </span>
                </label>
              </div>
            </div>

            {/* Result count + active filters */}
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-live="polite">
              <p className="mr-2 text-sm font-medium text-ink-muted">{t('products.showing', { count: results.length })}</p>
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={t('products.removeFilter', { name: chip.label })}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm text-ink transition-colors duration-200 hover:border-primary hover:text-primary"
                >
                  {chip.label}
                  <X size={14} aria-hidden="true" />
                </button>
              ))}
              {activeChips.length > 1 && (
                <button type="button" onClick={clearAll} className="min-h-[36px] px-2 text-sm font-semibold text-primary hover:underline">
                  {t('products.clearFilters')}
                </button>
              )}
            </div>

            {/* Results */}
            <div className="mt-6">
              <h2 className="sr-only">{t('products.showing', { count: results.length })}</h2>
              {results.length > 0 ? (
                <ProductGrid products={results} className="grid-cols-2 md:grid-cols-3 2xl:grid-cols-4" />
              ) : (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-alt text-accent-dark">
                    <PackageSearch size={30} aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-xl">{t('products.noResultsTitle')}</h2>
                  <p className="mt-2 max-w-sm text-sm text-ink-muted">{t('products.noResultsText')}</p>
                  <Button variant="secondary" className="mt-6" onClick={clearAll}>
                    {t('products.clearFilters')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="left"
        title={t('products.filters')}
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={clearAll}>
              {t('common.reset')}
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>{t('products.showResults', { count: results.length })}</Button>
          </div>
        }
      >
        <ProductFilters value={filterValue} onChange={update} counts={counts} />
      </Drawer>
    </>
  );
}
