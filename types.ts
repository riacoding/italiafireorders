import { type Schema } from '@/amplify/data/resource'
import { SelectionSet } from 'aws-amplify/data'

export type Menu = Schema['Menu']['type']

export type MenuItem = Schema['MenuItem']['type']
export type CatalogItem = Schema['CatalogItem']['type']

export type SafeMenuItem = RemoveFunctions<Schema['MenuItem']['type']>

export type MenuInput = {
  id?: string
  name: string
  locationId: string
  logo?: string
  theme?: object | null
  isActive: boolean
}

export const menuItemSelectionSet = ['id', 'menuId', 'catalogItemId', 'customName', 'sortOrder', 'isFeatured'] as const

export const catalogItemSelectionSet = ['id', 'squareItemId', 'catalogData'] as const

export const menuSelectionSet = [
  'id',
  'name',
  'locationId',
  'isActive',
  'logo',
  'theme',
  'createdAt',
  'updatedAt',
  'menuItems.*',
] as const

export interface NormalizedTopping {
  id: string
  name: string
  price: number // in cents
  groupName: string
  isDefault?: boolean // optional
  isLocked?: boolean // optional
}

export type ReceiptItem = {
  name: string
  quantity: number
  basePrice: number
  totalPrice: number
  modifiers: {
    name: string
    quantity: number
    price: number
  }[]
}

export type RemoveFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

export type CreateMenuItemInput = {
  menuId: string
  catalogItemId: string
  isFeatured?: boolean
  sortOrder?: number
}
export type NormalizedItem = {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  toppings: NormalizedTopping[]
  customName?: string
  sortOrder: number
  isFeatured: boolean
  menuItemId: string
  catalogItemId: string
  catalogVariationId: string
}

export type CartTopping = {
  id: string
  name: string
  price: number
}

export type CartItem = NormalizedItem & {
  quantity: number
  toppings: NormalizedTopping[]
}

export type SquareMoney = {
  amount: number
  currency: string
}

export type SquareModifier = {
  id: string
  type: 'MODIFIER'
  modifier_data: {
    name: string
    price_money?: SquareMoney
    on_by_default?: boolean
    ordinal?: number
    modifier_list_id?: string
    hidden_online?: boolean
  }
}

export type SquareModifierList = {
  id: string
  type: 'MODIFIER_LIST'
  modifier_list_data: {
    name: string
    modifiers: {
      id: string
      type: 'MODIFIER'
      modifier_data: {
        name: string
        price_money?: { amount: number; currency: string }
        on_by_default?: boolean
      }
    }[]
  }
}

export type SquareOrder = {
  id: string
  locationId: string
  referenceId?: string
  state?: 'OPEN' | 'COMPLETED' | string
  createdAt?: string
  updatedAt?: string
  lineItems?: Array<{
    uid: string
    catalogObjectId: string
    catalogVersion: string
    quantity: string
    name: string
    variationName?: string
    basePriceMoney?: Money
    grossSalesMoney?: Money
    totalTaxMoney?: Money
    totalDiscountMoney?: Money
    totalMoney?: Money
    variationTotalPriceMoney?: Money
    metadata?: Record<string, string>
    appliedTaxes?: Array<{
      uid: string
      taxUid: string
      appliedMoney: Money
    }>
    itemType?: 'ITEM' | string
    totalServiceChargeMoney?: Money
  }>
  taxes?: Array<{
    uid: string
    name: string
    percentage: string
    type: string
    scope: string
    appliedMoney: Money
  }>
  fulfillments?: Array<{
    uid: string
    type: 'PICKUP' | string
    state: 'PROPOSED' | 'PREPARED' | 'COMPLETED' | string
    pickupDetails?: {
      pickupAt?: string
      placedAt?: string
      note?: string
      recipient?: {
        displayName?: string
        emailAddress?: string
        phoneNumber?: string
      }
    }
  }>
  metadata?: {
    menuSlug?: string
    ticketNumber?: string
  }
  totalMoney?: Money
  totalTaxMoney?: Money
  totalDiscountMoney?: Money
  totalTipMoney?: Money
  totalServiceChargeMoney?: Money
  netAmounts?: {
    totalMoney?: Money
    taxMoney?: Money
    discountMoney?: Money
    tipMoney?: Money
    serviceChargeMoney?: Money
  }
  tenders?: Array<{
    id: string
    locationId: string
    transactionId: string
    createdAt: string
    amountMoney: Money
    type: string
    paymentId: string
  }>
  source?: {
    name: string
  }
  ticketName?: string
  netAmountDueMoney?: Money
  version?: number
}

type Money = {
  amount: string | number
  currency: string
}

export type SquareItemVariation = {
  id: string
  type: 'ITEM_VARIATION'
  item_variation_data: {
    item_id: string
    name: string
    price_money?: SquareMoney
    modifier_list_info?: {
      modifier_list_id: string
      enabled: boolean
    }[]
  }
}

export type SquareItem = {
  id: string
  type: 'ITEM'
  item_data: {
    name: string
    description?: string
    image_url?: string
    variations: SquareItemVariation[]
    modifier_list_info?: {
      modifier_list_id: string
      enabled: boolean
      min_selected_modifiers?: number
      max_selected_modifiers?: number
    }[]
  }
}

export type SquareCatalogObject = SquareItem | SquareModifier | SquareModifierList | SquareItemVariation

export type HydratedCatalog = {
  item: SquareCatalogObject
  modifierLists: SquareModifierList[]
}
