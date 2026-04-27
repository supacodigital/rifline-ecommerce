import { useState, useEffect } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import api from '../../api/axios'

const EMPTY = { code: '', type: 'percent', value: '', min_order_amount: '', max_uses: '', expires_at: '', is_active: true }

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => { api.get('/coupons').then(res => setCoupons(res.data || [])).catch(() => {}) }, [])

  async function handleSave(e) {
    e.preventDefault(); setSaving(true)
    try {
      const res = await api.post('/coupons', form)
      setCoupons(prev => [res.data, ...prev]); setModal(false)
    } catch (err) { alert(err.response?.data?.error || 'Erreur') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ?')) return
    await api.delete(`/coupons/${id}`)
    setCoupons(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300 }}>Coupons</h1>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setModal(true) }}><Plus size={14} /> Nouveau coupon</button>
      </div>

      <div style={{ border: '1px solid var(--color-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              {['Code','Type','Valeur','Min. commande','Utilisations','Expiration','Statut',''].map(h => (
                <th key={h} style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--space-4)', color: 'var(--color-gold)', fontWeight: 500, letterSpacing: '0.08em' }}>{c.code}</td>
                <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{c.type === 'percent' ? '%' : '€'}</td>
                <td style={{ padding: 'var(--space-4)', color: 'var(--color-text)' }}>{c.value}{c.type === 'percent' ? '%' : ' €'}</td>
                <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{c.min_order_amount ? `${c.min_order_amount} €` : '—'}</td>
                <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('fr-FR') : '—'}</td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: c.is_active ? 'var(--color-success)' : 'var(--color-text-subtle)', fontWeight: 500 }}>{c.is_active ? 'Actif' : 'Inactif'}</span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-error)', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>Aucun coupon</p>}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setModal(false)}>
          <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', width: '100%', maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 300 }}>Nouveau coupon</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} strokeWidth={1.5} /></button>
            </div>
            <form onSubmit={handleSave} style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Code</label>
                <input className="input" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required placeholder="SUMMER20" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Type</label>
                <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="percent">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (€)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Valeur</label>
                <input type="number" className="input" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Min. commande (€)</label>
                <input type="number" className="input" value={form.min_order_amount} onChange={e => setForm(p => ({ ...p, min_order_amount: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Utilisations max</label>
                <input type="number" className="input" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Expiration</label>
                <input type="datetime-local" className="input" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: 'var(--space-3)' }}>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Créer'}</button>
                <button type="button" className="btn-outline" onClick={() => setModal(false)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
