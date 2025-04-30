/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCatalogItem = /* GraphQL */ `subscription OnCreateCatalogItem(
  $filter: ModelSubscriptionCatalogItemFilterInput
) {
  onCreateCatalogItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCatalogItemSubscriptionVariables,
  APITypes.OnCreateCatalogItemSubscription
>;
export const onCreateItemTopping = /* GraphQL */ `subscription OnCreateItemTopping(
  $filter: ModelSubscriptionItemToppingFilterInput
  $owner: String
) {
  onCreateItemTopping(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateItemToppingSubscriptionVariables,
  APITypes.OnCreateItemToppingSubscription
>;
export const onCreateMenu = /* GraphQL */ `subscription OnCreateMenu($filter: ModelSubscriptionMenuFilterInput) {
  onCreateMenu(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMenuSubscriptionVariables,
  APITypes.OnCreateMenuSubscription
>;
export const onCreateMenuItem = /* GraphQL */ `subscription OnCreateMenuItem(
  $filter: ModelSubscriptionMenuItemFilterInput
  $owner: String
) {
  onCreateMenuItem(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMenuItemSubscriptionVariables,
  APITypes.OnCreateMenuItemSubscription
>;
export const onCreateTicketCounter = /* GraphQL */ `subscription OnCreateTicketCounter(
  $filter: ModelSubscriptionTicketCounterFilterInput
) {
  onCreateTicketCounter(filter: $filter) {
    counter
    createdAt
    expiresAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTicketCounterSubscriptionVariables,
  APITypes.OnCreateTicketCounterSubscription
>;
export const onCreateTopping = /* GraphQL */ `subscription OnCreateTopping(
  $filter: ModelSubscriptionToppingFilterInput
  $owner: String
) {
  onCreateTopping(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateToppingSubscriptionVariables,
  APITypes.OnCreateToppingSubscription
>;
export const onDeleteCatalogItem = /* GraphQL */ `subscription OnDeleteCatalogItem(
  $filter: ModelSubscriptionCatalogItemFilterInput
) {
  onDeleteCatalogItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCatalogItemSubscriptionVariables,
  APITypes.OnDeleteCatalogItemSubscription
>;
export const onDeleteItemTopping = /* GraphQL */ `subscription OnDeleteItemTopping(
  $filter: ModelSubscriptionItemToppingFilterInput
  $owner: String
) {
  onDeleteItemTopping(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteItemToppingSubscriptionVariables,
  APITypes.OnDeleteItemToppingSubscription
>;
export const onDeleteMenu = /* GraphQL */ `subscription OnDeleteMenu($filter: ModelSubscriptionMenuFilterInput) {
  onDeleteMenu(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMenuSubscriptionVariables,
  APITypes.OnDeleteMenuSubscription
>;
export const onDeleteMenuItem = /* GraphQL */ `subscription OnDeleteMenuItem(
  $filter: ModelSubscriptionMenuItemFilterInput
  $owner: String
) {
  onDeleteMenuItem(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMenuItemSubscriptionVariables,
  APITypes.OnDeleteMenuItemSubscription
>;
export const onDeleteTicketCounter = /* GraphQL */ `subscription OnDeleteTicketCounter(
  $filter: ModelSubscriptionTicketCounterFilterInput
) {
  onDeleteTicketCounter(filter: $filter) {
    counter
    createdAt
    expiresAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTicketCounterSubscriptionVariables,
  APITypes.OnDeleteTicketCounterSubscription
>;
export const onDeleteTopping = /* GraphQL */ `subscription OnDeleteTopping(
  $filter: ModelSubscriptionToppingFilterInput
  $owner: String
) {
  onDeleteTopping(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteToppingSubscriptionVariables,
  APITypes.OnDeleteToppingSubscription
>;
export const onUpdateCatalogItem = /* GraphQL */ `subscription OnUpdateCatalogItem(
  $filter: ModelSubscriptionCatalogItemFilterInput
) {
  onUpdateCatalogItem(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCatalogItemSubscriptionVariables,
  APITypes.OnUpdateCatalogItemSubscription
>;
export const onUpdateItemTopping = /* GraphQL */ `subscription OnUpdateItemTopping(
  $filter: ModelSubscriptionItemToppingFilterInput
  $owner: String
) {
  onUpdateItemTopping(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateItemToppingSubscriptionVariables,
  APITypes.OnUpdateItemToppingSubscription
>;
export const onUpdateMenu = /* GraphQL */ `subscription OnUpdateMenu($filter: ModelSubscriptionMenuFilterInput) {
  onUpdateMenu(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMenuSubscriptionVariables,
  APITypes.OnUpdateMenuSubscription
>;
export const onUpdateMenuItem = /* GraphQL */ `subscription OnUpdateMenuItem(
  $filter: ModelSubscriptionMenuItemFilterInput
  $owner: String
) {
  onUpdateMenuItem(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMenuItemSubscriptionVariables,
  APITypes.OnUpdateMenuItemSubscription
>;
export const onUpdateTicketCounter = /* GraphQL */ `subscription OnUpdateTicketCounter(
  $filter: ModelSubscriptionTicketCounterFilterInput
) {
  onUpdateTicketCounter(filter: $filter) {
    counter
    createdAt
    expiresAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTicketCounterSubscriptionVariables,
  APITypes.OnUpdateTicketCounterSubscription
>;
export const onUpdateTopping = /* GraphQL */ `subscription OnUpdateTopping(
  $filter: ModelSubscriptionToppingFilterInput
  $owner: String
) {
  onUpdateTopping(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateToppingSubscriptionVariables,
  APITypes.OnUpdateToppingSubscription
>;
