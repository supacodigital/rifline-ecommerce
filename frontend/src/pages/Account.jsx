import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, Heart, LogOut, ChevronRight, Plus, Pencil, Trash2, X, MapPin, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import s from './Account.module.css'

const EMPTY_ADDR = {
  label: '', first_name: '', last_name: '',
  address_line1: '', address_line2: '',
  city: '', postal_code: '', state: '',
  country_code: 'FR', phone: '', is_default: false,
}

const COUNTRIES = [
  ['FR','France'],['BE','Belgique'],['CH','Suisse'],
  ['MA','Maroc'],['DZ','Algérie'],['TN','Tunisie'],
  ['GB','Royaume-Uni'],['DE','Allemagne'],
]

const LABEL = { fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', display: 'block' }

export default function Account() {
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const { t }             = useTranslation()

  // Profil
  const [form,    setForm]    = useState({ first_name: '', last_name: '', phone: '' })
  const [pwForm,  setPwForm]  = useState({ current_password: '', new_password: '' })
  const [msg,     setMsg]     = useState('')
  const [error,   setError]   = useState('')

  // Adresses
  const [addresses,  setAddresses]  = useState([])
  const [addrModal,  setAddrModal]  = useState(null)  // null | 'create' | address object
  const [addrForm,   setAddrForm]   = useState(EMPTY_ADDR)
  const [addrSaving, setAddrSaving] = useState(false)
  const [addrError,  setAddrError]  = useState('')

  useEffect(() => {
    if (user) setForm({ first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '' })
  }, [user])

  useEffect(() => {
    api.get('/users/me/addresses')
      .then(res => setAddresses(res.data || []))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  async function handleProfile(e) {
    e.preventDefault()
    setMsg(''); setError('')
    try {
      await api.put('/users/me', form)
      setMsg(t('account.profileUpdated'))
    } catch (err) { setError(err.response?.data?.error || t('common.error')) }
  }

  async function handlePassword(e) {
    e.preventDefault()
    setMsg(''); setError('')
    if (pwForm.new_password.length < 8) { setError(t('account.minChars')); return }
    try {
      await api.put('/users/me/password', pwForm)
      setMsg(t('account.passwordChanged'))
      setPwForm({ current_password: '', new_password: '' })
    } catch (err) { setError(err.response?.data?.error || t('common.error')) }
  }

  function openCreateAddr() {
    setAddrForm(EMPTY_ADDR)
    setAddrError('')
    setAddrModal('create')
  }

  function openEditAddr(addr) {
    setAddrForm({ ...addr, is_default: !!addr.is_default })
    setAddrError('')
    setAddrModal(addr)
  }

  async function handleAddrSave(e) {
    e.preventDefault()
    setAddrSaving(true); setAddrError('')
    try {
      if (addrModal === 'create') {
        const res = await api.post('/users/me/addresses', addrForm)
        // Si nouvelle adresse est default, retirer default des autres
        setAddresses(prev => {
          const next = addrForm.is_default ? prev.map(a => ({ ...a, is_default: 0 })) : [...prev]
          return [...next, res.data]
        })
      } else {
        await api.put(`/users/me/addresses/${addrModal.id}`, addrForm)
        setAddresses(prev => prev.map(a => {
          if (addrForm.is_default && a.id !== addrModal.id) return { ...a, is_default: 0 }
          if (a.id === addrModal.id) return { ...a, ...addrForm }
          return a
        }))
      }
      setAddrModal(null)
    } catch (err) { setAddrError(err.response?.data?.error || t('common.error')) }
    finally { setAddrSaving(false) }
  }

  async function handleAddrDelete(id) {
    if (!confirm(t('address.deleteConfirm'))) return
    await api.delete(`/users/me/addresses/${id}`)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  async function handleSetDefault(addr) {
    try {
      await api.put(`/users/me/addresses/${addr.id}`, { ...addr, is_default: true })
      setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === addr.id ? 1 : 0 })))
    } catch {}
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <p className="section-label">{t('account.mySpace')}</p>
        <h1 className={s.title}>{t('account.hello')}, {user?.first_name}</h1>

        {/* Nav rapide */}
        <div className={s.quickNav}>
          {[
            { to: '/commandes', icon: Package, label: t('account.myOrders') },
            { to: '/wishlist',  icon: Heart,   label: t('account.myWishlist') },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={s.quickCard}>
              <div className={s.quickCardLeft}>
                <Icon size={18} strokeWidth={1.5} className={s.quickIcon} />
                <span>{label}</span>
              </div>
              <ChevronRight size={16} className={s.quickArrow} />
            </Link>
          ))}
        </div>

        {/* Messages */}
        {msg   && <div className={s.msgSuccess}>{msg}</div>}
        {error && <div className={s.msgError}>{error}</div>}

        {/* ===== INFORMATIONS ===== */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>{t('account.myInfo')}</h2>
          <form onSubmit={handleProfile} className={s.grid2}>
            {[
              { name: 'first_name', label: t('account.firstName') },
              { name: 'last_name',  label: t('account.lastName') },
              { name: 'phone',      label: t('account.phone') },
            ].map(f => (
              <div key={f.name}>
                <label style={LABEL}>{f.label}</label>
                <input className="input" name={f.name} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} />
              </div>
            ))}
            <div className={s.alignEnd}>
              <button type="submit" className="btn-primary">{t('account.update')}</button>
            </div>
          </form>
        </section>

        {/* ===== MOT DE PASSE ===== */}
        <section className={s.section}>
          <h2 className={s.sectionTitle}>{t('account.password')}</h2>
          <form onSubmit={handlePassword} className={s.grid2}>
            {[
              { name: 'current_password', label: t('account.currentPassword') },
              { name: 'new_password',     label: t('account.newPassword') },
            ].map(f => (
              <div key={f.name}>
                <label style={LABEL}>{f.label}</label>
                <input type="password" className="input" name={f.name} value={pwForm[f.name]} onChange={e => setPwForm(p => ({ ...p, [e.target.name]: e.target.value }))} />
              </div>
            ))}
            <div className={s.alignEnd}>
              <button type="submit" className="btn-primary">{t('account.changePassword')}</button>
            </div>
          </form>
        </section>

        {/* ===== ADRESSES ===== */}
        <section className={s.section}>
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle} style={{ marginBottom: 0 }}>{t('account.myAddresses')}</h2>
            <button className="btn-outline" onClick={openCreateAddr}>
              <Plus size={13} /> {t('account.addAddress')}
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className={s.addrEmpty}>
              <MapPin size={32} strokeWidth={1} className={s.addrEmptyIcon} />
              <p>{t('account.noAddress')}</p>
            </div>
          ) : (
            <div className={s.addrGrid}>
              {addresses.map(addr => (
                <div key={addr.id} className={`${s.addrCard} ${addr.is_default ? s.addrDefault : ''}`}>
                  {addr.is_default && (
                    <span className={s.addrBadge}>{t('account.default')}</span>
                  )}
                  {addr.label && <p className={s.addrLabel}>{addr.label}</p>}
                  <p className={s.addrName}>{addr.first_name} {addr.last_name}</p>
                  <p className={s.addrLine}>{addr.address_line1}</p>
                  {addr.address_line2 && <p className={s.addrLine}>{addr.address_line2}</p>}
                  <p className={s.addrLine}>{addr.postal_code} {addr.city}</p>
                  <p className={s.addrLine}>{addr.country_code}</p>
                  {addr.phone && <p className={s.addrPhone}>{addr.phone}</p>}

                  <div className={s.addrActions}>
                    {!addr.is_default && (
                      <button className={s.addrBtn} onClick={() => handleSetDefault(addr)} title="Définir par défaut">
                        <Star size={13} />
                      </button>
                    )}
                    <button className={s.addrBtn} onClick={() => openEditAddr(addr)} title="Modifier">
                      <Pencil size={13} />
                    </button>
                    <button className={`${s.addrBtn} ${s.addrBtnDanger}`} onClick={() => handleAddrDelete(addr.id)} title="Supprimer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Déconnexion */}
        <button onClick={handleLogout} className={s.logoutBtn}>
          <LogOut size={14} /> {t('account.logout')}
        </button>
      </div>

      {/* ===== MODAL ADRESSE ===== */}
      {addrModal !== null && (
        <div className={s.overlay} onClick={() => setAddrModal(null)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>
                {addrModal === 'create' ? t('address.new') : t('address.edit')}
              </h2>
              <button className={s.modalClose} onClick={() => setAddrModal(null)}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleAddrSave} className={s.modalBody}>
              {addrError && <div className={s.msgError}>{addrError}</div>}

              <div className={s.modalGrid}>
                {/* Libellé */}
                <div className={s.span2}>
                  <label style={LABEL}>{t('address.label')}</label>
                  <input className="input" placeholder={t('address.labelPlaceholder')} value={addrForm.label} onChange={e => setAddrForm(p => ({ ...p, label: e.target.value }))} />
                </div>

                {/* Prénom / Nom */}
                <div>
                  <label style={LABEL}>{t('address.firstName')} *</label>
                  <input className="input" required value={addrForm.first_name} onChange={e => setAddrForm(p => ({ ...p, first_name: e.target.value }))} />
                </div>
                <div>
                  <label style={LABEL}>{t('address.lastName')} *</label>
                  <input className="input" required value={addrForm.last_name} onChange={e => setAddrForm(p => ({ ...p, last_name: e.target.value }))} />
                </div>

                {/* Adresse */}
                <div className={s.span2}>
                  <label style={LABEL}>{t('address.address')} *</label>
                  <input className="input" required value={addrForm.address_line1} onChange={e => setAddrForm(p => ({ ...p, address_line1: e.target.value }))} />
                </div>
                <div className={s.span2}>
                  <label style={LABEL}>{t('address.complement')}</label>
                  <input className="input" value={addrForm.address_line2} onChange={e => setAddrForm(p => ({ ...p, address_line2: e.target.value }))} />
                </div>

                {/* Ville / CP */}
                <div>
                  <label style={LABEL}>{t('address.city')} *</label>
                  <input className="input" required value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} />
                </div>
                <div>
                  <label style={LABEL}>{t('address.postal')} *</label>
                  <input className="input" required value={addrForm.postal_code} onChange={e => setAddrForm(p => ({ ...p, postal_code: e.target.value }))} />
                </div>

                {/* Pays / Téléphone */}
                <div>
                  <label style={LABEL}>{t('address.country')} *</label>
                  <select className="input" value={addrForm.country_code} onChange={e => setAddrForm(p => ({ ...p, country_code: e.target.value }))}>
                    {COUNTRIES.map(([v, l]) => <option key={v} value={v}>{t(`countries.${v}`, { defaultValue: l })}</option>)}
                  </select>
                </div>
                <div>
                  <label style={LABEL}>{t('address.phone')}</label>
                  <input className="input" value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} />
                </div>

                {/* Par défaut */}
                <div className={s.span2}>
                  <label className={s.checkLabel}>
                    <input type="checkbox" checked={addrForm.is_default} onChange={e => setAddrForm(p => ({ ...p, is_default: e.target.checked }))} />
                    {t('address.setDefault')}
                  </label>
                </div>
              </div>

              <div className={s.modalActions}>
                <button type="submit" className="btn-primary" disabled={addrSaving}>
                  {addrSaving ? t('address.saving') : t('address.save')}
                </button>
                <button type="button" className="btn-outline" onClick={() => setAddrModal(null)}>
                  {t('address.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
