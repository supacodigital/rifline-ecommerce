import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import s from './SumupPaymentForm.module.css'

const SUMUP_SDK_URL = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'

// Charge le SDK SumUp une seule fois
function loadSumupSdk() {
  return new Promise((resolve, reject) => {
    if (window.SumUpCard) { resolve(); return; }
    const script = document.createElement('script')
    script.src = SUMUP_SDK_URL
    script.onload  = resolve
    script.onerror = () => reject(new Error('Impossible de charger le SDK SumUp'))
    document.head.appendChild(script)
  })
}

export default function SumupPaymentForm({ checkoutId, total, format, onBack, onSuccess }) {
  const mountRef = useRef(null)
  const cardRef  = useRef(null)
  const [sdkError, setSdkError] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    if (!checkoutId || !mountRef.current) return

    let mounted = true

    async function init() {
      try {
        await loadSumupSdk()
        if (!mounted) return

        cardRef.current = window.SumUpCard.mount({
          id:           'sumup-card',
          checkoutId,
          onResponse: (type, body) => {
            if (!mounted) return

            if (type === 'success') {
              onSuccess?.()
            } else if (type === 'error') {
              setSdkError(body?.message || t('common.error'))
            }
            // 'sent-payment' et 'auth-screen' sont des états intermédiaires — on ignore
          },
          onLoad: () => {
            // Widget prêt — rien à faire
          },
        })
      } catch (err) {
        if (mounted) setSdkError(err.message)
      }
    }

    init()

    return () => {
      mounted = false
      // Démonter le widget proprement si l'API le permet
      try { cardRef.current?.unmount?.() } catch {}
    }
  }, [checkoutId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={s.wrapper}>
      {sdkError && <div className={s.error}>{sdkError}</div>}

      {/* Le SDK SumUp monte le widget de paiement dans ce div via l'id "sumup-card" */}
      <div id="sumup-card" ref={mountRef} className={s.cardMount} />

      <div className={s.actions}>
        <button type="button" className="btn-outline" onClick={onBack}>
          {t('checkout.back')}
        </button>
        <p className={s.totalLine}>{t('checkout.total')} : <strong>{format(total)}</strong></p>
      </div>
    </div>
  )
}
