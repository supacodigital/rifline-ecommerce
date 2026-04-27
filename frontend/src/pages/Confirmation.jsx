import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import api from '../api/axios'
import s from './Confirmation.module.css'

export default function Confirmation() {
  const [searchParams]        = useSearchParams()
  const [status, setStatus]   = useState('loading') // loading | success | processing | error
  const [message, setMessage] = useState('')
  const { clearCart }         = useCart()
  const { t }                 = useTranslation()

  useEffect(() => {
    // Accepte ?checkout_id=xxx (depuis React navigate) ou ?order=ORDER_NUMBER (depuis return_url SumUp)
    const checkoutId  = searchParams.get('checkout_id')
    const orderNumber = searchParams.get('order')

    if (!checkoutId && !orderNumber) {
      setStatus('error')
      setMessage('Paramètres de confirmation manquants')
      return
    }

    async function checkStatus() {
      try {
        const params = checkoutId ? { checkout_id: checkoutId } : { order_number: orderNumber }
        console.log('[Confirmation] appel /sumup/confirm avec', params)
        const res = await api.get('/sumup/confirm', { params })
        console.log('[Confirmation] réponse:', res.data)
        const payStatus = res.data?.status

        if (payStatus === 'paid') {
          clearCart()
          setStatus('success')
        } else if (payStatus === 'PENDING' || payStatus === 'pending') {
          setStatus('processing')
        } else {
          setStatus('error')
          setMessage(`Statut inattendu : ${payStatus}`)
        }
      } catch (err) {
        const msg = err.response?.data?.error || ''
        setMessage(msg)
        setStatus('error')
      }
    }

    checkStatus()
  }, []) // eslint-disable-line

  if (status === 'loading') {
    return (
      <div className={s.page}>
        <div className={s.spinner} />
      </div>
    )
  }

  const configs = {
    success: {
      icon:  <CheckCircle size={56} strokeWidth={1} />,
      color: 'var(--color-success)',
      title: t('confirmation.success'),
      sub:   t('confirmation.successDesc'),
    },
    processing: {
      icon:  <Clock size={56} strokeWidth={1} />,
      color: 'var(--color-gold)',
      title: t('confirmation.processing'),
      sub:   t('confirmation.processingDesc'),
    },
    error: {
      icon:  <XCircle size={56} strokeWidth={1} />,
      color: 'var(--color-error)',
      title: t('confirmation.error'),
      sub:   message || t('confirmation.errorDesc'),
    },
  }

  const cfg = configs[status]

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.icon} style={{ color: cfg.color }}>{cfg.icon}</div>
        <h1 className={s.title}>{cfg.title}</h1>
        <p className={s.sub}>{cfg.sub}</p>

        <div className={s.actions}>
          {status === 'success' || status === 'processing' ? (
            <>
              <Link to="/commandes" className="btn-primary">{t('confirmation.viewOrders')}</Link>
              <Link to="/catalogue" className="btn-outline">{t('confirmation.continueShopping')}</Link>
            </>
          ) : (
            <>
              <Link to="/checkout" className="btn-primary">{t('confirmation.retry')}</Link>
              <Link to="/" className="btn-outline">{t('confirmation.backHome')}</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
