import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

// Clé unique par article = product_id + variant_id (ou 'base' si pas de variante)
function cartKey(productId, variantId) {
  return `${productId}_${variantId ?? 'base'}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cart')) || []
      // Migrer les anciens articles sans cartKey
      return saved.map(i => i.cartKey ? i : { ...i, cartKey: cartKey(i.id, i.variant_id) })
    } catch { return [] }
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // variant = { id, name, price } | null
  function addItem(product, quantity = 1, variant = null) {
    const key        = cartKey(product.id, variant?.id)
    const unitPrice  = variant?.price ?? product.price
    const stockLimit = variant?.stock ?? product.stock

    setItems(prev => {
      const existing = prev.find(i => i.cartKey === key)
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stockLimit)
        return prev.map(i => i.cartKey === key ? { ...i, quantity: newQty } : i)
      }
      return [
        ...prev,
        {
          ...product,
          cartKey:      key,
          variant_id:   variant?.id        ?? null,
          variant_name: variant?.name      ?? null,
          // Image de la variante prioritaire sur la cover produit dans le drawer
          cover_url:    variant?.image_url ?? product.cover_url ?? null,
          price:        unitPrice,
          stock:        stockLimit,
          quantity:     Math.min(quantity, stockLimit),
        },
      ]
    })
    setIsOpen(true)
  }

  function removeItem(key) {
    setItems(prev => prev.filter(i => i.cartKey !== key))
  }

  function updateQuantity(key, quantity) {
    if (quantity <= 0) return removeItem(key)
    setItems(prev => prev.map(i =>
      i.cartKey === key ? { ...i, quantity: Math.min(quantity, i.stock) } : i
    ))
  }

  function clearCart() { setItems([]) }

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen,
      addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
