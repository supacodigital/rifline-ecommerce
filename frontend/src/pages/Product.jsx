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
  const { addItem }                = useCart()
  const { format }                 = useCurrency()
  const { toggle, isInWishlist }   = useWishlist()
  const { user }                   = useAuth()
  const navigate                   = useNavigate()
  const { t }                      = useTranslation()

  useEffect(() => {
    setLoading(true)
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

  const images = product.images || []
  const cover  = images[activeImg]?.url || null

  function handleAdd() {
    const coverImg = images.find(i => i.is_cover) || images[0]
    addItem({ ...product, cover_url: coverImg?.url || null }, qty)
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
          <div className={s.price}>{format(product.price)}</div>
          <div className={s.divider} />

          {product.description_fr && (
            <p className={s.description}>{product.description_fr}</p>
          )}

          {product.stock > 0 ? (
            <>
              {/* Quantité */}
              <div className={s.qtyRow}>
                <span className={s.qtyLabel}>{t('product.quantity')}</span>
                <div className={s.qtyControl}>
                  <button className={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className={s.qtyVal}>{qty}</span>
                  <button className={s.qtyBtn} onClick={() => setQty(q => Math.min(product.stock, q + 1))}>
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
            <p className={s.outOfStock}>{t('product.outOfStock')}</p>
          )}

          {/* Métas */}
          <div className={s.metas}>
            {product.sku && (
              <div className={s.meta}>
                <strong>{t('product.ref')}</strong>
                <span>{product.sku}</span>
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
