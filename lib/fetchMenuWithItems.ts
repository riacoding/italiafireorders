'use server'

import { cache } from 'react'
import { fetchMenuItemsWithModifiers, getCurrentMenu } from '@/lib/ssr-actions'
import { normalizeSquareItem } from '@/lib/utils'
import type { NormalizedItem } from '@/types'
import type { Schema } from '@/amplify/data/resource'

// Narrowed return type — remove lazy fields
export type EagerMenu = Omit<Schema['Menu']['type'], 'menuItems'> & {
  menuItems: {
    id: string
    catalogItemId: string
    sortOrder?: number
    isFeatured?: boolean
  }[]
}

export const fetchMenuWithItems = cache(
  async (locationId: string): Promise<{ menu: EagerMenu; items: NormalizedItem[] }> => {
    console.log(`[FETCH MENU] Fetching fresh data for: ${locationId}`)

    const menu = await getCurrentMenu(locationId)
    if (!menu) throw new Error('No active menu for this location')

    const { data: menuItems, errors } = await menu.menuItems()

    if (errors && errors.length > 0) {
      console.error('Error loading menuItems', errors)
      throw new Error('Failed to load menu items')
    }

    const squareIds = menuItems.map((item) => item.catalogItemId)

    const rawItems = await fetchMenuItemsWithModifiers(squareIds)

    const normalizedItems: NormalizedItem[] = menuItems
      .map((mi) => {
        const catalog = rawItems.find((ri) => ri.item.id === mi.catalogItemId)
        if (!catalog) return null

        const normalized = normalizeSquareItem(catalog)

        return {
          ...normalized,
          customName: mi.customName?.trim() || undefined,
          sortOrder: mi.sortOrder ?? 0,
          isFeatured: mi.isFeatured ?? false,
          menuItemId: mi.id,
          image: mi.s3ImageKey,
          catalogItemId: mi.catalogItemId,
        }
      })
      .filter(Boolean) as NormalizedItem[]

    const sanitizedMenu: EagerMenu = {
      ...menu,
      menuItems: menuItems.map((mi) => ({
        id: mi.id,
        catalogItemId: mi.catalogItemId,
        sortOrder: mi.sortOrder ?? undefined,
        isFeatured: mi.isFeatured ?? undefined,
      })),
    }

    return { menu: sanitizedMenu, items: normalizedItems }
  }
)
