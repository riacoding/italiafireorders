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
import { secret } from '@aws-amplify/backend'
import { cookieBasedClient, getCurrentUserServer } from '@/util/amplify'
import { Schema } from '@/amplify/data/resource'
import {
  Menu,
  SquareItem,
  SquareModifierList,
  SquareCatalogObject,
  menuSelectionSet,
  HydratedCatalog,
  MenuInput,
  CatalogItem,
  CreateMenuItemInput,
  menuItemSelectionSet,
  catalogItemSelectionSet,
  RemoveFunctions,
  SafeMenuItem,
  ReceiptItem,
  FulfillmentState,
  SquareOrder,
  SecureReceipt,
  SquareAuthResponse,
} from '@/types'
import { extractReceiptItems, orderNumberToTicket } from './utils'
import { SquareClient, SquareEnvironment } from 'square'
import { randomUUID } from 'crypto'
import { sanitizeBigInts } from '@/amplify/functions/webhookProcessor/util'

const SQUARE_BASE_URL = 'https://connect.squareupsandbox.com/v2'
const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN

const client = new SquareClient({
  environment: SquareEnvironment.Sandbox,
  token: SQUARE_TOKEN,
})

export const isAuth = async () => {
  const auth = await getCurrentUserServer()

  if (auth.user) {
    return true
  }
  return false
}

export const fetchMenus = async () => {
  const authMode = (await isAuth()) ? 'userPool' : 'iam'

  try {
    const { data, errors } = await cookieBasedClient.models.Menu.list({
      selectionSet: [...menuSelectionSet],
      authMode,
    })

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
  const { data, errors } = await cookieBasedClient.models.Menu.get({ id }, { selectionSet: menuSelectionSet, authMode })
  if (errors && errors.length > 0) {
    console.error('Error fetching menu:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }
  console.log('fetchMenu', data)
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
  //console.log('locationId', locationId)
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

export async function updateSquareOrder(orderId: string, locationId: string, newState: FulfillmentState) {
  console.log(`Updating order ${orderId} at Location:${locationId} to ${newState.state}`)

  try {
    // Step 1: Fetch existing order
    const { order } = await client.orders.get({ orderId })

    if (!order || !order.fulfillments || order.fulfillments.length !== 1) {
      throw new Error(`Unexpected fulfillment state: ${JSON.stringify(order?.fulfillments)}`)
    }

    const fulfillment = order.fulfillments[0]

    // Step 2: Update the state
    fulfillment.state = newState.state

    // Step 3: Send the full fulfillment object back in the update
    const { order: newOrder } = await client.orders.update({
      orderId,
      idempotencyKey: randomUUID(),
      order: {
        version: order.version!,
        locationId,
        fulfillments: [fulfillment],
      },
    })

    console.log(`Square Order ${orderId} successfully updated.`)
    if (!newOrder?.id) {
      throw new Error('Updated Square order has no ID')
    }

    await updateAmplifyOrder(newOrder as SquareOrder, newState)
  } catch (err) {
    console.error('Failed to update Square order:', err)
  }
}

export async function updateOrderContact(phone: string, ticketNumber: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '') // "20240501"
  const ticket = `${today}-${ticketNumber}`
  console.log(`Updating phone ${phone} for ticket ${ticketNumber} ${ticket}`)
  const authMode = (await isAuth()) ? 'userPool' : 'iam'

  const { data: phones, errors: phoneErrors } = await cookieBasedClient.models.Phone.listPhoneByTicketNumber(
    { ticketNumber: ticket },
    { authMode }
  )

  if (phoneErrors?.length) {
    console.error('Amplify fetch phone errors:', phoneErrors)
    return
  }

  if (!phones?.length) {
    console.warn('No matching phone record found')
    return
  }

  const existing = phones[0]

  // 🛡️ Avoid redundant update
  if (existing.optIn && existing.clientUpdated && existing.phone === phone) {
    console.log(`Phone already opted in and matches — skipping update`)
    return
  }

  const { data: orderPhone, errors } = await cookieBasedClient.models.Phone.update(
    {
      id: existing.id,
      phone,
      ticketNumber: ticket,
      clientUpdated: true,
      optIn: true,
    },
    { authMode }
  )

  if (errors?.length) {
    console.error('Amplify update errors:', errors)
  } else {
    console.log(`📲 Phone ${orderPhone?.id} marked as clientUpdated + opted in`)
  }
}

export async function updateAmplifyOrder(order: SquareOrder, newState: FulfillmentState): Promise<void> {
  try {
    const { data, errors } = await cookieBasedClient.models.Order.update({
      id: order.id,
      fulfillmentStatus: newState.state,
      rawData: JSON.stringify(sanitizeBigInts(order)),
    })

    if (errors) {
      console.error('Amplify update errors:', errors)
    } else {
      console.log(`Amplify order ${order.id} updated to ${newState.state}`)
    }
  } catch (err) {
    console.log(err)
  }
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
  const token = process.env.SQUARE_ACCESS_TOKEN || 'noToken'

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

export async function getSquareOrderByOrderNumber(
  orderNumber: string,
  orderToken: string
): Promise<ReceiptItem[] | null> {
  const token = process.env.SQUARE_ACCESS_TOKEN || 'noToken'
  const locationId = process.env.SQUARE_LOCATION_ID || 'noLocation'

  const referenceId = orderNumber

  const authMode = (await isAuth()) ? 'userPool' : 'iam'

  try {
    console.log('fetching order:', referenceId)
    const { data, errors } = await cookieBasedClient.models.Order.listOrderByReferenceId(
      { referenceId: referenceId },
      { authMode }
    )

    if (errors && errors?.length > 0) {
      console.error('Error fetching order:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }
    const raw = data[0]?.rawData

    if (!raw) {
      console.error('❌ rawData is missing or not a string')
      return null
    }

    const order: SquareOrder = typeof raw === 'string' ? JSON.parse(raw) : ''

    const menuSlug = order?.metadata?.menuSlug
    const accessToken = order?.metadata?.accessToken
    const menu = menuSlug ? await getCurrentMenu(menuSlug) : null
    if (menu) {
      const { data: menuItems } = await menu.menuItems()

      const nameOverrides: Record<string, string> = {}
      for (const item of menuItems) {
        if (item.catalogItemId && item.customName) {
          nameOverrides[item.catalogItemId] = item.customName
        }
      }
      console.log('name overrides', nameOverrides)
      const receiptItems = extractReceiptItems(order, nameOverrides)
      if (accessToken === orderToken) {
        return receiptItems
      }
      return null
    }

    return null
  } catch (err) {
    console.error(`Error fetching order ${orderNumber} referenceId: ${referenceId}`, err)
    return null
  }
}

export async function saveMenu(input: MenuInput): Promise<{ id: string | null }> {
  const { id, ...rest } = input

  const cleanData = {
    ...rest,
    locationId: rest.locationId.toLowerCase(),
    theme: rest.theme,
  }

  const op = id
    ? cookieBasedClient.models.Menu.update({ id, ...cleanData }, { authMode: 'userPool' })
    : cookieBasedClient.models.Menu.create(cleanData, { authMode: 'userPool' })

  const { data, errors } = await op

  if (errors && errors.length > 0) {
    console.error(`Error ${id ? 'updating' : 'creating'} menu:`, errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }

  return { id: data?.id ?? null }
}

export async function saveMenuItemsForMenu(menuId: string, selectedCatalogItemIds: string[]) {
  const { data: existingItems, errors } = await cookieBasedClient.models.MenuItem.list({
    filter: { menuId: { eq: menuId } },
    authMode: 'userPool',
  })

  if (errors && errors.length > 0) {
    console.error('Error fetching existing MenuItems:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }

  const existing = existingItems ?? []

  const existingCatalogIds = new Set(existing.map((mi) => mi.catalogItemId))
  const selectedCatalogIds = new Set(selectedCatalogItemIds)

  const toDelete = existing.filter((mi) => !selectedCatalogIds.has(mi.catalogItemId))
  const toCreate = Array.from(selectedCatalogIds).filter((id) => !existingCatalogIds.has(id))

  // Delete items not in new selection
  await Promise.all(
    toDelete.map((mi) => cookieBasedClient.models.MenuItem.delete({ id: mi.id }, { authMode: 'userPool' }))
  )

  // Create new items not already existing
  await Promise.all(
    toCreate.map((catalogItemId, index) =>
      cookieBasedClient.models.MenuItem.create(
        {
          menuId,
          catalogItemId,
          isFeatured: false,
          sortOrder: index,
        },
        { authMode: 'userPool' }
      )
    )
  )
}

export async function deleteMenuItem(id: string) {
  const { data, errors } = await cookieBasedClient.models.MenuItem.delete({ id }, { authMode: 'userPool' })
  if (errors && errors.length > 0) {
    console.error('Error deleting menu:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }
  return data?.id
}

export async function createMenuItem(input: CreateMenuItemInput): Promise<SafeMenuItem> {
  const { data, errors } = await cookieBasedClient.models.MenuItem.create(
    {
      menuId: input.menuId,
      catalogItemId: input.catalogItemId,
      isFeatured: input.isFeatured ?? false,
      sortOrder: input.sortOrder ?? 0,
    },
    { authMode: 'userPool' }
  )

  if (errors && errors.length > 0) {
    console.error('Error creating MenuItem:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }

  return {
    id: data!.id,
    menuId: data!.menuId,
    catalogItemId: data!.catalogItemId,
    s3ImageKey: data!.s3ImageKey,
    customName: data!.customName,
    isFeatured: data!.isFeatured,
    sortOrder: data!.sortOrder,
    createdAt: data!.createdAt,
    updatedAt: data!.updatedAt,
    owner: data!.owner,
  }
}

export async function deleteMenuItemsForMenu(menuId: string): Promise<void> {
  const { data, errors } = await cookieBasedClient.models.MenuItem.list({
    filter: { menuId: { eq: menuId } },
    authMode: 'userPool',
  })

  if (errors && errors.length > 0) {
    console.error('Error fetching MenuItems to delete:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }

  if (!data?.length) return

  await Promise.all(
    data.map((item) => cookieBasedClient.models.MenuItem.delete({ id: item.id }, { authMode: 'userPool' }))
  )
}

type ItemWithModifiers = {
  item: SquareItem
  modifierLists: SquareModifierList[]
}

export async function getCatalogItems(): Promise<HydratedCatalog[] | []> {
  const authMode = (await isAuth()) ? 'userPool' : 'iam'
  try {
    const { data, errors } = await cookieBasedClient.models.CatalogItem.list({
      authMode,
    })
    if (errors && errors.length > 0) {
      console.error('Error fetching menus:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }

    const hydrated = data.map((item) =>
      typeof item.catalogData === 'string' ? (JSON.parse(item.catalogData) as HydratedCatalog) : null
    )

    return hydrated.filter((item) => item !== null)
  } catch (err) {
    console.log(err)
    return []
  }
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

    console.log(
      'fetch getAllSquareCatalogItems',
      typeof SQUARE_TOKEN === 'string' ? SQUARE_TOKEN.substring(0, 5) : '(no token)',
      JSON.stringify(objects, null, 2)
    )
    return objects.filter((obj) => obj.type === 'ITEM')
  } catch (err) {
    console.log(err)
    return []
  }
}

//fetch from appsync
export async function fetchMenuItemsWithModifiers(squareItemIds: string[]): Promise<ItemWithModifiers[]> {
  const authMode = (await isAuth()) ? 'userPool' : 'iam'
  const { data, errors } = await cookieBasedClient.models.CatalogItem.list({
    authMode,
  })

  if (errors && errors.length > 0) {
    console.error('Error fetching CatalogItems:', errors)
    return []
  }
  //console.log('fetchMenuItemsWithModifiers', data)
  const allItems = data ?? []

  const filtered = allItems.filter((item) => squareItemIds.includes(item.squareItemId))

  //console.log('Filtered', filtered)

  // Hydrate and return in expected format
  const hydrated: ItemWithModifiers[] = filtered.map((ci) => {
    const parsed = JSON.parse(ci.catalogData as unknown as string) as {
      item: SquareItem
      modifierLists?: SquareModifierList[]
    }
    const { item, modifierLists } = parsed as {
      item: SquareItem
      modifierLists?: SquareModifierList[]
    }
    //console.log('appsync item', item)
    return {
      item,
      modifierLists: modifierLists ?? [],
    }
  })
  return hydrated
}

export async function getMenuItemWithCatalogItem(id: string) {
  const { data: menuItem, errors } = await cookieBasedClient.models.MenuItem.get(
    { id },
    { selectionSet: menuItemSelectionSet, authMode: 'userPool' }
  )

  if (errors?.length || !menuItem) return null

  const { data: catalogItem } = await cookieBasedClient.models.CatalogItem.get(
    { id: menuItem.catalogItemId },
    { selectionSet: catalogItemSelectionSet, authMode: 'userPool' }
  )

  const hydrated = {
    ...catalogItem,
    catalogData:
      typeof catalogItem?.catalogData === 'string' ? JSON.parse(catalogItem.catalogData) : catalogItem?.catalogData,
  }

  return {
    ...menuItem,
    ...hydrated, // for fallback name/image
    id: menuItem.id,
  }
}

export async function updateMenuItem(input: {
  id: string
  customName?: string
  sortOrder?: number
  isFeatured?: boolean
  s3ImageKey?: string
}) {
  console.log('MenuItem update:', input)
  const { id, ...fields } = input
  const { data, errors } = await cookieBasedClient.models.MenuItem.update({ id, ...fields }, { authMode: 'userPool' })

  if (errors?.length) {
    console.error('Update failed:', errors)
    throw new Error(errors.map((e) => e.message).join(', '))
  }

  return data?.id
}

export async function getSquareItemsWithModifiers(): Promise<ItemWithModifiers[]> {
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
  const items: SquareItem[] = objects.filter((obj): obj is SquareItem => obj.type === 'ITEM')

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

export async function syncMenuItems() {
  const itemsWithModifiers = await getSquareItemsWithModifiers()

  console.log('items to sync', itemsWithModifiers)

  for (const { item, modifierLists } of itemsWithModifiers) {
    const catalogData = {
      item,
      modifierLists,
    }

    const variation = item.item_data.variations?.find((v) => v.item_variation_data?.name === 'Regular')

    const catalogVariationId = variation?.id!

    console.log('variation', catalogVariationId, variation)

    // Save into local DynamoDB catalog
    const catalogItem = await upsertCatalogItem({
      squareItemId: item.id,
      catalogVariationId,
      catalogData,
    })

    //  // Step 2: Save into MenuItem
    //  await upsertMenuItem({
    //   menuId,
    //   catalogItemId: catalogItem.id,
    //   customName: item.itemData?.name ?? '',
    // })
  }
}

export async function setupWebhooks() {}

export async function createDefaultMenu() {}

export async function upsertCatalogItem({
  squareItemId,
  catalogVariationId,
  catalogData,
}: {
  squareItemId: string
  catalogVariationId: string
  catalogData: any
}) {
  const catalogDataString = JSON.stringify(catalogData)

  const { data: existingItems, errors: listErrors } = await cookieBasedClient.models.CatalogItem.list({
    filter: {
      squareItemId: { eq: squareItemId },
    },
    authMode: 'userPool',
  })

  console.log('Existing Items', existingItems)

  if (listErrors?.length) {
    console.error('Error checking existing CatalogItem:', listErrors)
    throw new Error(listErrors.map((e) => e.message).join(', '))
  }

  const existing = existingItems?.[0]

  if (existing) {
    const { data: updatedItem, errors: updateErrors } = await cookieBasedClient.models.CatalogItem.update(
      {
        id: existing.id,
        catalogVariationId: catalogVariationId,
        catalogData: catalogDataString,
      },
      { authMode: 'userPool' }
    )

    if (updateErrors?.length) {
      console.error('Error updating CatalogItem:', updateErrors)
      throw new Error(updateErrors.map((e) => e.message).join(', '))
    }

    return updatedItem
  } else {
    const { data: createdItem, errors: createErrors } = await cookieBasedClient.models.CatalogItem.create(
      {
        id: squareItemId,
        squareItemId,
        catalogData: catalogDataString,
      },
      { authMode: 'userPool' }
    )

    if (createErrors?.length) {
      console.error('Error creating CatalogItem:', createErrors)
      throw new Error(createErrors.map((e) => e.message).join(', '))
    }

    return createdItem
  }
}

export async function getAuthUrl(handle: string): Promise<SquareAuthResponse> {
  console.log('getting auth with handle:', handle)
  const { data, errors } = await cookieBasedClient.queries.getSquareAuthUrl({ handle })

  if (errors?.length) {
    console.error('Error fetching auth url:', errors)
    throw new Error(errors.map((e: any) => e.message).join(', '))
  }

  return { url: data?.url || null, auth: data?.auth || null }
}

function getModifierListsForItem(item: SquareItem, all: Record<string, SquareModifierList>): SquareModifierList[] {
  const variation = item.item_data.variations?.[0]
  const info = variation?.item_variation_data?.modifier_list_info || []
  return info.map((entry) => all[entry.modifier_list_id]).filter((list): list is SquareModifierList => Boolean(list))
}
