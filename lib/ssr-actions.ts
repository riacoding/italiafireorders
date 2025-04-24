/**
 * Menu Actions – SSR + Square Catalog Fetching
 *
 * This module handles:
 * - Fetching menus from Amplify (CRUD, current menu lookup)
 * - Interfacing with Square’s Catalog API to fetch items and modifiers
 * - Normalizing Square data for frontend usage
 *
 * Key Functions:
 *
 * • `fetchMenus()` – List all Amplify menus (userPool auth)
 * • `fetchMenuById(id)` – Fetch a single menu from Amplify
 * • `getCurrentMenu(locationId)` – Get the active menu for a specific location
 *
 * • `getSquareItems(ids)` – Fetch basic item info from Square using `catalog/list`
 * • `getSquareItemDetail(id)` – Fetch a single item (with variation + modifier IDs)
 *
 * • `getSquareItemsWithModifiers(ids)` –
 *    Fetch Square items with full modifier list content.
 *    Resolves all modifier list IDs and merges them per item.
 *
 * • `saveMenu(input)` – Create or update an Amplify menu
 *
 * Types:
 * - `SquareItem`, `SquareModifierList`, `SquareCatalogObject` – modeled after Square's catalog schema
 * - `ItemWithModifiers` – combined Square item + its modifier lists for normalization
 */

'use server'
import { cookieBasedClient, getCurrentUserServer } from '@/util/amplify'
import { Schema } from '@/amplify/data/resource'
import { Menu, SquareItem, SquareModifierList, SquareCatalogObject } from '@/types'

const SQUARE_BASE_URL = 'https://connect.squareupsandbox.com/v2'
const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN!

const isAuth = async () => {
  const auth = await getCurrentUserServer()

  if (auth.user) {
    return true
  }
  return false
}

export const fetchMenus = async () => {
  const authMode = (await isAuth()) ? 'userPool' : 'iam'
  try {
    const { data, errors } = await cookieBasedClient.models.Menu.list({ authMode })

    if (errors && errors.length > 0) {
      console.error('Error fetching menus:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }

    return data
  } catch (err) {
    console.log(err)
    return []
  }
}

export const fetchMenuById = async (id: string) => {
  const authMode = (await isAuth()) ? 'userPool' : 'iam'
  const { data, errors } = await cookieBasedClient.models.Menu.get({ id }, { authMode })
  if (errors && errors.length > 0) {
    console.error('Error fetching menu:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }
  return data
}

export const fetchCurrentMenus = async () => {
  const authMode = (await isAuth()) ? 'userPool' : 'iam'
  try {
    const { data, errors } = await cookieBasedClient.models.Menu.list({
      filter: { isActive: { eq: true } },
      authMode,
    })
    if (errors && errors.length > 0) {
      console.error('Error fetching menus:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }
    return data
  } catch (err) {
    console.log(err)
  }
}

export const getCurrentMenu = async (locationId: string): Promise<Menu | null> => {
  const authMode = (await isAuth()) ? 'userPool' : 'iam'
  console.log('locationId', locationId)
  const { data, errors } = await cookieBasedClient.models.Menu.list({
    filter: { locationId: { eq: locationId }, isActive: { eq: true } },
    authMode,
  })
  if (errors && errors.length > 0) {
    console.error('Error fetching menu:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }
  return data[0]
}

export async function getSquareItemDetail(itemId: string) {
  const token = process.env.SQUARE_ACCESS_TOKEN

  const res = await fetch(`https://connect.squareupsandbox.com/v2/catalog/object/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return null

  const json = await res.json()
  const object = json.object

  if (!object || object.type !== 'ITEM') return null

  const variation = object.item_data.variations?.[0]
  const price = variation?.item_variation_data?.price_money?.amount ?? 0

  return {
    id: object.id,
    name: object.item_data.name,
    description: object.item_data.description,
    price: price / 100,
    modifiers: object.item_data.modifier_list_info ?? [],
  }
}

export async function getSquareItems(ids: string[]): Promise<SquareItem[]> {
  const token = process.env.SQUARE_ACCESS_TOKEN

  const res = await fetch('https://connect.squareupsandbox.com/v2/catalog/list', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  const json = await res.json()
  const objects = json.objects || []

  return objects
    .filter((obj: any) => ids.includes(obj.id))
    .map((item: any) => ({
      id: item.id,
      name: item.item_data?.name,
      description: item.item_data?.description,
      price: item.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount / 100 || 0,
      image: '/placeholder.svg', // You could later use Square image links
    }))
}

export async function saveMenu(input: Partial<Schema['Menu']['type']> & { id?: string }) {
  if (input.id) {
    // Update existing
    const { data, errors } = await cookieBasedClient.models.Menu.update(input as any, { authMode: 'userPool' })
    if (errors && errors.length > 0) {
      console.error('Error updating menu:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }
    return data
  } else {
    // Create new
    const { data, errors } = await cookieBasedClient.models.Menu.create(input as any, { authMode: 'userPool' })
    if (errors && errors.length > 0) {
      console.error('Error creating menu:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }
    return data
  }
}

type ItemWithModifiers = {
  item: SquareItem
  modifierLists: SquareModifierList[]
}

export async function getAllSquareCatalogItems(): Promise<SquareCatalogObject[]> {
  try {
    const res = await fetch(`${SQUARE_BASE_URL}/catalog/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SQUARE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const json = await res.json()
    const objects: SquareCatalogObject[] = json.objects || []

    console.log('fetch getAllSquareCatalogItems', SQUARE_TOKEN.substring(0, 5), JSON.stringify(objects, null, 2))
    return objects.filter((obj) => obj.type === 'ITEM')
  } catch (err) {
    console.log(err)
    return []
  }
}

export async function getSquareItemsWithModifiers(ids: string[]): Promise<ItemWithModifiers[]> {
  const res = await fetch(`${SQUARE_BASE_URL}/catalog/list`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${SQUARE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  const json = await res.json()
  const objects: SquareCatalogObject[] = json.objects || []

  // 1. Filter to only requested items
  const items: SquareItem[] = objects.filter((obj): obj is SquareItem => obj.type === 'ITEM' && ids.includes(obj.id))

  // 2. Collect modifier list IDs from both item and variation levels
  const modifierListIds = new Set<string>()

  for (const item of items) {
    // item-level
    const itemLevel = item.item_data?.modifier_list_info ?? []
    itemLevel.forEach((info) => {
      if (info.enabled && info.modifier_list_id) {
        modifierListIds.add(info.modifier_list_id)
      }
    })

    // variation-level
    const variations = item.item_data?.variations ?? []
    for (const variation of variations) {
      const varInfos = variation.item_variation_data?.modifier_list_info ?? []
      varInfos.forEach((info) => {
        if (info.enabled && info.modifier_list_id) {
          modifierListIds.add(info.modifier_list_id)
        }
      })
    }
  }

  // 3. Fetch all modifier lists
  const modifierLists: Record<string, SquareModifierList> = {}

  await Promise.all(
    Array.from(modifierListIds).map(async (id) => {
      const res = await fetch(`${SQUARE_BASE_URL}/catalog/object/${id}`, {
        headers: {
          Authorization: `Bearer ${SQUARE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      const json = await res.json()
      modifierLists[id] = json.object
    })
  )

  // 4. Return items with resolved modifier lists
  return items.map((item) => {
    const listIds = new Set<string>()

    const itemLevel = item.item_data?.modifier_list_info ?? []
    itemLevel.forEach((info) => {
      if (info.enabled && info.modifier_list_id) {
        listIds.add(info.modifier_list_id)
      }
    })

    const variations = item.item_data?.variations ?? []
    for (const variation of variations) {
      const varInfos = variation.item_variation_data?.modifier_list_info ?? []
      varInfos.forEach((info) => {
        if (info.enabled && info.modifier_list_id) {
          listIds.add(info.modifier_list_id)
        }
      })
    }

    const resolvedLists = Array.from(listIds)
      .map((id) => modifierLists[id])
      .filter((list): list is SquareModifierList => Boolean(list))

    return {
      item,
      modifierLists: resolvedLists,
    }
  })
}

function getModifierListsForItem(item: SquareItem, all: Record<string, SquareModifierList>): SquareModifierList[] {
  const variation = item.item_data.variations?.[0]
  const info = variation?.item_variation_data?.modifier_list_info || []
  return info.map((entry) => all[entry.modifier_list_id]).filter((list): list is SquareModifierList => Boolean(list))
}
