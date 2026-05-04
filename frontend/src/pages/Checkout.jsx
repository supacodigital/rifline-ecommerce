import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MapPin, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCart }     from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import api from '../api/axios'
import SumupPaymentForm from '../components/ui/SumupPaymentForm'
import s from './Checkout.module.css'

const EMPTY_ADDRESS = {
  shipping_first_name: '', shipping_last_name: '',
  shipping_address1: '',   shipping_address2: '',
  shipping_city: '',       shipping_postal: '',
  shipping_state: '',      shipping_country: 'FR',
  shipping_phone: '',
}

const FALLBACK_RATES = [
  { rate_id: 'mondial_relay',  carrier: 'Mondial Relay', service: 'Point Relais',            price_eur: 3.49,  estimated_days: 4, is_relay: true },
  { rate_id: 'colissimo_home', carrier: 'Colissimo',     service: 'Livraison à domicile',    price_eur: 4.99,  estimated_days: 3 },
  { rate_id: 'chronopost',     carrier: 'Chronopost',    service: 'Express J+1',             price_eur: 9.90,  estimated_days: 1 },
  { rate_id: 'dpd_home',       carrier: 'DPD',           service: 'Livraison à domicile',    price_eur: 5.49,  estimated_days: 3 },
  { rate_id: 'ups_standard',   carrier: 'UPS',           service: 'Standard International', price_eur: 12.90, estimated_days: 5 },
  { rate_id: 'dhl_express',    carrier: 'DHL',           service: 'Express International',  price_eur: 19.90, estimated_days: 2 },
]

// Détermine si un tarif sélectionné nécessite le choix d'un point relais Mondial Relay
function isMondialRelayRate(rate) {
  if (!rate) return false
  return (
    rate.is_relay ||
    (rate.carrier?.toLowerCase().includes('mondial') || rate.service?.toLowerCase().includes('mondial relay'))
  )
}

export default function Checkout() {
  // step : 0=adresse, 1=livraison, 2=point relais (si Mondial Relay), 3=paiement
  const [step,           setStep]           = useState(0)
  const [address,        setAddress]        = useState(EMPTY_ADDRESS)
  const [shippingRates,  setShippingRates]  = useState([])
  const [selectedRate,   setSelectedRate]   = useState(null)
  const [servicePoints,  setServicePoints]  = useState([])
  const [selectedPoint,  setSelectedPoint]  = useState(null)
  const [loadingPoints,  setLoadingPoints]  = useState(false)
  const [couponCode,     setCouponCode]     = useState('')
  const [couponResult,   setCouponResult]   = useState(null)
  const [checkoutId,     setCheckoutId]     = useState(null)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState('')

  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const { format, current: currencyCode, rate: currencyRate } = useCurrency()
  const { t }                             = useTranslation()

  // Étapes visibles dans l'indicateur (la sous-étape point relais est transparente)
  const STEPS = [t('checkout.address'), t('checkout.shipping'), t('checkout.payment')]

  // Index affiché dans le stepper : step 2 (point relais) = toujours "livraison" (step 1)
  const stepperIndex = step === 2 ? 1 : step === 3 ? 2 : step

  function handleAddressChange(e) {
    setAddress(a => ({ ...a, [e.target.name]: e.target.value }))
  }

  // Étape 0 → 1 : récupérer les tarifs de livraison
  async function handleAddressSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Poids par défaut 300g si non renseigné sur le produit
      const weightGrams = items.reduce((acc, i) => acc + (i.weight_grams || 300) * i.quantity, 0)
      const res = await api.get('/shipengine/rates', {
        params: {
          country_code: address.shipping_country,
          postal_code:  address.shipping_postal,
          city:         address.shipping_city,
          weight_grams: weightGrams,
        },
      })
      setShippingRates(res.data.rates?.length ? res.data.rates : FALLBACK_RATES)
    } catch {
      setShippingRates(FALLBACK_RATES)
    } finally {
      setLoading(false)
      setStep(1)
    }
  }

  // Étape 1 → 2 ou 3 selon le transporteur choisi
  async function handleShippingContinue() {
    if (!selectedRate) { setError(t('checkout.chooseShipping')); return }
    setError('')

    const rate = shippingRates.find(r => r.rate_id === selectedRate)

    // Si Mondial Relay → charger les points relais et aller à l'étape 2
    if (isMondialRelayRate(rate)) {
      setLoadingPoints(true)
      try {
        const res = await api.get('/shipengine/service-points', {
          params: {
            country_code: address.shipping_country,
            postal_code:  address.shipping_postal,
            city:         address.shipping_city,
          },
        })
        setServicePoints(res.data.service_points || [])
      } catch {
        setServicePoints([])
      } finally {
        setLoadingPoints(false)
        setStep(2)
      }
    } else {
      // Autre transporteur → aller directement au paiement
      await goToPayment(rate, null)
    }
  }

  // Étape 2 → 3 : point relais sélectionné → créer commande + PaymentIntent
  async function handleRelayConfirm() {
    if (!selectedPoint) { setError(t('checkout.chooseRelay')); return }
    const rate = shippingRates.find(r => r.rate_id === selectedRate)
    await goToPayment(rate, selectedPoint)
  }

  // Création de la commande + PaymentIntent (commun aux deux flux)
  async function goToPayment(rate, servicePoint) {
    setLoading(true)
    setError('')
    try {
      const orderRes = await api.post('/orders', {
        shipping:              address,
        items:                 items.map(i => ({ product_id: i.id, variant_id: i.variant_id ?? null, quantity: i.quantity })),
        coupon_code:           couponResult ? couponCode : null,
        shipping_cost_eur:     rate?.price_eur || 0,
        shipping_method_id:    rate?.rate_id || null,
        service_point_id:      servicePoint?.id   || null,
        service_point_name:    servicePoint?.name || null,
        service_point_address: servicePoint
          ? `${servicePoint.street}, ${servicePoint.postal_code} ${servicePoint.city}`
          : null,
        currency_code:         currencyCode,
        currency_rate:         currencyRate,
      })

      const checkoutRes = await api.post('/sumup/checkout', {
        order_id: orderRes.data.order.id,
      })

      setCheckoutId(checkoutRes.data.checkout_id)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  async function handleCoupon() {
    if (!couponCode) return
    setError('')
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, subtotal: totalPrice })
      setCouponResult(res.data)
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'))
      setCouponResult(null)
    }
  }

  function handlePaymentSuccess() {
    // Ne pas vider le panier ici — attendre la confirmation serveur dans /confirmation
    // clearCart() est appelé dans Confirmation.jsx uniquement si status === 'paid'
    navigate(`/confirmation?checkout_id=${checkoutId}`)
  }

  const shippingCost = shippingRates.find(r => r.rate_id === selectedRate)?.price_eur || 0
  const discount     = couponResult?.discount || 0
  const total        = totalPrice - discount + shippingCost

  return (
    <div className={s.page}>
      <div className={s.inner}>
        <div className={s.steps}>

          {/* Indicateur d'étapes */}
          <div className={s.stepNav}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: 'contents' }}>
                <div className={`${s.stepItem} ${i === stepperIndex ? s.active : ''} ${i < stepperIndex ? s.done : ''}`}>
                  <span className={s.stepNum}>{i < stepperIndex ? <Check size={12} /> : i + 1}</span>
                  <span>{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={s.stepDivider} />}
              </div>
            ))}
          </div>

          {error && <div className={s.errorBanner}>{error}</div>}

          {/* ===== ÉTAPE 0 — ADRESSE ===== */}
          {step === 0 && (
            <form onSubmit={handleAddressSubmit}>
              <h2 className={s.sectionTitle}>{t('checkout.shippingAddress')}</h2>
              <div className={s.formGrid}>
                {[
                  { name: 'shipping_first_name', label: t('checkout.firstName'),   required: true },
                  { name: 'shipping_last_name',  label: t('checkout.lastName'),    required: true },
                  { name: 'shipping_address1',   label: t('checkout.addressLine'), required: true, span: true },
                  { name: 'shipping_address2',   label: t('checkout.complement') },
                  { name: 'shipping_city',       label: t('checkout.city'),        required: true },
                  { name: 'shipping_postal',     label: t('checkout.postal'),      required: true },
                ].map(f => (
                  <div key={f.name} className={`${s.formField} ${f.span ? s.span2 : ''}`}>
                    <label className={s.formLabel}>{f.label}</label>
                    <input name={f.name} className="input" value={address[f.name]} onChange={handleAddressChange} required={f.required} />
                  </div>
                ))}
                <div className={s.formField}>
                  <label className={s.formLabel}>{t('checkout.country')}</label>
                  <select name="shipping_country" className="input" value={address.shipping_country} onChange={handleAddressChange}>
                    {[['FR','countries.FR'],['BE','countries.BE'],['CH','countries.CH'],['MA','countries.MA'],['DZ','countries.DZ'],['TN','countries.TN'],['GB','countries.GB'],['DE','countries.DE']].map(([v,key]) => (
                      <option key={v} value={v}>{t(key)}</option>
                    ))}
                  </select>
                </div>
                <div className={s.formField}>
                  <label className={s.formLabel}>{t('checkout.phone')}</label>
                  <input name="shipping_phone" className="input" value={address.shipping_phone} onChange={handleAddressChange} />
                </div>
              </div>
              <div className={s.formActions}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? t('checkout.loading') : t('checkout.continue')}
                </button>
              </div>
            </form>
          )}

          {/* ===== ÉTAPE 1 — LIVRAISON ===== */}
          {step === 1 && (
            <div>
              <h2 className={s.sectionTitle}>{t('checkout.shippingMethod')}</h2>
              <div className={s.shippingOptions}>
                {shippingRates.map(rate => (
                  <div
                    key={rate.rate_id}
                    className={`${s.shippingOption} ${selectedRate === rate.rate_id ? s.selected : ''}`}
                    onClick={() => setSelectedRate(rate.rate_id)}
                  >
                    <div className={s.shippingOptionLeft}>
                      <div className={s.radioCircle}><div className={s.radioInner} /></div>
                      <div>
                        <p className={s.shippingCarrier}>{rate.carrier} — {rate.service}</p>
                        {rate.estimated_days && (
                          <p className={s.shippingDays}>{rate.estimated_days} {rate.estimated_days > 1 ? t('checkout.workingDays') : t('checkout.workingDay')}</p>
                        )}
                      </div>
                    </div>
                    <span className={s.shippingPrice}>{format(rate.price_eur)}</span>
                  </div>
                ))}
              </div>
              <div className={s.formActions}>
                <button className="btn-outline" onClick={() => setStep(0)}>{t('checkout.back')}</button>
                <button className="btn-primary" onClick={handleShippingContinue} disabled={loading || loadingPoints}>
                  {loadingPoints ? t('checkout.loading') : loading ? t('checkout.preparing') : t('checkout.continue')}
                </button>
              </div>
            </div>
          )}

          {/* ===== ÉTAPE 2 — POINT RELAIS MONDIAL RELAY ===== */}
          {step === 2 && (
            <div>
              <h2 className={s.sectionTitle}>{t('checkout.chooseRelayPoint')}</h2>
              <p className={s.paymentInfo}>{t('checkout.relayPointsNear')} {address.shipping_postal} {address.shipping_city}</p>

              {servicePoints.length === 0 ? (
                <p className={s.emptyRelays}>{t('checkout.noRelayPoints')}</p>
              ) : (
                <div className={s.relayList}>
                  {servicePoints.map(point => (
                    <div
                      key={point.id}
                      className={`${s.relayItem} ${selectedPoint?.id === point.id ? s.selected : ''}`}
                      onClick={() => setSelectedPoint(point)}
                    >
                      <div className={s.relayItemLeft}>
                        <div className={s.radioCircle}><div className={s.radioInner} /></div>
                        <div className={s.relayInfo}>
                          <p className={s.relayName}>{point.name}</p>
                          <p className={s.relayAddress}>
                            <MapPin size={12} />
                            {point.street}, {point.postal_code} {point.city}
                            {point.distance && <span className={s.relayDistance}> · {(point.distance / 1000).toFixed(1)} km</span>}
                          </p>
                          {point.opening_times && (
                            <div className={s.relayHours}>
                              <Clock size={11} />
                              <div className={s.relayHoursGrid}>
                                {point.opening_times.map(h => (
                                  <span key={h.day} className={s.relayHoursRow}>
                                    <span className={s.relayDay}>{h.day}</span>
                                    <span className={s.relaySlots}>{h.slots}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={s.formActions}>
                <button className="btn-outline" onClick={() => setStep(1)}>{t('checkout.back')}</button>
                <button className="btn-primary" onClick={handleRelayConfirm} disabled={loading || !selectedPoint}>
                  {loading ? t('checkout.preparing') : t('checkout.continue')}
                </button>
              </div>
            </div>
          )}

          {/* ===== ÉTAPE 3 — PAIEMENT ===== */}
          {step === 3 && checkoutId && (
            <div>
              <h2 className={s.sectionTitle}>{t('checkout.securePayment')}</h2>
              {selectedPoint && (
                <div className={s.relayRecap}>
                  <MapPin size={14} />
                  <span>{t('checkout.deliveryTo')} <strong>{selectedPoint.name}</strong> — {selectedPoint.street}, {selectedPoint.postal_code} {selectedPoint.city}</span>
                </div>
              )}
              <p className={s.paymentInfo}>{t('checkout.sumupInfo')}</p>
              <SumupPaymentForm
                checkoutId={checkoutId}
                total={total}
                format={format}
                onBack={() => setStep(selectedPoint ? 2 : 1)}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          )}

        </div>

        {/* ===== RÉCAPITULATIF ===== */}
        <aside className={s.summary}>
          <h2 className={s.summaryTitle}>{t('checkout.summary')}</h2>
          <div className={s.summaryItems}>
            {items.map(item => (
              <div key={item.id} className={s.summaryItem}>
                <div className={s.summaryItemImgWrap}>
                  {item.cover_url
                    ? <img src={item.cover_url} alt={item.name_fr} className={s.summaryItemImg} />
                    : null
                  }
                </div>
                <div>
                  <p className={s.summaryItemName}>{item.name_fr}</p>
                  <p className={s.summaryItemQty}>× {item.quantity}</p>
                </div>
                <span className={s.summaryItemPrice}>{format(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className={s.couponRow}>
            <input
              className={s.couponInput}
              placeholder={t('checkout.promoCode')}
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCoupon()}
            />
            <button className={s.couponBtn} onClick={handleCoupon}>{t('checkout.apply')}</button>
          </div>
          {couponResult && (
            <p className={s.couponSuccess}>− {format(couponResult.discount)} de réduction</p>
          )}

          <div className={s.summaryLine}><span>{t('checkout.subtotal')}</span><span>{format(totalPrice)}</span></div>
          {discount > 0 && (
            <div className={`${s.summaryLine} ${s.summaryDiscount}`}>
              <span>{t('checkout.discount')}</span><span>− {format(discount)}</span>
            </div>
          )}
          <div className={s.summaryLine}>
            <span>{t('checkout.deliveryCost')}</span>
            <span>{shippingCost > 0 ? format(shippingCost) : '—'}</span>
          </div>
          <div className={s.summaryTotal}>
            <span className={s.summaryTotalLabel}>{t('checkout.total')}</span>
            <span className={s.summaryTotalAmount}>{format(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
