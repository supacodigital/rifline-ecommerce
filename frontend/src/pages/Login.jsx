import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import s from './Login.module.css'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const location    = useLocation()
  const { t }       = useTranslation()

  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || t('auth.invalidCredentials'))
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

          <h1 className={s.title}>{t('auth.login')}</h1>
          <p className={s.subtitle}>{t('auth.loginSub')}</p>

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
              <div>
                <label className={s.label} htmlFor="password">{t('auth.password')}</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn-primary ${s.submitBtn}`}
              disabled={loading}
            >
              {loading ? t('auth.loading') : t('auth.submit')}
            </button>
          </form>

          <p className={s.altLink} style={{ marginBottom: 'var(--space-3)' }}>
            <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
          </p>

          <p className={s.altLink}>
            {t('auth.noAccount')} <Link to="/register">{t('auth.createAccount')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
