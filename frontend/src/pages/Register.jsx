import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import s from './Login.module.css'

export default function Register() {
  const [form,    setForm]    = useState({ email: '', password: '', first_name: '', last_name: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate     = useNavigate()
  const { t }        = useTranslation()

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError(t('account.minChars')); return }
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      <div className={s.visual}>
        <div className={s.visualPattern} />
        <span className={s.visualGlyph}>ل</span>
        <div className={s.visualQuote}>
          <p>{t('auth.quote')}</p>
        </div>
      </div>

      <div className={s.form}>
        <div className={s.formInner}>
          <Link to="/" className={s.brandLink}>Rif <span>Line</span></Link>

          <h1 className={s.title}>{t('auth.register')}</h1>
          <p className={s.subtitle}>{t('auth.registerSub')}</p>

          {error && <div className={s.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={s.fields}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div>
                  <label className={s.label} htmlFor="first_name">{t('auth.firstName')}</label>
                  <input
                    id="first_name" name="first_name" type="text"
                    className="input" value={form.first_name}
                    onChange={handleChange} required
                  />
                </div>
                <div>
                  <label className={s.label} htmlFor="last_name">{t('auth.lastName')}</label>
                  <input
                    id="last_name" name="last_name" type="text"
                    className="input" value={form.last_name}
                    onChange={handleChange} required
                  />
                </div>
              </div>
              <div>
                <label className={s.label} htmlFor="email">{t('auth.email')}</label>
                <input
                  id="email" name="email" type="email"
                  className="input" value={form.email}
                  onChange={handleChange} required
                />
              </div>
              <div>
                <label className={s.label} htmlFor="password">{t('auth.password')}</label>
                <input
                  id="password" name="password" type="password"
                  className="input" value={form.password}
                  onChange={handleChange} required
                />
              </div>
            </div>

            <button type="submit" className={`btn-primary ${s.submitBtn}`} disabled={loading}>
              {loading ? t('common.loading') : t('auth.registerSubmit')}
            </button>
          </form>

          <p className={s.altLink}>
            {t('auth.alreadyAccount')} <Link to="/login">{t('auth.submit')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
