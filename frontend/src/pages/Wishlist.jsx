import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import { useCart }     from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem }  = useCart()
  const { format }   = useCurrency()
  const { toggle }   = useWishlist()
  const { t }        = useTranslation()

  useEffect(() => {
    api.get('/wishlists')
      .then(res => setItems(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleRemove(item) {
    // Utilise toggle du contexte pour que les cœurs sur les cartes se mettent à jour
    await toggle({ id: item.product_id })
    setItems(prev => prev.filter(i => i.product_id !== item.product_id))
  }

  return (
    <div style={{ paddingTop: 'calc(var(--header-h) + var(--space-16))', minHeight: '100vh', paddingBottom: 'var(--space-24)' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <p className="section-label">{t('wishlist.myAccount')}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 300, marginBottom: 'var(--space-12)' }}>{t('wishlist.title')}</h1>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-3)' }}>
            {[1,2,3].map(i => <div key={i} style={{ aspectRatio:'3/4', background: 'var(--color-surface)' }} />)}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-24) 0', color: 'var(--color-text-muted)' }}>
            <Heart size={48} strokeWidth={1} style={{ margin: '0 auto var(--space-6)', color: 'rgba(201,169,110,0.3)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>{t('wishlist.empty')}</p>
            <Link to="/catalogue" className="btn-outline">{t('wishlist.discoverCollection')}</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-4)' }}>
            {items.map(item => (
              <div key={item.id} style={{ position: 'relative', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <Link to={`/produit/${item.slug}`}>
                  <div style={{ aspectRatio: '3/4', background: 'var(--color-bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.cover_url
                      ? <img src={item.cover_url} alt={item.name_fr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'rgba(201,169,110,0.15)' }}>◈</span>
                    }
                  </div>
                  <div style={{ padding: 'var(--space-4)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 300, marginBottom: 'var(--space-1)' }}>{item.name_fr}</p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)' }}>{format(item.price)}</p>
                  </div>
                </Link>
                <div style={{ display: 'flex', gap: 'var(--space-2)', padding: '0 var(--space-4) var(--space-4)' }}>
                  <button className="btn-primary" style={{ flex: 1, padding: 'var(--space-3)' }}
                    onClick={() => addItem({ id: item.product_id, name_fr: item.name_fr, price: item.price, cover_url: item.cover_url, slug: item.slug })}
                  >
                    {t('wishlist.add')}
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    style={{ width: 40, height: 40, border: '1px solid var(--color-border)', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-error)', transition: 'border-color 200ms' }}
                  >
                    <Heart size={15} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
