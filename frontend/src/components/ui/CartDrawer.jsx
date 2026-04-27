import { useEffect } from 'react'
import { Link }      from 'react-router-dom'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart }     from '../../context/CartContext'
import { useCurrency } from '../../context/CurrencyContext'
import s from './CartDrawer.module.css'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice } = useCart()
  const { format } = useCurrency()
  const { t }      = useTranslation()

  // Bloquer le scroll quand ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div className={`${s.overlay} ${isOpen ? s.open : ''}`} onClick={() => setIsOpen(false)}>
      <aside className={s.drawer} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={s.header}>
          <div>
            <h2 className={s.title}>{t('cart.title')}</h2>
            <p className={s.count}>{items.length} {items.length > 1 ? t('catalogue.products_plural') : t('catalogue.products')}</p>
          </div>
          <button className={s.closeBtn} onClick={() => setIsOpen(false)} aria-label={t('common.close')}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className={s.items}>
          {items.length === 0 ? (
            <div className={s.emptyState}>
              <span className={s.emptyGlyph}>◈</span>
              <p className={s.emptyText}>{t('cart.empty')}</p>
              <p className={s.emptySub}>{t('cart.emptyDesc')}</p>
              <button
                className="btn-ghost"
                onClick={() => setIsOpen(false)}
                style={{ marginTop: 'var(--space-4)' }}
              >
                {t('home.explore')}
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={s.item}>
                {/* Image */}
                {item.cover_url ? (
                  <img src={item.cover_url} alt={item.name_fr} className={s.itemImg} />
                ) : (
                  <div className={s.itemImgPlaceholder}>◈</div>
                )}

                {/* Info */}
                <div className={s.itemInfo}>
                  {item.category_name_fr && (
                    <p className={s.itemCat}>{item.category_name_fr}</p>
                  )}
                  <h4 className={s.itemName}>{item.name_fr}</h4>
                  <p className={s.itemPrice}>{format(item.price)}</p>

                  {/* Quantité */}
                  <div className={s.itemQty}>
                    <button
                      className={s.itemQtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={11} />
                    </button>
                    <span className={s.itemQtyVal}>{item.quantity}</span>
                    <button
                      className={s.itemQtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Supprimer */}
                <button
                  className={s.removeBtn}
                  onClick={() => removeItem(item.id)}
                  aria-label="Supprimer"
                >
                  <Trash2 size={15} strokeWidth={1.5} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={s.footer}>
            <div className={s.subtotal}>
              <span className={s.subtotalLabel}>{t('cart.total')}</span>
              <span className={s.subtotalAmount}>{format(totalPrice)}</span>
            </div>

            <Link
              to="/checkout"
              className={`btn-primary ${s.checkoutBtn}`}
              onClick={() => setIsOpen(false)}
            >
              {t('cart.checkout')}
            </Link>

            <button
              className={`btn-ghost ${s.continueBtn}`}
              onClick={() => setIsOpen(false)}
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
