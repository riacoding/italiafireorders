/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CatalogItem = {
  __typename: 'CatalogItem'
  catalogData: string
  createdAt: string
  id: string
  menuItem?: MenuItem | null
  squareItemId: string
  updatedAt: string
}

export type MenuItem = {
  __typename: 'MenuItem'
  catalogItem?: CatalogItem | null
  catalogItemId: string
  createdAt: string
  customName?: string | null
  id: string
  isFeatured?: boolean | null
  menu?: Menu | null
  menuId: string
  owner?: string | null
  s3ImageKey?: string | null
  sortOrder?: number | null
  toppings?: ModelItemToppingConnection | null
  updatedAt: string
}

export type Menu = {
  __typename: 'Menu'
  createdAt: string
  id: string
  isActive?: boolean | null
  locationId: string
  logo?: string | null
  menuItems?: ModelMenuItemConnection | null
  name: string
  theme?: string | null
  updatedAt: string
}

export type ModelMenuItemConnection = {
  __typename: 'ModelMenuItemConnection'
  items: Array<MenuItem | null>
  nextToken?: string | null
}

export type ModelItemToppingConnection = {
  __typename: 'ModelItemToppingConnection'
  items: Array<ItemTopping | null>
  nextToken?: string | null
}

export type ItemTopping = {
  __typename: 'ItemTopping'
  createdAt: string
  id: string
  isDefault?: boolean | null
  isLocked?: boolean | null
  menuItem?: MenuItem | null
  menuItemId: string
  owner?: string | null
  topping?: Topping | null
  toppingId: string
  updatedAt: string
}

export type Topping = {
  __typename: 'Topping'
  createdAt: string
  id: string
  itemToppings?: ModelItemToppingConnection | null
  name: string
  owner?: string | null
  price: number
  updatedAt: string
}

export type TicketCounter = {
  __typename: 'TicketCounter'
  counter?: number | null
  createdAt: string
  expiresAt?: number | null
  id: string
  updatedAt: string
}

export type ModelCatalogItemFilterInput = {
  and?: Array<ModelCatalogItemFilterInput | null> | null
  catalogData?: ModelStringInput | null
  createdAt?: ModelStringInput | null
  id?: ModelIDInput | null
  not?: ModelCatalogItemFilterInput | null
  or?: Array<ModelCatalogItemFilterInput | null> | null
  squareItemId?: ModelStringInput | null
  updatedAt?: ModelStringInput | null
}

export type ModelStringInput = {
  attributeExists?: boolean | null
  attributeType?: ModelAttributeTypes | null
  beginsWith?: string | null
  between?: Array<string | null> | null
  contains?: string | null
  eq?: string | null
  ge?: string | null
  gt?: string | null
  le?: string | null
  lt?: string | null
  ne?: string | null
  notContains?: string | null
  size?: ModelSizeInput | null
}

export enum ModelAttributeTypes {
  _null = '_null',
  binary = 'binary',
  binarySet = 'binarySet',
  bool = 'bool',
  list = 'list',
  map = 'map',
  number = 'number',
  numberSet = 'numberSet',
  string = 'string',
  stringSet = 'stringSet',
}

export type ModelSizeInput = {
  between?: Array<number | null> | null
  eq?: number | null
  ge?: number | null
  gt?: number | null
  le?: number | null
  lt?: number | null
  ne?: number | null
}

export type ModelIDInput = {
  attributeExists?: boolean | null
  attributeType?: ModelAttributeTypes | null
  beginsWith?: string | null
  between?: Array<string | null> | null
  contains?: string | null
  eq?: string | null
  ge?: string | null
  gt?: string | null
  le?: string | null
  lt?: string | null
  ne?: string | null
  notContains?: string | null
  size?: ModelSizeInput | null
}

export enum ModelSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type ModelCatalogItemConnection = {
  __typename: 'ModelCatalogItemConnection'
  items: Array<CatalogItem | null>
  nextToken?: string | null
}

export type ModelItemToppingFilterInput = {
  and?: Array<ModelItemToppingFilterInput | null> | null
  createdAt?: ModelStringInput | null
  id?: ModelIDInput | null
  isDefault?: ModelBooleanInput | null
  isLocked?: ModelBooleanInput | null
  menuItemId?: ModelIDInput | null
  not?: ModelItemToppingFilterInput | null
  or?: Array<ModelItemToppingFilterInput | null> | null
  owner?: ModelStringInput | null
  toppingId?: ModelIDInput | null
  updatedAt?: ModelStringInput | null
}

export type ModelBooleanInput = {
  attributeExists?: boolean | null
  attributeType?: ModelAttributeTypes | null
  eq?: boolean | null
  ne?: boolean | null
}

export type ModelMenuItemFilterInput = {
  and?: Array<ModelMenuItemFilterInput | null> | null
  catalogItemId?: ModelIDInput | null
  createdAt?: ModelStringInput | null
  customName?: ModelStringInput | null
  id?: ModelIDInput | null
  isFeatured?: ModelBooleanInput | null
  menuId?: ModelIDInput | null
  not?: ModelMenuItemFilterInput | null
  or?: Array<ModelMenuItemFilterInput | null> | null
  owner?: ModelStringInput | null
  s3ImageKey?: ModelStringInput | null
  sortOrder?: ModelIntInput | null
  updatedAt?: ModelStringInput | null
}

export type ModelIntInput = {
  attributeExists?: boolean | null
  attributeType?: ModelAttributeTypes | null
  between?: Array<number | null> | null
  eq?: number | null
  ge?: number | null
  gt?: number | null
  le?: number | null
  lt?: number | null
  ne?: number | null
}

export type ModelMenuFilterInput = {
  and?: Array<ModelMenuFilterInput | null> | null
  createdAt?: ModelStringInput | null
  id?: ModelIDInput | null
  isActive?: ModelBooleanInput | null
  locationId?: ModelStringInput | null
  logo?: ModelStringInput | null
  name?: ModelStringInput | null
  not?: ModelMenuFilterInput | null
  or?: Array<ModelMenuFilterInput | null> | null
  theme?: ModelStringInput | null
  updatedAt?: ModelStringInput | null
}

export type ModelMenuConnection = {
  __typename: 'ModelMenuConnection'
  items: Array<Menu | null>
  nextToken?: string | null
}

export type ModelTicketCounterFilterInput = {
  and?: Array<ModelTicketCounterFilterInput | null> | null
  counter?: ModelIntInput | null
  createdAt?: ModelStringInput | null
  expiresAt?: ModelIntInput | null
  id?: ModelIDInput | null
  not?: ModelTicketCounterFilterInput | null
  or?: Array<ModelTicketCounterFilterInput | null> | null
  updatedAt?: ModelStringInput | null
}

export type ModelTicketCounterConnection = {
  __typename: 'ModelTicketCounterConnection'
  items: Array<TicketCounter | null>
  nextToken?: string | null
}

export type ModelToppingFilterInput = {
  and?: Array<ModelToppingFilterInput | null> | null
  createdAt?: ModelStringInput | null
  id?: ModelIDInput | null
  name?: ModelStringInput | null
  not?: ModelToppingFilterInput | null
  or?: Array<ModelToppingFilterInput | null> | null
  owner?: ModelStringInput | null
  price?: ModelFloatInput | null
  updatedAt?: ModelStringInput | null
}

export type ModelFloatInput = {
  attributeExists?: boolean | null
  attributeType?: ModelAttributeTypes | null
  between?: Array<number | null> | null
  eq?: number | null
  ge?: number | null
  gt?: number | null
  le?: number | null
  lt?: number | null
  ne?: number | null
}

export type ModelToppingConnection = {
  __typename: 'ModelToppingConnection'
  items: Array<Topping | null>
  nextToken?: string | null
}

export type ModelCatalogItemConditionInput = {
  and?: Array<ModelCatalogItemConditionInput | null> | null
  catalogData?: ModelStringInput | null
  createdAt?: ModelStringInput | null
  not?: ModelCatalogItemConditionInput | null
  or?: Array<ModelCatalogItemConditionInput | null> | null
  squareItemId?: ModelStringInput | null
  updatedAt?: ModelStringInput | null
}

export type CreateCatalogItemInput = {
  catalogData: string
  id?: string | null
  squareItemId: string
}

export type ModelItemToppingConditionInput = {
  and?: Array<ModelItemToppingConditionInput | null> | null
  createdAt?: ModelStringInput | null
  isDefault?: ModelBooleanInput | null
  isLocked?: ModelBooleanInput | null
  menuItemId?: ModelIDInput | null
  not?: ModelItemToppingConditionInput | null
  or?: Array<ModelItemToppingConditionInput | null> | null
  owner?: ModelStringInput | null
  toppingId?: ModelIDInput | null
  updatedAt?: ModelStringInput | null
}

export type CreateItemToppingInput = {
  id?: string | null
  isDefault?: boolean | null
  isLocked?: boolean | null
  menuItemId: string
  toppingId: string
}

export type ModelMenuConditionInput = {
  and?: Array<ModelMenuConditionInput | null> | null
  createdAt?: ModelStringInput | null
  isActive?: ModelBooleanInput | null
  locationId?: ModelStringInput | null
  logo?: ModelStringInput | null
  name?: ModelStringInput | null
  not?: ModelMenuConditionInput | null
  or?: Array<ModelMenuConditionInput | null> | null
  theme?: ModelStringInput | null
  updatedAt?: ModelStringInput | null
}

export type CreateMenuInput = {
  id?: string | null
  isActive?: boolean | null
  locationId: string
  logo?: string | null
  name: string
  theme?: string | null
}

export type ModelMenuItemConditionInput = {
  and?: Array<ModelMenuItemConditionInput | null> | null
  catalogItemId?: ModelIDInput | null
  createdAt?: ModelStringInput | null
  customName?: ModelStringInput | null
  isFeatured?: ModelBooleanInput | null
  menuId?: ModelIDInput | null
  not?: ModelMenuItemConditionInput | null
  or?: Array<ModelMenuItemConditionInput | null> | null
  owner?: ModelStringInput | null
  s3ImageKey?: ModelStringInput | null
  sortOrder?: ModelIntInput | null
  updatedAt?: ModelStringInput | null
}

export type CreateMenuItemInput = {
  catalogItemId: string
  customName?: string | null
  id?: string | null
  isFeatured?: boolean | null
  menuId: string
  s3ImageKey?: string | null
  sortOrder?: number | null
}

export type ModelTicketCounterConditionInput = {
  and?: Array<ModelTicketCounterConditionInput | null> | null
  counter?: ModelIntInput | null
  createdAt?: ModelStringInput | null
  expiresAt?: ModelIntInput | null
  not?: ModelTicketCounterConditionInput | null
  or?: Array<ModelTicketCounterConditionInput | null> | null
  updatedAt?: ModelStringInput | null
}

export type CreateTicketCounterInput = {
  counter?: number | null
  expiresAt?: number | null
  id?: string | null
}

export type ModelToppingConditionInput = {
  and?: Array<ModelToppingConditionInput | null> | null
  createdAt?: ModelStringInput | null
  name?: ModelStringInput | null
  not?: ModelToppingConditionInput | null
  or?: Array<ModelToppingConditionInput | null> | null
  owner?: ModelStringInput | null
  price?: ModelFloatInput | null
  updatedAt?: ModelStringInput | null
}

export type CreateToppingInput = {
  id?: string | null
  name: string
  price: number
}

export type DeleteCatalogItemInput = {
  id: string
}

export type DeleteItemToppingInput = {
  id: string
}

export type DeleteMenuInput = {
  id: string
}

export type DeleteMenuItemInput = {
  id: string
}

export type DeleteTicketCounterInput = {
  id: string
}

export type DeleteToppingInput = {
  id: string
}

export type UpdateCatalogItemInput = {
  catalogData?: string | null
  id: string
  squareItemId?: string | null
}

export type UpdateItemToppingInput = {
  id: string
  isDefault?: boolean | null
  isLocked?: boolean | null
  menuItemId?: string | null
  toppingId?: string | null
}

export type UpdateMenuInput = {
  id: string
  isActive?: boolean | null
  locationId?: string | null
  logo?: string | null
  name?: string | null
  theme?: string | null
}

export type UpdateMenuItemInput = {
  catalogItemId?: string | null
  customName?: string | null
  id: string
  isFeatured?: boolean | null
  menuId?: string | null
  s3ImageKey?: string | null
  sortOrder?: number | null
}

export type UpdateTicketCounterInput = {
  counter?: number | null
  expiresAt?: number | null
  id: string
}

export type UpdateToppingInput = {
  id: string
  name?: string | null
  price?: number | null
}

export type ModelSubscriptionCatalogItemFilterInput = {
  and?: Array<ModelSubscriptionCatalogItemFilterInput | null> | null
  catalogData?: ModelSubscriptionStringInput | null
  createdAt?: ModelSubscriptionStringInput | null
  id?: ModelSubscriptionIDInput | null
  or?: Array<ModelSubscriptionCatalogItemFilterInput | null> | null
  squareItemId?: ModelSubscriptionStringInput | null
  updatedAt?: ModelSubscriptionStringInput | null
}

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null
  between?: Array<string | null> | null
  contains?: string | null
  eq?: string | null
  ge?: string | null
  gt?: string | null
  in?: Array<string | null> | null
  le?: string | null
  lt?: string | null
  ne?: string | null
  notContains?: string | null
  notIn?: Array<string | null> | null
}

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null
  between?: Array<string | null> | null
  contains?: string | null
  eq?: string | null
  ge?: string | null
  gt?: string | null
  in?: Array<string | null> | null
  le?: string | null
  lt?: string | null
  ne?: string | null
  notContains?: string | null
  notIn?: Array<string | null> | null
}

export type ModelSubscriptionItemToppingFilterInput = {
  and?: Array<ModelSubscriptionItemToppingFilterInput | null> | null
  createdAt?: ModelSubscriptionStringInput | null
  id?: ModelSubscriptionIDInput | null
  isDefault?: ModelSubscriptionBooleanInput | null
  isLocked?: ModelSubscriptionBooleanInput | null
  menuItemId?: ModelSubscriptionIDInput | null
  or?: Array<ModelSubscriptionItemToppingFilterInput | null> | null
  owner?: ModelStringInput | null
  toppingId?: ModelSubscriptionIDInput | null
  updatedAt?: ModelSubscriptionStringInput | null
}

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null
  ne?: boolean | null
}

export type ModelSubscriptionMenuFilterInput = {
  and?: Array<ModelSubscriptionMenuFilterInput | null> | null
  createdAt?: ModelSubscriptionStringInput | null
  id?: ModelSubscriptionIDInput | null
  isActive?: ModelSubscriptionBooleanInput | null
  locationId?: ModelSubscriptionStringInput | null
  logo?: ModelSubscriptionStringInput | null
  name?: ModelSubscriptionStringInput | null
  or?: Array<ModelSubscriptionMenuFilterInput | null> | null
  theme?: ModelSubscriptionStringInput | null
  updatedAt?: ModelSubscriptionStringInput | null
}

export type ModelSubscriptionMenuItemFilterInput = {
  and?: Array<ModelSubscriptionMenuItemFilterInput | null> | null
  catalogItemId?: ModelSubscriptionIDInput | null
  createdAt?: ModelSubscriptionStringInput | null
  customName?: ModelSubscriptionStringInput | null
  id?: ModelSubscriptionIDInput | null
  isFeatured?: ModelSubscriptionBooleanInput | null
  menuId?: ModelSubscriptionIDInput | null
  or?: Array<ModelSubscriptionMenuItemFilterInput | null> | null
  owner?: ModelStringInput | null
  s3ImageKey?: ModelSubscriptionStringInput | null
  sortOrder?: ModelSubscriptionIntInput | null
  updatedAt?: ModelSubscriptionStringInput | null
}

export type ModelSubscriptionIntInput = {
  between?: Array<number | null> | null
  eq?: number | null
  ge?: number | null
  gt?: number | null
  in?: Array<number | null> | null
  le?: number | null
  lt?: number | null
  ne?: number | null
  notIn?: Array<number | null> | null
}

export type ModelSubscriptionTicketCounterFilterInput = {
  and?: Array<ModelSubscriptionTicketCounterFilterInput | null> | null
  counter?: ModelSubscriptionIntInput | null
  createdAt?: ModelSubscriptionStringInput | null
  expiresAt?: ModelSubscriptionIntInput | null
  id?: ModelSubscriptionIDInput | null
  or?: Array<ModelSubscriptionTicketCounterFilterInput | null> | null
  updatedAt?: ModelSubscriptionStringInput | null
}

export type ModelSubscriptionToppingFilterInput = {
  and?: Array<ModelSubscriptionToppingFilterInput | null> | null
  createdAt?: ModelSubscriptionStringInput | null
  id?: ModelSubscriptionIDInput | null
  name?: ModelSubscriptionStringInput | null
  or?: Array<ModelSubscriptionToppingFilterInput | null> | null
  owner?: ModelStringInput | null
  price?: ModelSubscriptionFloatInput | null
  updatedAt?: ModelSubscriptionStringInput | null
}

export type ModelSubscriptionFloatInput = {
  between?: Array<number | null> | null
  eq?: number | null
  ge?: number | null
  gt?: number | null
  in?: Array<number | null> | null
  le?: number | null
  lt?: number | null
  ne?: number | null
  notIn?: Array<number | null> | null
}

export type GetCatalogItemQueryVariables = {
  id: string
}

export type GetCatalogItemQuery = {
  getCatalogItem?: {
    __typename: 'CatalogItem'
    catalogData: string
    createdAt: string
    id: string
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    squareItemId: string
    updatedAt: string
  } | null
}

export type GetItemToppingQueryVariables = {
  id: string
}

export type GetItemToppingQuery = {
  getItemTopping?: {
    __typename: 'ItemTopping'
    createdAt: string
    id: string
    isDefault?: boolean | null
    isLocked?: boolean | null
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    menuItemId: string
    owner?: string | null
    topping?: {
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null
    toppingId: string
    updatedAt: string
  } | null
}

export type GetMenuQueryVariables = {
  id: string
}

export type GetMenuQuery = {
  getMenu?: {
    __typename: 'Menu'
    createdAt: string
    id: string
    isActive?: boolean | null
    locationId: string
    logo?: string | null
    menuItems?: {
      __typename: 'ModelMenuItemConnection'
      nextToken?: string | null
    } | null
    name: string
    theme?: string | null
    updatedAt: string
  } | null
}

export type GetMenuItemQueryVariables = {
  id: string
}

export type GetMenuItemQuery = {
  getMenuItem?: {
    __typename: 'MenuItem'
    catalogItem?: {
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null
    catalogItemId: string
    createdAt: string
    customName?: string | null
    id: string
    isFeatured?: boolean | null
    menu?: {
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null
    menuId: string
    owner?: string | null
    s3ImageKey?: string | null
    sortOrder?: number | null
    toppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    updatedAt: string
  } | null
}

export type GetTicketCounterQueryVariables = {
  id: string
}

export type GetTicketCounterQuery = {
  getTicketCounter?: {
    __typename: 'TicketCounter'
    counter?: number | null
    createdAt: string
    expiresAt?: number | null
    id: string
    updatedAt: string
  } | null
}

export type GetToppingQueryVariables = {
  id: string
}

export type GetToppingQuery = {
  getTopping?: {
    __typename: 'Topping'
    createdAt: string
    id: string
    itemToppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    name: string
    owner?: string | null
    price: number
    updatedAt: string
  } | null
}

export type ListCatalogItemsQueryVariables = {
  filter?: ModelCatalogItemFilterInput | null
  id?: string | null
  limit?: number | null
  nextToken?: string | null
  sortDirection?: ModelSortDirection | null
}

export type ListCatalogItemsQuery = {
  listCatalogItems?: {
    __typename: 'ModelCatalogItemConnection'
    items: Array<{
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null>
    nextToken?: string | null
  } | null
}

export type ListItemToppingsQueryVariables = {
  filter?: ModelItemToppingFilterInput | null
  id?: string | null
  limit?: number | null
  nextToken?: string | null
  sortDirection?: ModelSortDirection | null
}

export type ListItemToppingsQuery = {
  listItemToppings?: {
    __typename: 'ModelItemToppingConnection'
    items: Array<{
      __typename: 'ItemTopping'
      createdAt: string
      id: string
      isDefault?: boolean | null
      isLocked?: boolean | null
      menuItemId: string
      owner?: string | null
      toppingId: string
      updatedAt: string
    } | null>
    nextToken?: string | null
  } | null
}

export type ListMenuItemsQueryVariables = {
  filter?: ModelMenuItemFilterInput | null
  id?: string | null
  limit?: number | null
  nextToken?: string | null
  sortDirection?: ModelSortDirection | null
}

export type ListMenuItemsQuery = {
  listMenuItems?: {
    __typename: 'ModelMenuItemConnection'
    items: Array<{
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null>
    nextToken?: string | null
  } | null
}

export type ListMenusQueryVariables = {
  filter?: ModelMenuFilterInput | null
  id?: string | null
  limit?: number | null
  nextToken?: string | null
  sortDirection?: ModelSortDirection | null
}

export type ListMenusQuery = {
  listMenus?: {
    __typename: 'ModelMenuConnection'
    items: Array<{
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null>
    nextToken?: string | null
  } | null
}

export type ListTicketCountersQueryVariables = {
  filter?: ModelTicketCounterFilterInput | null
  id?: string | null
  limit?: number | null
  nextToken?: string | null
  sortDirection?: ModelSortDirection | null
}

export type ListTicketCountersQuery = {
  listTicketCounters?: {
    __typename: 'ModelTicketCounterConnection'
    items: Array<{
      __typename: 'TicketCounter'
      counter?: number | null
      createdAt: string
      expiresAt?: number | null
      id: string
      updatedAt: string
    } | null>
    nextToken?: string | null
  } | null
}

export type ListToppingsQueryVariables = {
  filter?: ModelToppingFilterInput | null
  id?: string | null
  limit?: number | null
  nextToken?: string | null
  sortDirection?: ModelSortDirection | null
}

export type ListToppingsQuery = {
  listToppings?: {
    __typename: 'ModelToppingConnection'
    items: Array<{
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null>
    nextToken?: string | null
  } | null
}

export type CreateCatalogItemMutationVariables = {
  condition?: ModelCatalogItemConditionInput | null
  input: CreateCatalogItemInput
}

export type CreateCatalogItemMutation = {
  createCatalogItem?: {
    __typename: 'CatalogItem'
    catalogData: string
    createdAt: string
    id: string
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    squareItemId: string
    updatedAt: string
  } | null
}

export type CreateItemToppingMutationVariables = {
  condition?: ModelItemToppingConditionInput | null
  input: CreateItemToppingInput
}

export type CreateItemToppingMutation = {
  createItemTopping?: {
    __typename: 'ItemTopping'
    createdAt: string
    id: string
    isDefault?: boolean | null
    isLocked?: boolean | null
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    menuItemId: string
    owner?: string | null
    topping?: {
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null
    toppingId: string
    updatedAt: string
  } | null
}

export type CreateMenuMutationVariables = {
  condition?: ModelMenuConditionInput | null
  input: CreateMenuInput
}

export type CreateMenuMutation = {
  createMenu?: {
    __typename: 'Menu'
    createdAt: string
    id: string
    isActive?: boolean | null
    locationId: string
    logo?: string | null
    menuItems?: {
      __typename: 'ModelMenuItemConnection'
      nextToken?: string | null
    } | null
    name: string
    theme?: string | null
    updatedAt: string
  } | null
}

export type CreateMenuItemMutationVariables = {
  condition?: ModelMenuItemConditionInput | null
  input: CreateMenuItemInput
}

export type CreateMenuItemMutation = {
  createMenuItem?: {
    __typename: 'MenuItem'
    catalogItem?: {
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null
    catalogItemId: string
    createdAt: string
    customName?: string | null
    id: string
    isFeatured?: boolean | null
    menu?: {
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null
    menuId: string
    owner?: string | null
    s3ImageKey?: string | null
    sortOrder?: number | null
    toppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    updatedAt: string
  } | null
}

export type CreateTicketCounterMutationVariables = {
  condition?: ModelTicketCounterConditionInput | null
  input: CreateTicketCounterInput
}

export type CreateTicketCounterMutation = {
  createTicketCounter?: {
    __typename: 'TicketCounter'
    counter?: number | null
    createdAt: string
    expiresAt?: number | null
    id: string
    updatedAt: string
  } | null
}

export type CreateToppingMutationVariables = {
  condition?: ModelToppingConditionInput | null
  input: CreateToppingInput
}

export type CreateToppingMutation = {
  createTopping?: {
    __typename: 'Topping'
    createdAt: string
    id: string
    itemToppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    name: string
    owner?: string | null
    price: number
    updatedAt: string
  } | null
}

export type DeleteCatalogItemMutationVariables = {
  condition?: ModelCatalogItemConditionInput | null
  input: DeleteCatalogItemInput
}

export type DeleteCatalogItemMutation = {
  deleteCatalogItem?: {
    __typename: 'CatalogItem'
    catalogData: string
    createdAt: string
    id: string
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    squareItemId: string
    updatedAt: string
  } | null
}

export type DeleteItemToppingMutationVariables = {
  condition?: ModelItemToppingConditionInput | null
  input: DeleteItemToppingInput
}

export type DeleteItemToppingMutation = {
  deleteItemTopping?: {
    __typename: 'ItemTopping'
    createdAt: string
    id: string
    isDefault?: boolean | null
    isLocked?: boolean | null
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    menuItemId: string
    owner?: string | null
    topping?: {
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null
    toppingId: string
    updatedAt: string
  } | null
}

export type DeleteMenuMutationVariables = {
  condition?: ModelMenuConditionInput | null
  input: DeleteMenuInput
}

export type DeleteMenuMutation = {
  deleteMenu?: {
    __typename: 'Menu'
    createdAt: string
    id: string
    isActive?: boolean | null
    locationId: string
    logo?: string | null
    menuItems?: {
      __typename: 'ModelMenuItemConnection'
      nextToken?: string | null
    } | null
    name: string
    theme?: string | null
    updatedAt: string
  } | null
}

export type DeleteMenuItemMutationVariables = {
  condition?: ModelMenuItemConditionInput | null
  input: DeleteMenuItemInput
}

export type DeleteMenuItemMutation = {
  deleteMenuItem?: {
    __typename: 'MenuItem'
    catalogItem?: {
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null
    catalogItemId: string
    createdAt: string
    customName?: string | null
    id: string
    isFeatured?: boolean | null
    menu?: {
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null
    menuId: string
    owner?: string | null
    s3ImageKey?: string | null
    sortOrder?: number | null
    toppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    updatedAt: string
  } | null
}

export type DeleteTicketCounterMutationVariables = {
  condition?: ModelTicketCounterConditionInput | null
  input: DeleteTicketCounterInput
}

export type DeleteTicketCounterMutation = {
  deleteTicketCounter?: {
    __typename: 'TicketCounter'
    counter?: number | null
    createdAt: string
    expiresAt?: number | null
    id: string
    updatedAt: string
  } | null
}

export type DeleteToppingMutationVariables = {
  condition?: ModelToppingConditionInput | null
  input: DeleteToppingInput
}

export type DeleteToppingMutation = {
  deleteTopping?: {
    __typename: 'Topping'
    createdAt: string
    id: string
    itemToppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    name: string
    owner?: string | null
    price: number
    updatedAt: string
  } | null
}

export type UpdateCatalogItemMutationVariables = {
  condition?: ModelCatalogItemConditionInput | null
  input: UpdateCatalogItemInput
}

export type UpdateCatalogItemMutation = {
  updateCatalogItem?: {
    __typename: 'CatalogItem'
    catalogData: string
    createdAt: string
    id: string
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    squareItemId: string
    updatedAt: string
  } | null
}

export type UpdateItemToppingMutationVariables = {
  condition?: ModelItemToppingConditionInput | null
  input: UpdateItemToppingInput
}

export type UpdateItemToppingMutation = {
  updateItemTopping?: {
    __typename: 'ItemTopping'
    createdAt: string
    id: string
    isDefault?: boolean | null
    isLocked?: boolean | null
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    menuItemId: string
    owner?: string | null
    topping?: {
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null
    toppingId: string
    updatedAt: string
  } | null
}

export type UpdateMenuMutationVariables = {
  condition?: ModelMenuConditionInput | null
  input: UpdateMenuInput
}

export type UpdateMenuMutation = {
  updateMenu?: {
    __typename: 'Menu'
    createdAt: string
    id: string
    isActive?: boolean | null
    locationId: string
    logo?: string | null
    menuItems?: {
      __typename: 'ModelMenuItemConnection'
      nextToken?: string | null
    } | null
    name: string
    theme?: string | null
    updatedAt: string
  } | null
}

export type UpdateMenuItemMutationVariables = {
  condition?: ModelMenuItemConditionInput | null
  input: UpdateMenuItemInput
}

export type UpdateMenuItemMutation = {
  updateMenuItem?: {
    __typename: 'MenuItem'
    catalogItem?: {
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null
    catalogItemId: string
    createdAt: string
    customName?: string | null
    id: string
    isFeatured?: boolean | null
    menu?: {
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null
    menuId: string
    owner?: string | null
    s3ImageKey?: string | null
    sortOrder?: number | null
    toppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    updatedAt: string
  } | null
}

export type UpdateTicketCounterMutationVariables = {
  condition?: ModelTicketCounterConditionInput | null
  input: UpdateTicketCounterInput
}

export type UpdateTicketCounterMutation = {
  updateTicketCounter?: {
    __typename: 'TicketCounter'
    counter?: number | null
    createdAt: string
    expiresAt?: number | null
    id: string
    updatedAt: string
  } | null
}

export type UpdateToppingMutationVariables = {
  condition?: ModelToppingConditionInput | null
  input: UpdateToppingInput
}

export type UpdateToppingMutation = {
  updateTopping?: {
    __typename: 'Topping'
    createdAt: string
    id: string
    itemToppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    name: string
    owner?: string | null
    price: number
    updatedAt: string
  } | null
}

export type OnCreateCatalogItemSubscriptionVariables = {
  filter?: ModelSubscriptionCatalogItemFilterInput | null
}

export type OnCreateCatalogItemSubscription = {
  onCreateCatalogItem?: {
    __typename: 'CatalogItem'
    catalogData: string
    createdAt: string
    id: string
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    squareItemId: string
    updatedAt: string
  } | null
}

export type OnCreateItemToppingSubscriptionVariables = {
  filter?: ModelSubscriptionItemToppingFilterInput | null
  owner?: string | null
}

export type OnCreateItemToppingSubscription = {
  onCreateItemTopping?: {
    __typename: 'ItemTopping'
    createdAt: string
    id: string
    isDefault?: boolean | null
    isLocked?: boolean | null
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    menuItemId: string
    owner?: string | null
    topping?: {
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null
    toppingId: string
    updatedAt: string
  } | null
}

export type OnCreateMenuSubscriptionVariables = {
  filter?: ModelSubscriptionMenuFilterInput | null
}

export type OnCreateMenuSubscription = {
  onCreateMenu?: {
    __typename: 'Menu'
    createdAt: string
    id: string
    isActive?: boolean | null
    locationId: string
    logo?: string | null
    menuItems?: {
      __typename: 'ModelMenuItemConnection'
      nextToken?: string | null
    } | null
    name: string
    theme?: string | null
    updatedAt: string
  } | null
}

export type OnCreateMenuItemSubscriptionVariables = {
  filter?: ModelSubscriptionMenuItemFilterInput | null
  owner?: string | null
}

export type OnCreateMenuItemSubscription = {
  onCreateMenuItem?: {
    __typename: 'MenuItem'
    catalogItem?: {
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null
    catalogItemId: string
    createdAt: string
    customName?: string | null
    id: string
    isFeatured?: boolean | null
    menu?: {
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null
    menuId: string
    owner?: string | null
    s3ImageKey?: string | null
    sortOrder?: number | null
    toppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    updatedAt: string
  } | null
}

export type OnCreateTicketCounterSubscriptionVariables = {
  filter?: ModelSubscriptionTicketCounterFilterInput | null
}

export type OnCreateTicketCounterSubscription = {
  onCreateTicketCounter?: {
    __typename: 'TicketCounter'
    counter?: number | null
    createdAt: string
    expiresAt?: number | null
    id: string
    updatedAt: string
  } | null
}

export type OnCreateToppingSubscriptionVariables = {
  filter?: ModelSubscriptionToppingFilterInput | null
  owner?: string | null
}

export type OnCreateToppingSubscription = {
  onCreateTopping?: {
    __typename: 'Topping'
    createdAt: string
    id: string
    itemToppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    name: string
    owner?: string | null
    price: number
    updatedAt: string
  } | null
}

export type OnDeleteCatalogItemSubscriptionVariables = {
  filter?: ModelSubscriptionCatalogItemFilterInput | null
}

export type OnDeleteCatalogItemSubscription = {
  onDeleteCatalogItem?: {
    __typename: 'CatalogItem'
    catalogData: string
    createdAt: string
    id: string
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    squareItemId: string
    updatedAt: string
  } | null
}

export type OnDeleteItemToppingSubscriptionVariables = {
  filter?: ModelSubscriptionItemToppingFilterInput | null
  owner?: string | null
}

export type OnDeleteItemToppingSubscription = {
  onDeleteItemTopping?: {
    __typename: 'ItemTopping'
    createdAt: string
    id: string
    isDefault?: boolean | null
    isLocked?: boolean | null
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    menuItemId: string
    owner?: string | null
    topping?: {
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null
    toppingId: string
    updatedAt: string
  } | null
}

export type OnDeleteMenuSubscriptionVariables = {
  filter?: ModelSubscriptionMenuFilterInput | null
}

export type OnDeleteMenuSubscription = {
  onDeleteMenu?: {
    __typename: 'Menu'
    createdAt: string
    id: string
    isActive?: boolean | null
    locationId: string
    logo?: string | null
    menuItems?: {
      __typename: 'ModelMenuItemConnection'
      nextToken?: string | null
    } | null
    name: string
    theme?: string | null
    updatedAt: string
  } | null
}

export type OnDeleteMenuItemSubscriptionVariables = {
  filter?: ModelSubscriptionMenuItemFilterInput | null
  owner?: string | null
}

export type OnDeleteMenuItemSubscription = {
  onDeleteMenuItem?: {
    __typename: 'MenuItem'
    catalogItem?: {
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null
    catalogItemId: string
    createdAt: string
    customName?: string | null
    id: string
    isFeatured?: boolean | null
    menu?: {
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null
    menuId: string
    owner?: string | null
    s3ImageKey?: string | null
    sortOrder?: number | null
    toppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    updatedAt: string
  } | null
}

export type OnDeleteTicketCounterSubscriptionVariables = {
  filter?: ModelSubscriptionTicketCounterFilterInput | null
}

export type OnDeleteTicketCounterSubscription = {
  onDeleteTicketCounter?: {
    __typename: 'TicketCounter'
    counter?: number | null
    createdAt: string
    expiresAt?: number | null
    id: string
    updatedAt: string
  } | null
}

export type OnDeleteToppingSubscriptionVariables = {
  filter?: ModelSubscriptionToppingFilterInput | null
  owner?: string | null
}

export type OnDeleteToppingSubscription = {
  onDeleteTopping?: {
    __typename: 'Topping'
    createdAt: string
    id: string
    itemToppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    name: string
    owner?: string | null
    price: number
    updatedAt: string
  } | null
}

export type OnUpdateCatalogItemSubscriptionVariables = {
  filter?: ModelSubscriptionCatalogItemFilterInput | null
}

export type OnUpdateCatalogItemSubscription = {
  onUpdateCatalogItem?: {
    __typename: 'CatalogItem'
    catalogData: string
    createdAt: string
    id: string
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    squareItemId: string
    updatedAt: string
  } | null
}

export type OnUpdateItemToppingSubscriptionVariables = {
  filter?: ModelSubscriptionItemToppingFilterInput | null
  owner?: string | null
}

export type OnUpdateItemToppingSubscription = {
  onUpdateItemTopping?: {
    __typename: 'ItemTopping'
    createdAt: string
    id: string
    isDefault?: boolean | null
    isLocked?: boolean | null
    menuItem?: {
      __typename: 'MenuItem'
      catalogItemId: string
      createdAt: string
      customName?: string | null
      id: string
      isFeatured?: boolean | null
      menuId: string
      owner?: string | null
      s3ImageKey?: string | null
      sortOrder?: number | null
      updatedAt: string
    } | null
    menuItemId: string
    owner?: string | null
    topping?: {
      __typename: 'Topping'
      createdAt: string
      id: string
      name: string
      owner?: string | null
      price: number
      updatedAt: string
    } | null
    toppingId: string
    updatedAt: string
  } | null
}

export type OnUpdateMenuSubscriptionVariables = {
  filter?: ModelSubscriptionMenuFilterInput | null
}

export type OnUpdateMenuSubscription = {
  onUpdateMenu?: {
    __typename: 'Menu'
    createdAt: string
    id: string
    isActive?: boolean | null
    locationId: string
    logo?: string | null
    menuItems?: {
      __typename: 'ModelMenuItemConnection'
      nextToken?: string | null
    } | null
    name: string
    theme?: string | null
    updatedAt: string
  } | null
}

export type OnUpdateMenuItemSubscriptionVariables = {
  filter?: ModelSubscriptionMenuItemFilterInput | null
  owner?: string | null
}

export type OnUpdateMenuItemSubscription = {
  onUpdateMenuItem?: {
    __typename: 'MenuItem'
    catalogItem?: {
      __typename: 'CatalogItem'
      catalogData: string
      createdAt: string
      id: string
      squareItemId: string
      updatedAt: string
    } | null
    catalogItemId: string
    createdAt: string
    customName?: string | null
    id: string
    isFeatured?: boolean | null
    menu?: {
      __typename: 'Menu'
      createdAt: string
      id: string
      isActive?: boolean | null
      locationId: string
      logo?: string | null
      name: string
      theme?: string | null
      updatedAt: string
    } | null
    menuId: string
    owner?: string | null
    s3ImageKey?: string | null
    sortOrder?: number | null
    toppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    updatedAt: string
  } | null
}

export type OnUpdateTicketCounterSubscriptionVariables = {
  filter?: ModelSubscriptionTicketCounterFilterInput | null
}

export type OnUpdateTicketCounterSubscription = {
  onUpdateTicketCounter?: {
    __typename: 'TicketCounter'
    counter?: number | null
    createdAt: string
    expiresAt?: number | null
    id: string
    updatedAt: string
  } | null
}

export type OnUpdateToppingSubscriptionVariables = {
  filter?: ModelSubscriptionToppingFilterInput | null
  owner?: string | null
}

export type OnUpdateToppingSubscription = {
  onUpdateTopping?: {
    __typename: 'Topping'
    createdAt: string
    id: string
    itemToppings?: {
      __typename: 'ModelItemToppingConnection'
      nextToken?: string | null
    } | null
    name: string
    owner?: string | null
    price: number
    updatedAt: string
  } | null
}
