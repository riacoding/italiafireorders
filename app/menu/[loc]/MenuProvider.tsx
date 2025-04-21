'use client'

import { Menu } from '@/types'
import { createContext, useContext } from 'react'

export type NormalizedTopping = {
  id: string
  name: string
  price: number
  groupName: string
}

export type NormalizedItem = {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  toppings: NormalizedTopping[]
}

type MenuContextValue = {
  items: NormalizedItem[]
  menu: Menu
  getItemById: (id: string) => NormalizedItem | undefined
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined)

export function MenuProvider({
  items,
  menu,
  children,
}: {
  items: NormalizedItem[]
  menu: Menu
  children: React.ReactNode
}) {
  const getItemById = (id: string) => items.find((item) => item.id === id)

  return <MenuContext.Provider value={{ items, getItemById, menu }}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within a MenuProvider')
  return ctx
}

export function useMenuItem(id: string) {
  const { getItemById } = useMenu()
  return getItemById(id)
}
