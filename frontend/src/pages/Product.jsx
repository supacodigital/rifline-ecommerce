import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api         from '../api/axios'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth }     from '../context/AuthContext'
import s from './Product.module.css'

function Stars({ rating }) {
  return (
    <span className={s.reviewStars}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function Product() {
  const { slug }               = useParams()
  const [product, setProduct]  = useState(null)
  const [reviews, setReviews]  = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty]          = useState(1)
  const [loading, setLoading]  = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const { addItem }                = useCart()
  const { format }                 = useCurrency()
  const { toggle, isInWishlist }   = useWishlist()
  const { user }                   = useAuth()
  const navigate                   = useNavigate()
  const { t }                      = useTranslation()

  useEffect(() => {
    setLoading(true)
    setSelectedVariant(null)
    setQty(1)
    api.get(`/products/${slug}`)
      .then(res => {
        setProduct(res.data.product)
        return api.get(`/reviews/product/${res.data.product.id}`)
      })
      .then(res => setReviews(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className={s.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)' }}>
        {t('product.loading')}
      </div>
    </div>
  )

  if (!product) return (
    <div className={s.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-6)' }}>
          {t('product.notFound')}
        </p>
        <Link to="/catalogue" className="btn-outline">{t('product.backToCollection')}</Link>
      </div>
    </div>
  )

  const images      = product.images || []
  const variants    = (product.variants || []).filter(v => v.is_active)
  const hasVariants = variants.length > 0

  // Si la variante sélectionnée a sa propre image, elle remplace l'image principale
  const variantImage = selectedVariant?.image_url || null
  const cover        = variantImage || images[activeImg]?.url || null

  // Prix et stock effectifs selon la variante sélectionnée
  const displayPrice = selectedVariant?.price ?? product.price
  const activeStock  = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : product.stock
  const canAdd = hasVariants ? (selectedVariant !== null && activeStock > 0) : activeStock > 0

  function handleVariantSelect(variant) {
    setSelectedVariant(prev => prev?.id === variant.id ? null : variant)
    setQty(1)
    // Si la variante n'a pas d'image propre, on revient à la première image du produit
    if (!variant.image_url) setActiveImg(0)
  }

  function handleAdd() {
    const coverImg = images.find(i => i.is_cover) || images[0]
    addItem(
      { ...product, cover_url: variantImage || coverImg?.url || null },
      qty,
      selectedVariant
        ? { id: selectedVariant.id, name: selectedVariant.name, price: selectedVariant.price, stock: selectedVariant.stock, image_url: selectedVariant.image_url || null }
        : null
    )
  }

  function handleWishlist() {
    if (!user) { navigate('/login'); return }
    toggle(product)
  }

  return (
    <div className={s.page}>
      <div className={s.main}>
        {/* Galerie */}
        <div className={s.gallery}>
          {images.length > 1 && (
            <div className={s.thumbnails}>
              {images.map((img, i) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt_text || product.name_fr}
                  className={`${s.thumb} ${i === activeImg ? s.activeThumb : ''}`}
                  onClick={() => setActiveImg(i)}
                />
              ))}
            </div>
          )}

          <div className={s.mainImage}>
            {cover ? (
              <img src={cover} alt={product.name_fr} className={s.mainImg} />
            ) : (
              <div className={s.imagePlaceholder}>
                <span className={s.placeholderGlyph}>◈</span>
              </div>
            )}
          </div>
        </div>

        {/* Informations */}
        <div className={s.info}>
          {/* Breadcrumb */}
          <div className={s.breadcrumb}>
            <Link to="/">Accueil</Link>
            <ChevronRight size={12} />
            <Link to="/catalogue">Collection</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--color-text-muted)' }}>{product.name_fr}</span>
          </div>

          {product.category_name_fr && (
            <p className="section-label">{product.category_name_fr}</p>
          )}

          <h1 className={s.productName}>{product.name_fr}</h1>
          <div className={s.price}>{format(displayPrice)}</div>
          <div className={s.divider} />

          {product.description_fr && (
            <p className={s.description}>{product.description_fr}</p>
          )}

          {/* Sélecteur de variantes */}
          {hasVariants && (
            <div className={s.variantsBlock}>
              <div className={s.variantsHeader}>
                <span className={s.variantsLabel}>{t('product.variant', 'Variante')}</span>
                {selectedVariant && (
                  <span className={s.variantsSelected}>{selectedVariant.name}</span>
                )}
              </div>
              <div className={s.variantsList}>
                {variants.map(v => {
                  const isSelected = selectedVariant?.id === v.id
                  const outOfStock = v.stock === 0
                  return (
                    <button
                      key={v.id}
                      className={`${s.variantBtn} ${isSelected ? s.variantSelected : ''} ${outOfStock ? s.variantSoldOut : ''}`}
                      onClick={() => !outOfStock && handleVariantSelect(v)}
                      disabled={outOfStock}
                      title={outOfStock ? t('product.outOfStock') : v.name}
                    >
                      {v.image_url ? (
                        <img src={v.image_url} alt={v.name} className={s.variantThumb} />
                      ) : (
                        <div className={s.variantThumbPlaceholder}>◈</div>
                      )}
                      <span className={s.variantBtnName}>{v.name}</span>
                      {v.price !== null && v.price !== product.price && (
                        <span className={s.variantPriceDiff}>
                          {v.price > product.price ? '+' : ''}{format(v.price - product.price)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              {hasVariants && !selectedVariant && (
                <p className={s.variantHint}>{t('product.selectVariant', 'Veuillez sélectionner une variante')}</p>
              )}
            </div>
          )}

          {canAdd ? (
            <>
              {/* Quantité */}
              <div className={s.qtyRow}>
                <span className={s.qtyLabel}>{t('product.quantity')}</span>
                <div className={s.qtyControl}>
                  <button className={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className={s.qtyVal}>{qty}</span>
                  <button className={s.qtyBtn} onClick={() => setQty(q => Math.min(activeStock, q + 1))}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className={s.actions}>
                <button className={`btn-primary ${s.addToCart}`} onClick={handleAdd}>
                  {t('product.addToCart')}
                </button>
                <button
                  className={`${s.wishlistBtn} ${product && isInWishlist(product.id) ? s.wishlistActive : ''}`}
                  onClick={handleWishlist}
                  aria-label={product && isInWishlist(product.id) ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
                >
                  <Heart size={18} strokeWidth={1.5} fill={product && isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </>
          ) : (
            <p className={s.outOfStock}>
              {hasVariants && !selectedVariant ? '' : t('product.outOfStock')}
            </p>
          )}

          {/* Métas */}
          <div className={s.metas}>
            {product.sku && (
              <div className={s.meta}>
                <strong>{t('product.ref')}</strong>
                <span>{selectedVariant?.sku || product.sku}</span>
              </div>
            )}
            {product.weight_grams && (
              <div className={s.meta}>
                <strong>{t('product.weight')}</strong>
                <span>{product.weight_grams} g</span>
              </div>
            )}
            {product.tags?.length > 0 && (
              <div className={s.meta}>
                <strong>{t('product.tags')}</strong>
                <span>{product.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avis */}
      {reviews.length > 0 && (
        <section className={s.reviewsSection}>
          <div className="container">
            <p className="section-label">Avis clients</p>
            <h2 className="section-title">{reviews.length} avis</h2>
            <div className={s.reviewsGrid}>
              {reviews.map(r => (
                <div key={r.id} className={s.reviewCard}>
                  <Stars rating={r.rating} />
                  {r.title && <h4 className={s.reviewTitle}>{r.title}</h4>}
                  {r.body  && <p  className={s.reviewBody}>{r.body}</p>}
                  <span className={s.reviewAuthor}>
                    {r.first_name} {r.last_name?.[0]}.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
