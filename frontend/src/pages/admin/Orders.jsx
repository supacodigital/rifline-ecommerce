import { useState, useEffect } from 'react'
import { Package, ExternalLink, Loader } from 'lucide-react'
import api from '../../api/axios'

const STATUSES = ['pending','paid','processing','shipped','delivered','cancelled','refunded']
const STATUS_COLORS = {
  pending:    '#c9a96e',
  paid:       '#6db87a',
  processing: '#6db87a',
  shipped:    '#6db87a',
  delivered:  '#6db87a',
  cancelled:  '#e05c5c',
  refunded:   '#e05c5c',
}

export default function AdminOrders() {
  const [orders,       setOrders]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState('!pending')
  const [generating,   setGenerating]   = useState(null) // id commande en cours

  useEffect(() => {
    setLoading(true)
    const params = filter ? `?status=${filter}` : ''
    api.get(`/orders${params}`)
      .then(res => setOrders(res.data.rows || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  async function updateStatus(id, status) {
    await api.patch(`/orders/${id}/status`, { status })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  async function generateLabel(order) {
    setGenerating(order.id)
    try {
      const res = await api.post('/shipengine/labels', {
        order_id:    order.id,
        method_id:   order.shipping_method_id || '',
        weight_grams: 500,
      })
      // Ouvrir le PDF dans un nouvel onglet
      if (res.data.label_url) {
        window.open(res.data.label_url, '_blank')
      }
      // Mettre à jour la commande localement
      setOrders(prev => prev.map(o =>
        o.id === order.id
          ? { ...o, status: 'shipped', tracking_number: res.data.tracking_number, carrier: res.data.carrier }
          : o
      ))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la génération du bordereau')
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300, marginBottom: 'var(--space-8)' }}>Commandes</h1>

      {/* Filtre statut */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
        {[['!pending', 'Tous (payées)'], ['', 'Toutes'], ...STATUSES.map(st => [st, st])].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: 'var(--space-2) var(--space-4)', border: '1px solid', borderColor: filter === val ? 'var(--color-gold)' : 'var(--color-border)', background: filter === val ? 'rgba(201,169,110,0.1)' : 'transparent', color: filter === val ? 'var(--color-gold)' : 'var(--color-text-muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'capitalize', cursor: 'pointer' }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Chargement…</p>
      ) : (
        <div style={{ border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                {['Commande','Client','Date','Total','Statut','Expédition','Action'].map(h => (
                  <th key={h} style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{o.order_number}</td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{o.first_name} {o.last_name}</td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-gold)' }}>{Number(o.total_eur).toFixed(2)} €</td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: STATUS_COLORS[o.status] || 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{o.status}</span>
                  </td>

                  {/* Colonne expédition : tracking ou point relais */}
                  <td style={{ padding: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {o.tracking_number ? (
                      <span style={{ color: 'var(--color-success)' }}>{o.tracking_number}</span>
                    ) : o.service_point_name ? (
                      <span title={o.service_point_address}>{o.service_point_name}</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-subtle)' }}>—</span>
                    )}
                  </td>

                  {/* Colonne action */}
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        style={{ background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-2)', cursor: 'pointer' }}
                      >
                        {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>

                      {/* Bouton bordereau — visible uniquement pour les commandes paid/processing */}
                      {(o.status === 'paid' || o.status === 'processing') && (
                        <button
                          onClick={() => generateLabel(o)}
                          disabled={generating === o.id}
                          title="Générer le bordereau d'expédition"
                          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-1) var(--space-3)', background: 'transparent', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', fontSize: 'var(--text-xs)', cursor: 'pointer', opacity: generating === o.id ? 0.6 : 1, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                        >
                          {generating === o.id
                            ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} />
                            : <Package size={11} />
                          }
                          Bordereau
                        </button>
                      )}

                      {/* Lien PDF si déjà expédié */}
                      {o.status === 'shipped' && o.label_url && (
                        <a
                          href={o.label_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Télécharger le bordereau"
                          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                        >
                          <ExternalLink size={11} /> PDF
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>Aucune commande</p>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
