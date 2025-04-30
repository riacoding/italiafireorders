'use client'

import React, { useEffect, useState } from 'react'
import { SelectionSet } from 'aws-amplify/data'
import { type Schema } from '@/amplify/data/resource'
import { fetchMenus } from '@/lib/ssr-actions'
import { Menu, MenuItem } from '@/types'
import AdminPage from './AdminPage'
import { menuSelectionSet } from '@/types'

export type MenuSelection = SelectionSet<Schema['Menu']['type'], typeof menuSelectionSet>

export default function Admin() {
  const [menus, setMenus] = useState<MenuSelection[] | null>(null)

  useEffect(() => {
    fetchMenus().then(setMenus)
  }, [])

  if (!menus || menus.length === 0) {
    return <div>Loading...</div>
  }

  return <AdminPage menus={menus} />
}
