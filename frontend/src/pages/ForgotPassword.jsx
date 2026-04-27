import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import s from './Login.module.css'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')
  const { t } = useTranslation()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setDone(true)
    } catch {
      setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      {/* Visuel */}
      <div className={s.visual}>
        <div className={s.visualPattern} />
        <span className={s.visualGlyph}>ر</span>
        <div className={s.visualQuote}>
          <p>{t('auth.quote')}</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className={s.form}>
        <div className={s.formInner}>
          <Link to="/" className={s.brandLink}>Rif <span>Line</span></Link>

          <h1 className={s.title}>{t('auth.forgotTitle')}</h1>
          <p className={s.subtitle}>{t('auth.forgotSub')}</p>

          {done ? (
            <>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
                {t('auth.forgotSuccess')}
              </p>
              <Link to="/login" className={s.altLink} style={{ display: 'block', textAlign: 'center' }}>
                {t('auth.backToLogin')}
              </Link>
            </>
          ) : (
            <>
              {error && <div className={s.error}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className={s.fields}>
                  <div>
                    <label className={s.label} htmlFor="email">{t('auth.email')}</label>
                    <input
                      id="email"
                      type="email"
                      className="input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn-primary ${s.submitBtn}`}
                  disabled={loading}
                >
                  {loading ? t('auth.forgotSending') : t('auth.forgotSubmit')}
                </button>
              </form>

              <p className={s.altLink}>
                <Link to="/login">{t('auth.backToLogin')}</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
