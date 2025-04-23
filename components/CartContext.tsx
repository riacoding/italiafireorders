'use client'

import React, { createContext, useContext, useState } from 'react'

type CartTopping = {
  id: string
  name: string
  price: number
}

type CartItem = {
  id: string
  name: string
  basePrice: number
  quantity: number
  image?: string
  toppings: CartTopping[]
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotal: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const clearCart = () => setItems([])

  const getTotal = () =>
    items.reduce((sum, item) => {
      const toppingsTotal = item.toppings.reduce((tSum, t) => tSum + t.price, 0)
      return sum + (item.basePrice + toppingsTotal) * item.quantity
    }, 0)

  const getTotalItems = () =>
    items.reduce((sum, item) => {
      return sum + item.quantity
    }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, getTotal, getTotalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
