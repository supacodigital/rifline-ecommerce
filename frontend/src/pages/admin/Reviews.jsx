import { useState, useEffect } from 'react'
import { Check, Trash2, Star } from 'lucide-react'
import api from '../../api/axios'

function Stars({ rating }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={1.5}
          fill={i < rating ? 'var(--color-gold)' : 'none'}
          color={i < rating ? 'var(--color-gold)' : 'var(--color-border)'}
        />
      ))}
    </span>
  )
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reviews/pending')
      .then(res => setReviews(res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleApprove(id) {
    await api.patch(`/reviews/${id}/approve`)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cet avis définitivement ?')) return
    await api.delete(`/reviews/${id}`)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const labelStyle = {
    fontSize: 'var(--text-xs)', fontWeight: 500,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    padding: 'var(--space-4)', textAlign: 'left',
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300 }}>Avis clients</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
            {loading ? '…' : `${reviews.length} avis en attente de modération`}
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Chargement…</p>
      ) : reviews.length === 0 ? (
        <p style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Aucun avis en attente de modération.
        </p>
      ) : (
        <div style={{ border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <th style={labelStyle}>Produit</th>
                <th style={labelStyle}>Client</th>
                <th style={labelStyle}>Note</th>
                <th style={labelStyle}>Commentaire</th>
                <th style={labelStyle}>Date</th>
                <th style={labelStyle}></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text)', fontWeight: 500 }}>
                    {r.product_name || `Produit #${r.product_id}`}
                  </td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
                    {r.first_name} {r.last_name}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <Stars rating={r.rating} />
                  </td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)', maxWidth: 320 }}>
                    {r.comment || <span style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>Sans commentaire</span>}
                  </td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
                    {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => handleApprove(r.id)}
                        title="Approuver"
                        style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-success)', cursor: 'pointer' }}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        title="Supprimer"
                        style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
