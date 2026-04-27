import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })
  const [isOpen, setIsOpen]     = useState(false)

  // Persister dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  function addItem(product, quantity = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
        )
      }
      return [...prev, { ...product, quantity }]
    })
    setIsOpen(true)
  }

  function removeItem(productId) {
    setItems(prev => prev.filter(i => i.id !== productId))
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) return removeItem(productId)
    setItems(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i))
  }

  function clearCart() { setItems([]) }

  const totalItems    = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice    = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

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
