import { type Schema } from '@/amplify/data/resource'

export type Menu = Schema['Menu']['type']

export interface NormalizedTopping {
  id: string
  name: string
  price: number // in cents
  groupName: string
  isDefault?: boolean // optional
  isLocked?: boolean // optional
}

export interface NormalizedItem {
  id: string
  name: string
  description?: string
  price: number // in cents
  image?: string
  toppings: NormalizedTopping[]
}

export type CartTopping = {
  id: string
  name: string
  price: number
}

export type CartItem = {
  id: string
  name: string
  basePrice: number
  quantity: number
  toppings: CartTopping[]
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

export type SquareItemVariation = {
  id: string
  type: 'ITEM_VARIATION'
  item_variation_data: {
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
