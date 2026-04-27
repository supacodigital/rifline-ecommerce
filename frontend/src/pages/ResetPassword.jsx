import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api/axios'
import s from './Login.module.css'

export default function ResetPassword() {
  const [password,  setPassword]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState('')
  const { t }            = useTranslation()
  const [searchParams]   = useSearchParams()
  const navigate         = useNavigate()
  const token = searchParams.get('token')

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) {
      setError(t('account.minChars'))
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
      // Rediriger vers la connexion après 3 secondes
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch (err) {
      setError(err.response?.data?.error || t('auth.resetInvalid'))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className={s.page}>
        <div className={s.visual}>
          <div className={s.visualPattern} />
          <span className={s.visualGlyph}>ر</span>
        </div>
        <div className={s.form}>
          <div className={s.formInner}>
            <Link to="/" className={s.brandLink}>Rif <span>Line</span></Link>
            <p className={s.error} style={{ marginTop: 'var(--space-8)' }}>{t('auth.resetInvalid')}</p>
            <p className={s.altLink} style={{ marginTop: 'var(--space-4)' }}>
              <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
            </p>
          </div>
        </div>
      </div>
    )
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

          <h1 className={s.title}>{t('auth.resetTitle')}</h1>
          <p className={s.subtitle}>{t('auth.resetSub')}</p>

          {done ? (
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
              {t('auth.resetSuccess')}
            </p>
          ) : (
            <>
              {error && <div className={s.error}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className={s.fields}>
                  <div>
                    <label className={s.label} htmlFor="password">{t('auth.newPassword')}</label>
                    <input
                      id="password"
                      type="password"
                      className="input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      minLength={8}
                      required
                      autoFocus
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>
                      {t('account.minChars')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn-primary ${s.submitBtn}`}
                  disabled={loading}
                >
                  {loading ? t('auth.resetSaving') : t('auth.resetSubmit')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
