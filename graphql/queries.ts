/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCatalogItem = /* GraphQL */ `query GetCatalogItem($id: ID!) {
  getCatalogItem(id: $id) {
    catalogData
    createdAt
    id
    menuItem {
      catalogItemId
      createdAt
      customName
      id
      isFeatured
      menuId
      owner
      s3ImageKey
      sortOrder
      updatedAt
      __typename
    }
    squareItemId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCatalogItemQueryVariables,
  APITypes.GetCatalogItemQuery
>;
export const getItemTopping = /* GraphQL */ `query GetItemTopping($id: ID!) {
  getItemTopping(id: $id) {
    createdAt
    id
    isDefault
    isLocked
    menuItem {
      catalogItemId
      createdAt
      customName
      id
      isFeatured
      menuId
      owner
      s3ImageKey
      sortOrder
      updatedAt
      __typename
    }
    menuItemId
    owner
    topping {
      createdAt
      id
      name
      owner
      price
      updatedAt
      __typename
    }
    toppingId
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetItemToppingQueryVariables,
  APITypes.GetItemToppingQuery
>;
export const getMenu = /* GraphQL */ `query GetMenu($id: ID!) {
  getMenu(id: $id) {
    createdAt
    id
    isActive
    locationId
    logo
    menuItems {
      nextToken
      __typename
    }
    name
    theme
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetMenuQueryVariables, APITypes.GetMenuQuery>;
export const getMenuItem = /* GraphQL */ `query GetMenuItem($id: ID!) {
  getMenuItem(id: $id) {
    catalogItem {
      catalogData
      createdAt
      id
      squareItemId
      updatedAt
      __typename
    }
    catalogItemId
    createdAt
    customName
    id
    isFeatured
    menu {
      createdAt
      id
      isActive
      locationId
      logo
      name
      theme
      updatedAt
      __typename
    }
    menuId
    owner
    s3ImageKey
    sortOrder
    toppings {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMenuItemQueryVariables,
  APITypes.GetMenuItemQuery
>;
export const getTicketCounter = /* GraphQL */ `query GetTicketCounter($id: ID!) {
  getTicketCounter(id: $id) {
    counter
    createdAt
    expiresAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTicketCounterQueryVariables,
  APITypes.GetTicketCounterQuery
>;
export const getTopping = /* GraphQL */ `query GetTopping($id: ID!) {
  getTopping(id: $id) {
    createdAt
    id
    itemToppings {
      nextToken
      __typename
    }
    name
    owner
    price
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetToppingQueryVariables,
  APITypes.GetToppingQuery
>;
export const listCatalogItems = /* GraphQL */ `query ListCatalogItems(
  $filter: ModelCatalogItemFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listCatalogItems(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      catalogData
      createdAt
      id
      squareItemId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCatalogItemsQueryVariables,
  APITypes.ListCatalogItemsQuery
>;
export const listItemToppings = /* GraphQL */ `query ListItemToppings(
  $filter: ModelItemToppingFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listItemToppings(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      isDefault
      isLocked
      menuItemId
      owner
      toppingId
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListItemToppingsQueryVariables,
  APITypes.ListItemToppingsQuery
>;
export const listMenuItems = /* GraphQL */ `query ListMenuItems(
  $filter: ModelMenuItemFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listMenuItems(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      catalogItemId
      createdAt
      customName
      id
      isFeatured
      menuId
      owner
      s3ImageKey
      sortOrder
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMenuItemsQueryVariables,
  APITypes.ListMenuItemsQuery
>;
export const listMenus = /* GraphQL */ `query ListMenus(
  $filter: ModelMenuFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listMenus(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      isActive
      locationId
      logo
      name
      theme
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListMenusQueryVariables, APITypes.ListMenusQuery>;
export const listTicketCounters = /* GraphQL */ `query ListTicketCounters(
  $filter: ModelTicketCounterFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listTicketCounters(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      counter
      createdAt
      expiresAt
      id
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTicketCountersQueryVariables,
  APITypes.ListTicketCountersQuery
>;
export const listToppings = /* GraphQL */ `query ListToppings(
  $filter: ModelToppingFilterInput
  $id: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listToppings(
    filter: $filter
    id: $id
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      createdAt
      id
      name
      owner
      price
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListToppingsQueryVariables,
  APITypes.ListToppingsQuery
>;
