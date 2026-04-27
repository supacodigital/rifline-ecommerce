import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart }     from '../../context/CartContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth }     from '../../context/AuthContext'
import s from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { addItem }          = useCart()
  const { format }           = useCurrency()
  const { toggle, isInWishlist } = useWishlist()
  const { user }             = useAuth()
  const navigate             = useNavigate()
  const { t }                = useTranslation()

  const cover = product.cover_url
    || product.images?.[0]?.url
    || null

  const inWishlist = isInWishlist(product.id)

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    toggle(product)
  }

  return (
    <Link to={`/produit/${product.slug}`} className={s.card}>
      {/* Image */}
      <div className={s.imageWrap}>
        {cover ? (
          <img
            src={cover}
            alt={product.name_fr}
            className={s.image}
            loading="lazy"
          />
        ) : (
          <div className={s.imagePlaceholder}>
            <span className={s.placeholderGlyph}>◈</span>
          </div>
        )}

        {/* Overlay quick add */}
        <div className={s.overlay}>
          {product.stock > 0 && (
            <button className={s.quickAdd} onClick={handleAddToCart}>
              <ShoppingBag size={13} /> {t('product.addToCart')}
            </button>
          )}
        </div>

        {/* Bouton wishlist */}
        <button
          className={`${s.wishlistBtn} ${inWishlist ? s.wishlistActive : ''}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
        >
          <Heart size={14} strokeWidth={1.5} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Infos */}
      <div className={s.info}>
        {product.category_name_fr && (
          <p className={s.category}>{product.category_name_fr}</p>
        )}
        <h3 className={s.name}>{product.name_fr}</h3>
        <div className={s.priceRow}>
          <span className={s.price}>{format(product.price)}</span>
          {product.stock === 0 && (
            <span className={s.outOfStock}>Épuisé</span>
          )}
        </div>
      </div>
    </Link>
  )
}
