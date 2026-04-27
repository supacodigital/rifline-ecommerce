import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import ProductCard from '../components/ui/ProductCard'
import s from './Catalogue.module.css'

const LIMIT = 12

export default function Catalogue() {
  const { t } = useTranslation()

  const [searchParams, setSearchParams] = useSearchParams()
  const [products,   setProducts]   = useState([])
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [categories, setCategories] = useState([])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const currentCat  = searchParams.get('cat')  || ''
  const currentPage = Number(searchParams.get('page') || 1)
  const minPrice    = searchParams.get('min')  || ''
  const maxPrice    = searchParams.get('max')  || ''

  // Chargement des catégories
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {})
  }, [])

  // Chargement des produits
  const fetchProducts = useCallback(() => {
    setLoading(true)

    const params = new URLSearchParams({
      limit:  LIMIT,
      offset: (currentPage - 1) * LIMIT,
    })
    if (currentCat) params.set('category_id', currentCat)
    if (minPrice)   params.set('min_price', minPrice)
    if (maxPrice)   params.set('max_price', maxPrice)

    api.get(`/products?${params}`)
      .then(res => {
        setProducts(res.data.products || [])
        setTotal(res.data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [currentCat, currentPage, minPrice, maxPrice])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page') // reset pagination
    setSearchParams(next)
  }

  function resetFilters() {
    setSearchParams({})
  }

  function setPage(p) {
    const next = new URLSearchParams(searchParams)
    next.set('page', p)
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className={s.page}>
      {/* Banner */}
      <div className={s.banner}>
        <div className={s.bannerBg} />
        <div className="container">
          <h1 className={s.bannerTitle}>
            {currentCat
              ? categories.find(c => String(c.id) === currentCat)?.name_fr || t('catalogue.title')
              : t('catalogue.title')}
          </h1>
          <p className={s.bannerSub}>{total} {total > 1 ? t('catalogue.products_plural') : t('catalogue.products')}</p>
        </div>
      </div>

      <div className="container">
        <div className={s.layout}>
          {/* Filtres */}
          <aside>
            <button
              className={s.mobileFilterToggle}
              onClick={() => setMobileFilterOpen(v => !v)}
            >
              <SlidersHorizontal size={14} />
              {t('catalogue.filters')}
            </button>

            <div className={`${s.filters} ${mobileFilterOpen ? s.mobileOpen : ''}`}>
              <p className={s.filtersTitle}>{t('catalogue.filters')}</p>

              {/* Catégories */}
              <div className={s.filterGroup}>
                <p className={s.filterGroupLabel}>{t('catalogue.category')}</p>
                <div
                  className={`${s.filterOption} ${currentCat === '' ? s.active : ''}`}
                  onClick={() => setFilter('cat', '')}
                >
                  {t('catalogue.allCategories')}
                </div>
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className={`${s.filterOption} ${currentCat === String(cat.id) ? s.active : ''}`}
                    onClick={() => setFilter('cat', String(cat.id))}
                  >
                    {cat.name_fr}
                  </div>
                ))}
              </div>

              {/* Prix */}
              <div className={s.filterGroup}>
                <p className={s.filterGroupLabel}>{t('catalogue.price')}</p>
                <div className={s.priceInputs}>
                  <input
                    type="number"
                    className={s.priceInput}
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setFilter('min', e.target.value)}
                  />
                  <input
                    type="number"
                    className={s.priceInput}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setFilter('max', e.target.value)}
                  />
                </div>
              </div>

              <button className={s.resetFilters} onClick={resetFilters}>
                {t('common.cancel')}
              </button>
            </div>
          </aside>

          {/* Produits */}
          <div className={s.content}>
            <div className={s.toolbar}>
              <span className={s.count}>{total} {total > 1 ? t('catalogue.products_plural') : t('catalogue.products')}</span>
            </div>

            {loading ? (
              <div className={s.grid}>
                {Array.from({ length: LIMIT }).map((_, i) => (
                  <div key={i} className={s.skeleton} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-24) 0', color: 'var(--color-text-muted)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>
                  {t('catalogue.noProducts')}
                </p>
                <button className="btn-ghost" onClick={resetFilters}>{t('catalogue.adjustFilters')}</button>
              </div>
            ) : (
              <div className={s.grid}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={s.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`${s.pageBtn} ${p === currentPage ? s.activePage : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
