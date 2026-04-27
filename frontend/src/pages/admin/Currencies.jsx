import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, RefreshCw } from 'lucide-react'
import api from '../../api/axios'
import s from './Currencies.module.css'

const EMPTY_FORM = { code: '', name: '', symbol: '', rate_vs_eur: '', is_active: true }

// Devises courantes pour saisie rapide
const PRESETS = [
  { code: 'EUR', name: 'Euro',             symbol: '€',  rate: 1     },
  { code: 'USD', name: 'Dollar américain', symbol: '$',  rate: 1.08  },
  { code: 'GBP', name: 'Livre sterling',   symbol: '£',  rate: 0.86  },
  { code: 'MAD', name: 'Dirham marocain',  symbol: 'DH', rate: 10.82 },
  { code: 'DZD', name: 'Dinar algérien',   symbol: 'DA', rate: 145.2 },
  { code: 'TND', name: 'Dinar tunisien',   symbol: 'TND',rate: 3.32  },
  { code: 'CHF', name: 'Franc suisse',     symbol: 'CHF',rate: 0.96  },
  { code: 'CAD', name: 'Dollar canadien',  symbol: 'CA$',rate: 1.47  },
]

export default function AdminCurrencies() {
  const [currencies, setCurrencies] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(null)  // null | 'create' | currency object
  const [form,       setForm]       = useState(EMPTY_FORM)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    api.get('/currencies/admin')
      .then(res => setCurrencies(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setError('')
    setModal('create')
  }

  function openEdit(currency) {
    setForm({
      code:        currency.code,
      name:        currency.name,
      symbol:      currency.symbol,
      rate_vs_eur: currency.rate_vs_eur,
      is_active:   !!currency.is_active,
    })
    setError('')
    setModal(currency)
  }

  function applyPreset(preset) {
    setForm(f => ({
      ...f,
      code:        preset.code,
      name:        preset.name,
      symbol:      preset.symbol,
      rate_vs_eur: preset.rate,
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        code:        form.code.toUpperCase().trim(),
        name:        form.name.trim(),
        symbol:      form.symbol.trim(),
        rate_vs_eur: parseFloat(form.rate_vs_eur),
        is_active:   form.is_active ? 1 : 0,
      }
      const res = await api.post('/currencies', payload)
      // Mise à jour locale
      setCurrencies(prev => {
        const exists = prev.find(c => c.code === res.data.code)
        if (exists) return prev.map(c => c.code === res.data.code ? res.data : c)
        return [...prev, res.data]
      })
      setModal(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(code) {
    if (code === 'EUR') return
    if (!confirm(`Supprimer la devise ${code} ?`)) return
    try {
      await api.delete(`/currencies/${code}`)
      setCurrencies(prev => prev.filter(c => c.code !== code))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur')
    }
  }

  async function toggleActive(currency) {
    try {
      const res = await api.post('/currencies', {
        ...currency,
        is_active: currency.is_active ? 0 : 1,
      })
      setCurrencies(prev => prev.map(c => c.code === res.data.code ? res.data : c))
    } catch {}
  }

  const isEditing = modal && modal !== 'create'

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <p className={s.eyebrow}>Configuration</p>
          <h1 className={s.title}>Devises</h1>
        </div>
        <div className={s.headerActions}>
          <button className={s.refreshBtn} onClick={load} title="Rafraîchir">
            <RefreshCw size={14} />
          </button>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={14} /> Ajouter une devise
          </button>
        </div>
      </div>

      {/* Info EUR */}
      <div className={s.infoBox}>
        <strong>EUR = devise de référence.</strong> Tous les prix en base sont stockés en euros. Les autres taux sont multiplicateurs (ex: 1 EUR = 10.82 MAD → taux = 10.82).
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom</th>
              <th>Symbole</th>
              <th>Taux (vs EUR)</th>
              <th>Exemple (100 €)</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className={s.loadingCell}>Chargement…</td></tr>
            ) : currencies.length === 0 ? (
              <tr><td colSpan={7} className={s.loadingCell}>Aucune devise configurée</td></tr>
            ) : (
              currencies.map(c => (
                <tr key={c.code} className={!c.is_active ? s.rowInactive : ''}>
                  <td>
                    <span className={s.codeTag}>{c.code}</span>
                  </td>
                  <td className={s.nameCell}>{c.name}</td>
                  <td className={s.symbolCell}>{c.symbol}</td>
                  <td className={s.rateCell}>
                    {c.code === 'EUR'
                      ? <span className={s.baseTag}>Base</span>
                      : Number(c.rate_vs_eur).toFixed(4)
                    }
                  </td>
                  <td className={s.exampleCell}>
                    {(100 * Number(c.rate_vs_eur)).toFixed(2)} {c.symbol}
                  </td>
                  <td>
                    <button
                      className={`${s.statusBadge} ${c.is_active ? s.active : s.inactive}`}
                      onClick={() => c.code !== 'EUR' && toggleActive(c)}
                      disabled={c.code === 'EUR'}
                      title={c.code === 'EUR' ? 'Devise de référence' : 'Basculer'}
                    >
                      {c.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className={s.actions}>
                      <button className={s.actionBtn} onClick={() => openEdit(c)} title="Modifier">
                        <Pencil size={13} />
                      </button>
                      {c.code !== 'EUR' && (
                        <button className={`${s.actionBtn} ${s.actionDanger}`} onClick={() => handleDelete(c.code)} title="Supprimer">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL ===== */}
      {modal !== null && (
        <div className={s.overlay} onClick={() => setModal(null)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 className={s.modalTitle}>{isEditing ? 'Modifier la devise' : 'Ajouter une devise'}</h2>
              <button className={s.closeBtn} onClick={() => setModal(null)}>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className={s.modalBody}>
              {/* Presets (seulement en création) */}
              {!isEditing && (
                <div className={s.presetsSection}>
                  <p className={s.presetsLabel}>Saisie rapide</p>
                  <div className={s.presets}>
                    {PRESETS.map(p => (
                      <button key={p.code} className={s.presetBtn} onClick={() => applyPreset(p)}>
                        {p.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <div className={s.errorBanner}>{error}</div>}

              <form onSubmit={handleSave} className={s.form}>
                <div className={s.formGrid}>
                  <div className={s.field}>
                    <label className={s.label}>Code ISO *</label>
                    <input
                      className="input"
                      value={form.code}
                      onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                      placeholder="EUR, USD, MAD…"
                      required
                      maxLength={5}
                      disabled={isEditing}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Symbole *</label>
                    <input
                      className="input"
                      value={form.symbol}
                      onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))}
                      placeholder="€, $, DH…"
                      required
                      maxLength={5}
                    />
                  </div>
                  <div className={`${s.field} ${s.span2}`}>
                    <label className={s.label}>Nom *</label>
                    <input
                      className="input"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Euro, Dollar américain…"
                      required
                    />
                  </div>
                  <div className={`${s.field} ${s.span2}`}>
                    <label className={s.label}>Taux vs EUR *</label>
                    <input
                      className="input"
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      value={form.rate_vs_eur}
                      onChange={e => setForm(f => ({ ...f, rate_vs_eur: e.target.value }))}
                      placeholder="1.00 pour EUR, 10.82 pour MAD…"
                      required
                    />
                    {form.rate_vs_eur && (
                      <p className={s.ratePreview}>
                        100 € = {(100 * parseFloat(form.rate_vs_eur || 0)).toFixed(2)} {form.symbol || form.code}
                      </p>
                    )}
                  </div>
                  <div className={`${s.field} ${s.span2}`}>
                    <label className={s.checkLabel}>
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                      />
                      Devise active (visible dans le sélecteur)
                    </label>
                  </div>
                </div>

                <div className={s.formActions}>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setModal(null)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
