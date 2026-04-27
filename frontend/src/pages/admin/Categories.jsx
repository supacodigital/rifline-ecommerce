import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react'
import api from '../../api/axios'

const EMPTY = { name_fr: '', name_en: '', description_fr: '', description_en: '', sort_order: 0, is_active: true }

const LABEL = { display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }

export default function AdminCategories() {
  const [cats,      setCats]      = useState([])
  const [modal,     setModal]     = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState('')
  const fileRef = useRef()

  useEffect(() => {
    api.get('/categories').then(res => setCats(res.data || [])).catch(() => {})
  }, [])

  function openCreate() { setForm(EMPTY); setError(''); setModal('create') }
  function openEdit(c)  { setForm(c); setError(''); setModal(c) }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (modal === 'create') {
        const res = await api.post('/categories', form)
        setCats(prev => [...prev, res.data])
      } else {
        await api.put(`/categories/${modal.id}`, form)
        setCats(prev => prev.map(c => c.id === modal.id ? { ...c, ...form } : c))
      }
      setModal(null)
    } catch (err) { setError(err.response?.data?.error || 'Erreur') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    await api.delete(`/categories/${id}`)
    setCats(prev => prev.filter(c => c.id !== id))
  }

  async function handleUploadImage(e, catId) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(catId)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post(`/categories/${catId}/image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setCats(prev => prev.map(c => c.id === catId ? { ...c, image_url: res.data.image_url } : c))
      // Mettre à jour le form si le modal est ouvert sur cette catégorie
      if (modal && modal.id === catId) {
        setForm(f => ({ ...f, image_url: res.data.image_url }))
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur upload')
    } finally {
      setUploading(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDeleteImage(catId) {
    if (!confirm('Supprimer la photo ?')) return
    try {
      await api.delete(`/categories/${catId}/image`)
      setCats(prev => prev.map(c => c.id === catId ? { ...c, image_url: null } : c))
      if (modal && modal.id === catId) setForm(f => ({ ...f, image_url: null }))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur')
    }
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300 }}>Catégories</h1>
        <button className="btn-primary" onClick={openCreate}><Plus size={14} /> Nouvelle catégorie</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-4)' }}>
        {cats.map(c => (
          <div key={c.id} style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            {/* Image de la catégorie */}
            <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--color-bg-3)' }}>
              {c.image_url ? (
                <>
                  <img src={c.image_url} alt={c.name_fr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => handleDeleteImage(c.id)}
                    title="Supprimer la photo"
                    style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)', width: 28, height: 28, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'var(--color-error)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', cursor: 'pointer', color: 'var(--color-text-subtle)', gap: 'var(--space-2)', transition: 'color 200ms' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-subtle)'}
                >
                  {uploading === c.id
                    ? <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>Upload…</span>
                    : <>
                        <Upload size={20} strokeWidth={1.5} />
                        <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>Ajouter une photo</span>
                      </>
                  }
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => handleUploadImage(e, c.id)} disabled={uploading === c.id} />
                </label>
              )}
            </div>

            {/* Infos + actions */}
            <div style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 300, marginBottom: 'var(--space-1)' }}>{c.name_fr}</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-subtle)', letterSpacing: '0.08em' }}>{c.slug}</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button onClick={() => openEdit(c)} style={{ padding: 'var(--space-1)', border: 'none', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: 'var(--space-1)', border: 'none', background: 'none', color: 'var(--color-error)', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setModal(null)}>
          <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 300 }}>
                {modal === 'create' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} strokeWidth={1.5} /></button>
            </div>

            <div style={{ padding: 'var(--space-6)' }}>
              {/* Photo dans le modal (seulement en édition) */}
              {modal !== 'create' && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={LABEL}>Photo</label>
                  <div style={{ position: 'relative', height: 160, background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    {form.image_url ? (
                      <>
                        <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 'var(--space-2)', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: 'var(--text-xs)', cursor: 'pointer', letterSpacing: '0.08em' }}>
                            <Upload size={13} /> Changer
                            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => handleUploadImage(e, modal.id)} disabled={uploading === modal.id} />
                          </label>
                          <button onClick={() => handleDeleteImage(modal.id)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'none', border: '1px solid var(--color-error)', color: 'var(--color-error)', fontSize: 'var(--text-xs)', cursor: 'pointer', letterSpacing: '0.08em' }}>
                            <Trash2 size={13} /> Supprimer
                          </button>
                        </div>
                      </>
                    ) : (
                      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', cursor: 'pointer', color: 'var(--color-text-muted)', gap: 'var(--space-2)', transition: 'color 200ms' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-gold)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                      >
                        {uploading === modal.id
                          ? <span style={{ fontSize: 'var(--text-xs)' }}>Upload en cours…</span>
                          : <><Upload size={20} strokeWidth={1.5} /><span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.08em' }}>Cliquer pour ajouter une photo</span></>
                        }
                        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => handleUploadImage(e, modal.id)} disabled={uploading === modal.id} />
                      </label>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {error && <div style={{ gridColumn: '1/-1', padding: 'var(--space-3)', background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{error}</div>}

                {[['name_fr','Nom FR',true],['name_en','Nom EN',true],['description_fr','Description FR'],['description_en','Description EN']].map(([n,l,r]) => (
                  <div key={n} style={{ gridColumn: n.startsWith('description') ? '1/-1' : '' }}>
                    <label style={LABEL}>{l}</label>
                    {n.startsWith('description')
                      ? <textarea className="input" name={n} value={form[n] || ''} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} rows={2} style={{ resize: 'vertical' }} />
                      : <input className="input" name={n} value={form[n] || ''} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} required={r} />
                    }
                  </div>
                ))}

                <div style={{ gridColumn: '1/-1', display: 'flex', gap: 'var(--space-3)' }}>
                  <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
                  <button type="button" className="btn-outline" onClick={() => setModal(null)}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
