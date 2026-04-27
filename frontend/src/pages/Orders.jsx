import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import { useCurrency } from '../context/CurrencyContext'

const STATUS_COLORS = {
  pending:    '#c9a96e',
  paid:       '#6db87a',
  processing: '#6db87a',
  shipped:    '#6db87a',
  delivered:  '#6db87a',
  cancelled:  '#e05c5c',
  refunded:   '#e05c5c',
}

export default function Orders() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const { format } = useCurrency()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/orders/me')
      .then(res => setOrders(res.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: 'calc(var(--header-h) + var(--space-16))', minHeight: '100vh', paddingBottom: 'var(--space-24)' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <p className="section-label">{t('orders.myAccount')}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 300, marginBottom: 'var(--space-12)' }}>{t('orders.title')}</h1>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 90, background: 'var(--color-surface)', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-surface) 25%, var(--color-bg-3) 50%, var(--color-surface) 75%)' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-24) 0', color: 'var(--color-text-muted)' }}>
            <Package size={48} strokeWidth={1} style={{ margin: '0 auto var(--space-6)', color: 'rgba(201,169,110,0.3)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>{t('orders.empty')}</p>
            <Link to="/catalogue" className="btn-outline">{t('orders.discoverCollection')}</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {orders.map(order => {
              const color = STATUS_COLORS[order.status] || 'var(--color-text-muted)'
              const statusLabel = t(`orders.status.${order.status}`, { defaultValue: order.status })
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/commandes/${order.id}`)}
                  style={{ padding: 'var(--space-6)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-4)', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500, letterSpacing: '0.04em', marginBottom: 'var(--space-2)' }}>
                      {order.order_number}
                    </p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
                      {new Date(order.created_at).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }}>
                        {format(order.total_eur)}
                      </p>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color }}>
                        {statusLabel}
                      </span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
