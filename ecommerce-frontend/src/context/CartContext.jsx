import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)

  const updateCart = (items) => {
    setCartItems(items)
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
  }

  const clearCart = () => {
    setCartItems([])
    setTotal(0)
  }

  return <CartContext.Provider value={{ cartItems, total, updateCart, clearCart }}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
