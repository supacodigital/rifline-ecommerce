import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../../api/axios'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    setLoading(true)
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    api.get(`/users${params}`)
      .then(res => { setCustomers(res.data.rows || []); setTotal(res.data.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300, marginBottom: 'var(--space-8)' }}>Clients</h1>

      {/* Recherche */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: 'var(--space-8)' }}>
        <Search size={14} style={{ position: 'absolute', left: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input
          className="input"
          style={{ paddingLeft: 'calc(var(--space-4) + 22px)' }}
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? <p style={{ color: 'var(--color-text-muted)' }}>Chargement…</p> : (
        <>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>{total} client{total > 1 ? 's' : ''}</p>
          <div style={{ border: '1px solid var(--color-border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                  {['Nom','Email','Rôle','Inscription'].map(h => (
                    <th key={h} style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--space-4)', color: 'var(--color-text)' }}>{c.first_name} {c.last_name}</td>
                    <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{c.email}</td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.role === 'admin' ? 'var(--color-gold)' : 'var(--color-text-subtle)' }}>{c.role}</span>
                    </td>
                    <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && <p style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>Aucun client</p>}
          </div>
        </>
      )}
    </div>
  )
}
