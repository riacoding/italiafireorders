// lib/hooks/useServerMenu.ts

import { getCurrentMenu, getSquareItemsWithModifiers } from '@/lib/ssr-actions'
import { normalizeSquareItem } from '@/lib/utils'
import type { NormalizedItem } from '@/app/menu/[loc]/MenuProvider'
import type { Menu } from '@/types'

export async function fetchMenuWithItems(locationId: string): Promise<{ menu: Menu; items: NormalizedItem[] }> {
  const menu = await getCurrentMenu(locationId)
  if (!menu) throw new Error('No active menu for this location')

  const squareIds = (menu.squareItemIds ?? []).filter((id): id is string => typeof id === 'string')
  console.log('menu product ids', squareIds)
  const rawItems = await getSquareItemsWithModifiers(squareIds)
  console.log('rawItems', JSON.stringify(rawItems, null, 2))
  const normalizedItems = rawItems.map(normalizeSquareItem)
  console.log('normalizedItems', JSON.stringify(normalizedItems, null, 2))

  return { menu, items: normalizedItems }
}
