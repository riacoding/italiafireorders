'use client'

import React, { useEffect, useState } from 'react'
import { fetchMenus } from '@/lib/ssr-actions'
import { Menu } from '@/types'
import AdminPage from './AdminPage'

export default function Admin() {
  const [menus, setMenus] = useState<Menu[] | null>(null)

  useEffect(() => {
    fetchMenus().then(setMenus)
  }, [])

  if (!menus || menus.length === 0) {
    return <div>Loading...</div>
  }

  return <AdminPage menus={menus} />
}
