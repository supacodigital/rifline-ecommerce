import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(new Set()) // Set des product_id en wishlist

  // Charger les ids wishlist dès que l'utilisateur est connecté
  useEffect(() => {
    if (!user) { setIds(new Set()); return }
    api.get('/wishlists')
      .then(res => {
        const data = res.data || []
        setIds(new Set(data.map(i => i.product_id)))
      })
      .catch(() => {})
  }, [user])

  const toggle = useCallback(async (product) => {
    if (!user) return // non connecté → rien (le composant peut rediriger)
    const pid = product.id
    // Lecture de l'état courant via le setter fonctionnel pour éviter ids dans les dépendances
    setIds(prev => {
      const next = new Set(prev)
      const inWishlist = prev.has(pid)
      inWishlist ? next.delete(pid) : next.add(pid)
      // Appel API en parallèle (optimistic update déjà appliqué)
      const call = inWishlist ? api.delete(`/wishlists/${pid}`) : api.post(`/wishlists/${pid}`)
      call.catch(() => {
        // Rollback en cas d'erreur réseau
        setIds(r => {
          const rb = new Set(r)
          inWishlist ? rb.add(pid) : rb.delete(pid)
          return rb
        })
      })
      return next
    })
  }, [user])

  const isInWishlist = (productId) => ids.has(productId)

  return (
    <WishlistContext.Provider value={{ toggle, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
