'use client'

import React, { useEffect, useState } from 'react'
import { SelectionSet } from 'aws-amplify/data'
import { type Schema } from '@/amplify/data/resource'
import { fetchMenus } from '@/lib/ssr-actions'
import { Menu, MenuItem } from '@/types'
import AdminPage from './AdminPage'
import { menuSelectionSet } from '@/types'
import { useMerchant } from '@/components/MerchantContext'

export type MenuSelection = SelectionSet<Schema['Menu']['type'], typeof menuSelectionSet>

export default function Admin() {
  const [menus, setMenus] = useState<MenuSelection[] | null>(null)
  const merchant = useMerchant()

  useEffect(() => {
    if (!merchant?.id) return
    fetchMenus(merchant.id).then(setMenus)
  }, [])

  if (!menus) {
    return <div>Loading...</div>
  }

  return <AdminPage menus={menus} />
}
