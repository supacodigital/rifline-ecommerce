import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import { useCurrency } from '../context/CurrencyContext'
import s from './OrderDetail.module.css'

const STATUS_COLORS = {
  pending:    '#c9a96e',
  paid:       '#6db87a',
  processing: '#6db87a',
  shipped:    '#6db87a',
  delivered:  '#6db87a',
  cancelled:  '#e05c5c',
  refunded:   '#e05c5c',
}

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { format } = useCurrency()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data.order))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className={s.page}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className={s.skeleton} />
        <div className={s.skeleton} style={{ height: 120 }} />
        <div className={s.skeleton} style={{ height: 200 }} />
      </div>
    </div>
  )

  if (error || !order) return (
    <div className={s.page}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/commandes" className={s.back}><ArrowLeft size={16} /> {t('orders.title')}</Link>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-8)' }}>Commande introuvable.</p>
      </div>
    </div>
  )

  const statusColor = STATUS_COLORS[order.status] || 'var(--color-text-muted)'
  const statusLabel = t(`orders.status.${order.status}`, { defaultValue: order.status })
  const dateStr = new Date(order.created_at).toLocaleDateString(
    i18n.language === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div className={s.page}>
      <div className="container" style={{ maxWidth: 800 }}>

        <Link to="/commandes" className={s.back}>
          <ArrowLeft size={16} />
          {t('orders.title')}
        </Link>

        {/* En-tête commande */}
        <div className={s.header}>
          <div>
            <p className="section-label">{t('orders.myAccount')}</p>
            <h1 className={s.orderNumber}>{order.order_number}</h1>
            <p className={s.date}>{dateStr}</p>
          </div>
          <span className={s.statusBadge} style={{ color: statusColor, borderColor: statusColor }}>
            {statusLabel}
          </span>
        </div>

        {/* Produits */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>
            <Package size={16} /> {t('orders.items', { defaultValue: 'Articles' })}
          </h2>
          <div className={s.itemsList}>
            {(order.items || []).map(item => (
              <div key={item.id} className={s.item}>
                <div className={s.itemInfo}>
                  <p className={s.itemName}>{item.product_name}</p>
                  {item.product_sku && <p className={s.itemSku}>Réf. {item.product_sku}</p>}
                </div>
                <div className={s.itemRight}>
                  <span className={s.itemQty}>× {item.quantity}</span>
                  <span className={s.itemPrice}>{format(item.unit_price)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Totaux */}
        <section className={s.section}>
          <div className={s.totals}>
            <div className={s.totalRow}>
              <span>{t('checkout.subtotal')}</span>
              <span>{format(order.subtotal_eur)}</span>
            </div>
            {parseFloat(order.discount_eur) > 0 && (
              <div className={s.totalRow}>
                <span>{t('checkout.discount')}{order.coupon_code ? ` (${order.coupon_code})` : ''}</span>
                <span style={{ color: '#6db87a' }}>− {format(order.discount_eur)}</span>
              </div>
            )}
            <div className={s.totalRow}>
              <span>{t('checkout.deliveryCost')}</span>
              <span>{parseFloat(order.shipping_cost_eur) > 0 ? format(order.shipping_cost_eur) : '—'}</span>
            </div>
            <div className={`${s.totalRow} ${s.totalFinal}`}>
              <span>{t('checkout.total')}</span>
              <span>{format(order.total_eur)}</span>
            </div>
          </div>
        </section>

        {/* Adresse livraison */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>
            <MapPin size={16} /> {t('checkout.shippingAddress')}
          </h2>
          <div className={s.address}>
            <p>{order.shipping_first_name} {order.shipping_last_name}</p>
            <p>{order.shipping_address1}</p>
            {order.shipping_address2 && <p>{order.shipping_address2}</p>}
            <p>{order.shipping_postal} {order.shipping_city}</p>
            <p>{order.shipping_country}</p>
            {order.shipping_phone && <p>{order.shipping_phone}</p>}
          </div>
        </section>

        {/* Suivi expédition */}
        {order.tracking_number && (
          <section className={s.section}>
            <h2 className={s.sectionTitle}>
              <Truck size={16} /> {t('orders.tracking', { defaultValue: 'Suivi' })}
            </h2>
            <div className={s.tracking}>
              <p>{t('orders.trackingNumber', { defaultValue: 'Numéro de suivi' })} : <strong>{order.tracking_number}</strong></p>
              {order.carrier && <p>{t('orders.carrier', { defaultValue: 'Transporteur' })} : {order.carrier}</p>}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
