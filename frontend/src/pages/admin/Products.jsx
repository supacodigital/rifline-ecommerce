import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Star, Image, Layers, ImageOff } from 'lucide-react'
import api from '../../api/axios'

const EMPTY = { name_fr: '', name_en: '', description_fr: '', description_en: '', price: '', stock: '', sku: '', weight_grams: '', category_id: '', is_active: true }
const EMPTY_VARIANT = { name: '', sku: '', price: '', stock: 0 }

const LABEL = { display: 'block', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }

export default function AdminProducts() {
  const [products,    setProducts]    = useState([])
  const [categories,  setCategories]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [modal,       setModal]       = useState(null)    // null | 'create' | product
  const [imgModal,    setImgModal]    = useState(null)    // null | product
  const [varModal,    setVarModal]    = useState(null)    // null | product
  const [form,        setForm]        = useState(EMPTY)
  const [images,      setImages]      = useState([])
  const [variants,    setVariants]    = useState([])
  const [varForm,     setVarForm]     = useState(EMPTY_VARIANT)
  const [editingVar,  setEditingVar]  = useState(null)   // null | variant
  const [saving,         setSaving]        = useState(false)
  const [savingVar,      setSavingVar]      = useState(false)
  const [uploading,      setUploading]      = useState(false)
  const [uploadingVarId, setUploadingVarId] = useState(null)  // id variante en cours d'upload
  const [error,          setError]          = useState('')
  const [varError,       setVarError]       = useState('')
  const fileRef    = useRef()
  const varImgRefs = useRef({})  // { [variantId]: inputRef }

  useEffect(() => {
    Promise.all([api.get('/products?limit=100'), api.get('/categories')])
      .then(([pr, cr]) => { setProducts(pr.data.products || []); setCategories(cr.data || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function openCreate() { setForm(EMPTY); setError(''); setModal('create') }
  function openEdit(p)  { setForm({ ...p, category_id: p.category_id || '' }); setError(''); setModal(p) }

  async function openImages(p) {
    setImgModal(p)
    try {
      const res = await api.get(`/products/${p.slug}`)
      setImages(res.data.product?.images || [])
    } catch { setImages([]) }
  }

  async function openVariants(p) {
    setVarModal(p)
    setVarForm(EMPTY_VARIANT)
    setEditingVar(null)
    setVarError('')
    try {
      const res = await api.get(`/products/${p.id}/variants`)
      setVariants(res.data.variants || [])
    } catch { setVariants([]) }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (modal === 'create') {
        const res = await api.post('/products', form)
        setProducts(prev => [res.data.product, ...prev])
      } else {
        await api.put(`/products/${modal.id}`, form)
        setProducts(prev => prev.map(p => p.id === modal.id ? { ...p, ...form } : p))
      }
      setModal(null)
    } catch (err) { setError(err.response?.data?.error || 'Erreur') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await api.delete(`/products/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  async function handleUploadImage(e) {
    const file = e.target.files?.[0]
    if (!file || !imgModal) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('is_cover', images.length === 0 ? 'true' : 'false')
      const res = await api.post(`/products/${imgModal.id}/images`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImages(prev => [...prev, res.data])
      if (images.length === 0) {
        setProducts(prev => prev.map(p => p.id === imgModal.id ? { ...p, cover_url: res.data.url } : p))
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur upload')
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  async function handleSetCover(imgId) {
    try {
      await api.post(`/products/${imgModal.id}/images/${imgId}/cover`)
      setImages(prev => prev.map(img => ({ ...img, is_cover: img.id === imgId ? 1 : 0 })))
      const coverImg = images.find(img => img.id === imgId)
      if (coverImg) {
        setProducts(prev => prev.map(p => p.id === imgModal.id ? { ...p, cover_url: coverImg.url } : p))
      }
    } catch {
      setImages(prev => prev.map(img => ({ ...img, is_cover: img.id === imgId ? 1 : 0 })))
    }
  }

  async function handleDeleteImage(imgId) {
    if (!confirm('Supprimer cette image ?')) return
    try {
      await api.delete(`/products/${imgModal.id}/images/${imgId}`)
      setImages(prev => {
        const next = prev.filter(img => img.id !== imgId)
        if (next.length > 0 && !next.some(img => img.is_cover)) {
          next[0] = { ...next[0], is_cover: 1 }
        }
        return next
      })
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur suppression')
    }
  }

  // --- Variantes ---
  function startEditVariant(v) {
    setEditingVar(v)
    setVarForm({ name: v.name, sku: v.sku || '', price: v.price ?? '', stock: v.stock })
    setVarError('')
  }

  function cancelEditVariant() {
    setEditingVar(null)
    setVarForm(EMPTY_VARIANT)
    setVarError('')
  }

  async function handleSaveVariant(e) {
    e.preventDefault()
    setSavingVar(true); setVarError('')
    const payload = {
      name:  varForm.name.trim(),
      sku:   varForm.sku.trim() || null,
      price: varForm.price !== '' ? Number(varForm.price) : null,
      stock: Number(varForm.stock),
    }
    try {
      if (editingVar) {
        const res = await api.put(`/products/${varModal.id}/variants/${editingVar.id}`, payload)
        setVariants(prev => prev.map(v => v.id === editingVar.id ? res.data.variant : v))
      } else {
        const res = await api.post(`/products/${varModal.id}/variants`, payload)
        setVariants(prev => [...prev, res.data.variant])
      }
      cancelEditVariant()
    } catch (err) { setVarError(err.response?.data?.error || 'Erreur') }
    finally { setSavingVar(false) }
  }

  async function handleDeleteVariant(variantId) {
    if (!confirm('Supprimer cette variante ?')) return
    try {
      await api.delete(`/products/${varModal.id}/variants/${variantId}`)
      setVariants(prev => prev.filter(v => v.id !== variantId))
    } catch (err) { alert(err.response?.data?.error || 'Erreur') }
  }

  async function handleToggleVariant(v) {
    try {
      const res = await api.put(`/products/${varModal.id}/variants/${v.id}`, { is_active: v.is_active ? 0 : 1 })
      setVariants(prev => prev.map(x => x.id === v.id ? res.data.variant : x))
    } catch {}
  }

  async function handleUploadVariantImage(e, variantId) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVarId(variantId)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post(`/products/${varModal.id}/variants/${variantId}/image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setVariants(prev => prev.map(v => v.id === variantId ? res.data.variant : v))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur upload image variante')
    } finally {
      setUploadingVarId(null)
      if (varImgRefs.current[variantId]) varImgRefs.current[variantId].value = ''
    }
  }

  async function handleDeleteVariantImage(variantId) {
    try {
      await api.delete(`/products/${varModal.id}/variants/${variantId}/image`)
      setVariants(prev => prev.map(v => v.id === variantId ? { ...v, image_url: null } : v))
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur suppression image variante')
    }
  }

  return (
    <div style={{ padding: 'var(--space-10)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300 }}>Produits</h1>
        <button className="btn-primary" onClick={openCreate}><Plus size={14} /> Nouveau produit</button>
      </div>

      {loading ? <p style={{ color: 'var(--color-text-muted)' }}>Chargement…</p> : (
        <div style={{ border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                {['','Produit','Prix','Stock','Catégorie','Statut',''].map((h, i) => (
                  <th key={i} style={{ padding: 'var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', width: i === 0 ? 56 : 'auto' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <div style={{ width: 40, height: 50, background: 'var(--color-bg-3)', flexShrink: 0, overflow: 'hidden' }}>
                      {p.cover_url
                        ? <img src={p.cover_url} alt={p.name_fr} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,169,110,0.2)', fontSize: 18 }}>◈</div>
                      }
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)', fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{p.name_fr}</td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-gold)' }}>{Number(p.price).toFixed(2)} €</td>
                  <td style={{ padding: 'var(--space-4)', color: p.stock === 0 ? 'var(--color-error)' : 'var(--color-text-muted)' }}>{p.stock}</td>
                  <td style={{ padding: 'var(--space-4)', color: 'var(--color-text-muted)' }}>{p.category_name_fr || '—'}</td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: p.is_active ? 'var(--color-success)' : 'var(--color-text-subtle)', fontWeight: 500, letterSpacing: '0.08em' }}>
                      {p.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button onClick={() => openVariants(p)} title="Gérer les variantes" style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Layers size={13} /></button>
                      <button onClick={() => openImages(p)} title="Gérer les images" style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Image size={13} /></button>
                      <button onClick={() => openEdit(p)} style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-error)', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>Aucun produit</p>}
        </div>
      )}

      {/* ===== MODAL FORMULAIRE ===== */}
      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setModal(null)}>
          <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 300 }}>
                {modal === 'create' ? 'Nouveau produit' : 'Modifier le produit'}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} strokeWidth={1.5} /></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: 'var(--space-6)' }}>
              {error && <div style={{ padding: 'var(--space-3)', background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {[
                  { name: 'name_fr', label: 'Nom FR', required: true },
                  { name: 'name_en', label: 'Nom EN', required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label style={LABEL}>{f.label}</label>
                    <input className="input" name={f.name} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} required={f.required} />
                  </div>
                ))}

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={LABEL}>Description FR</label>
                  <textarea className="input" name="description_fr" value={form.description_fr} onChange={e => setForm(p => ({ ...p, description_fr: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
                </div>

                {[
                  { name: 'price',        label: 'Prix (€)',  type: 'number', required: true },
                  { name: 'stock',        label: 'Stock',     type: 'number', required: true },
                  { name: 'sku',          label: 'SKU' },
                  { name: 'weight_grams', label: 'Poids (g)', type: 'number', required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label style={LABEL}>{f.label}</label>
                    <input className="input" type={f.type || 'text'} name={f.name} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))} required={f.required} />
                  </div>
                ))}

                <div>
                  <label style={LABEL}>Catégorie</label>
                  <select className="input" name="category_id" value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} required>
                    <option value="">Choisir…</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                  <label htmlFor="is_active" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Produit actif</label>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
                <button type="button" className="btn-outline" onClick={() => setModal(null)}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL IMAGES ===== */}
      {imgModal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setImgModal(null)}>
          <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 300 }}>
                Photos — {imgModal.name_fr}
              </h2>
              <button onClick={() => setImgModal(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} strokeWidth={1.5} /></button>
            </div>

            <div style={{ padding: 'var(--space-6)' }}>
              {images.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  {images.map(img => (
                    <div key={img.id} style={{ position: 'relative', background: 'var(--color-bg-3)', aspectRatio: '3/4', overflow: 'hidden', border: img.is_cover ? '2px solid var(--color-gold)' : '1px solid var(--color-border)' }}>
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 200ms', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', opacity: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.opacity = 1 }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.opacity = 0 }}
                      >
                        {!img.is_cover && (
                          <button onClick={() => handleSetCover(img.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--color-gold)', color: '#0a0a0a', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}
                          >
                            <Star size={11} /> Cover
                          </button>
                        )}
                        <button onClick={() => handleDeleteImage(img.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--color-error)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em' }}
                        >
                          <Trash2 size={11} /> Supprimer
                        </button>
                      </div>
                      {img.is_cover && (
                        <div style={{ position: 'absolute', top: 'var(--space-2)', left: 'var(--space-2)', background: 'var(--color-gold)', color: '#0a0a0a', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '2px 6px', textTransform: 'uppercase' }}>Cover</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', textAlign: 'center', padding: 'var(--space-8) 0' }}>Aucune photo pour ce produit</p>
              )}

              {images.length < 5 && (
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)', letterSpacing: '0.08em' }}>
                    {5 - images.length} emplacement{5 - images.length > 1 ? 's' : ''} disponible{5 - images.length > 1 ? 's' : ''} · JPG, PNG, WEBP · 5 Mo max
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', padding: 'var(--space-8)', border: '1px dashed var(--color-border)', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', transition: 'border-color 200ms, color 200ms' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-gold)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
                  >
                    {uploading ? 'Upload en cours…' : <><Upload size={16} /> Cliquer pour ajouter une photo</>}
                    <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleUploadImage} disabled={uploading} />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL VARIANTES ===== */}
      {varModal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => { setVarModal(null); cancelEditVariant() }}>
          <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 300 }}>
                  Variantes — {varModal.name_fr}
                </h2>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)', letterSpacing: '0.06em' }}>
                  Goût, senteur, couleur… Le stock et le prix sont gérés par variante.
                </p>
              </div>
              <button onClick={() => { setVarModal(null); cancelEditVariant() }} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} strokeWidth={1.5} /></button>
            </div>

            <div style={{ padding: 'var(--space-6)' }}>

              {/* Formulaire ajout / édition */}
              <form onSubmit={handleSaveVariant} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                  {editingVar ? `Modifier — ${editingVar.name}` : 'Ajouter une variante'}
                </p>

                {varError && <div style={{ padding: 'var(--space-3)', background: 'rgba(224,92,92,0.1)', border: '1px solid rgba(224,92,92,0.3)', color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>{varError}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-3)', alignItems: 'end' }}>
                  <div>
                    <label style={LABEL}>Nom *</label>
                    <input className="input" placeholder="ex: Rose, Vanille, Bleu…" value={varForm.name} onChange={e => setVarForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={LABEL}>Stock *</label>
                    <input className="input" type="number" min="0" value={varForm.stock} onChange={e => setVarForm(f => ({ ...f, stock: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={LABEL}>Prix (€)</label>
                    <input className="input" type="number" step="0.01" min="0" placeholder="= produit" value={varForm.price} onChange={e => setVarForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div>
                    <label style={LABEL}>SKU</label>
                    <input className="input" placeholder="facultatif" value={varForm.sku} onChange={e => setVarForm(f => ({ ...f, sku: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
                  <button type="submit" className="btn-primary" disabled={savingVar} style={{ fontSize: 'var(--text-sm)' }}>
                    {savingVar ? 'Enregistrement…' : (editingVar ? 'Mettre à jour' : 'Ajouter')}
                  </button>
                  {editingVar && (
                    <button type="button" className="btn-outline" onClick={cancelEditVariant} style={{ fontSize: 'var(--text-sm)' }}>Annuler</button>
                  )}
                </div>
              </form>

              {/* Liste des variantes */}
              {variants.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                  Aucune variante pour ce produit
                </p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                      {['Photo', 'Nom', 'Stock', 'Prix', 'SKU', 'Statut', ''].map((h, i) => (
                        <th key={i} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map(v => (
                      <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border)', opacity: v.is_active ? 1 : 0.45 }}>

                        {/* Miniature image variante */}
                        <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                          <div style={{ position: 'relative', width: 36, height: 46, background: 'var(--color-bg-3)', border: '1px solid var(--color-border)', overflow: 'hidden', flexShrink: 0 }}>
                            {v.image_url
                              ? <img src={v.image_url} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(201,169,110,0.2)', fontSize: 14 }}>◈</div>
                            }
                          </div>
                        </td>

                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-display)', fontWeight: 400 }}>{v.name}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: v.stock === 0 ? 'var(--color-error)' : 'var(--color-text-muted)' }}>{v.stock}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-gold)' }}>
                          {v.price !== null ? `${Number(v.price).toFixed(2)} €` : <span style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>= produit</span>}
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--color-text-subtle)', fontSize: 'var(--text-xs)' }}>{v.sku || '—'}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <button onClick={() => handleToggleVariant(v)} style={{ fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.08em', background: 'none', border: 'none', cursor: 'pointer', color: v.is_active ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>
                            {v.is_active ? 'Actif' : 'Inactif'}
                          </button>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                            {/* Upload image variante */}
                            <label title="Changer la photo" style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: uploadingVarId === v.id ? 'var(--color-gold)' : 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <Upload size={12} />
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                style={{ display: 'none' }}
                                disabled={uploadingVarId === v.id}
                                ref={el => { varImgRefs.current[v.id] = el }}
                                onChange={e => handleUploadVariantImage(e, v.id)}
                              />
                            </label>
                            {/* Supprimer image variante */}
                            {v.image_url && (
                              <button onClick={() => handleDeleteVariantImage(v.id)} title="Supprimer la photo" style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <ImageOff size={12} />
                              </button>
                            )}
                            <button onClick={() => startEditVariant(v)} style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Pencil size={12} /></button>
                            <button onClick={() => handleDeleteVariant(v.id)} style={{ padding: 'var(--space-2)', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-error)', cursor: 'pointer' }}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
