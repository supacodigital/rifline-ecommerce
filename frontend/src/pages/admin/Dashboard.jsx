import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react'
import api from '../../api/axios'

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div style={{ padding: 'var(--space-6)', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{label}</p>
        <Icon size={18} strokeWidth={1.5} style={{ color: 'var(--color-gold)' }} />
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300, color: 'var(--color-text)', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-subtle)', marginTop: 'var(--space-2)' }}>{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reports/dashboard')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const s = data?.stats

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }}>Vue d'ensemble</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300, marginBottom: 'var(--space-10)' }}>Dashboard</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-12)' }}>
        <StatCard icon={TrendingUp} label="Chiffre d'affaires" value={loading ? '—' : `${Number(s?.total_revenue_eur || 0).toFixed(2)} €`} />
        <StatCard icon={ShoppingBag} label="Commandes" value={loading ? '—' : s?.total_orders || 0} />
        <StatCard icon={Users} label="Clients" value={loading ? '—' : s?.total_customers || 0} />
        <StatCard icon={Package} label="Panier moyen" value={loading ? '—' : `${Number(s?.avg_order_eur || 0).toFixed(2)} €`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Top produits */}
        <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-6)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 300, marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
            Top produits
          </h3>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Chargement…</p>
          ) : (data?.topProducts || []).length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Aucune donnée</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {(data?.topProducts || []).slice(0, 8).map((p, i) => (
                <div key={p.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: 'var(--text-xs)', minWidth: 20 }}>#{i+1}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{p.product_name}</span>
                  </div>
                  <span style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{p.total_qty} ventes</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statuts commandes */}
        <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: 'var(--space-6)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 300, marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
            Statuts commandes
          </h3>
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Chargement…</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {(data?.ordersByStatus || []).map(row => (
                <div key={row.status} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{row.status}</span>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 500 }}>{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
