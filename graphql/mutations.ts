/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCatalogItem = /* GraphQL */ `mutation CreateCatalogItem(
  $condition: ModelCatalogItemConditionInput
  $input: CreateCatalogItemInput!
) {
  createCatalogItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCatalogItemMutationVariables,
  APITypes.CreateCatalogItemMutation
>;
export const createItemTopping = /* GraphQL */ `mutation CreateItemTopping(
  $condition: ModelItemToppingConditionInput
  $input: CreateItemToppingInput!
) {
  createItemTopping(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateItemToppingMutationVariables,
  APITypes.CreateItemToppingMutation
>;
export const createMenu = /* GraphQL */ `mutation CreateMenu(
  $condition: ModelMenuConditionInput
  $input: CreateMenuInput!
) {
  createMenu(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMenuMutationVariables,
  APITypes.CreateMenuMutation
>;
export const createMenuItem = /* GraphQL */ `mutation CreateMenuItem(
  $condition: ModelMenuItemConditionInput
  $input: CreateMenuItemInput!
) {
  createMenuItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMenuItemMutationVariables,
  APITypes.CreateMenuItemMutation
>;
export const createTicketCounter = /* GraphQL */ `mutation CreateTicketCounter(
  $condition: ModelTicketCounterConditionInput
  $input: CreateTicketCounterInput!
) {
  createTicketCounter(condition: $condition, input: $input) {
    counter
    createdAt
    expiresAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTicketCounterMutationVariables,
  APITypes.CreateTicketCounterMutation
>;
export const createTopping = /* GraphQL */ `mutation CreateTopping(
  $condition: ModelToppingConditionInput
  $input: CreateToppingInput!
) {
  createTopping(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateToppingMutationVariables,
  APITypes.CreateToppingMutation
>;
export const deleteCatalogItem = /* GraphQL */ `mutation DeleteCatalogItem(
  $condition: ModelCatalogItemConditionInput
  $input: DeleteCatalogItemInput!
) {
  deleteCatalogItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCatalogItemMutationVariables,
  APITypes.DeleteCatalogItemMutation
>;
export const deleteItemTopping = /* GraphQL */ `mutation DeleteItemTopping(
  $condition: ModelItemToppingConditionInput
  $input: DeleteItemToppingInput!
) {
  deleteItemTopping(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteItemToppingMutationVariables,
  APITypes.DeleteItemToppingMutation
>;
export const deleteMenu = /* GraphQL */ `mutation DeleteMenu(
  $condition: ModelMenuConditionInput
  $input: DeleteMenuInput!
) {
  deleteMenu(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMenuMutationVariables,
  APITypes.DeleteMenuMutation
>;
export const deleteMenuItem = /* GraphQL */ `mutation DeleteMenuItem(
  $condition: ModelMenuItemConditionInput
  $input: DeleteMenuItemInput!
) {
  deleteMenuItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMenuItemMutationVariables,
  APITypes.DeleteMenuItemMutation
>;
export const deleteTicketCounter = /* GraphQL */ `mutation DeleteTicketCounter(
  $condition: ModelTicketCounterConditionInput
  $input: DeleteTicketCounterInput!
) {
  deleteTicketCounter(condition: $condition, input: $input) {
    counter
    createdAt
    expiresAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTicketCounterMutationVariables,
  APITypes.DeleteTicketCounterMutation
>;
export const deleteTopping = /* GraphQL */ `mutation DeleteTopping(
  $condition: ModelToppingConditionInput
  $input: DeleteToppingInput!
) {
  deleteTopping(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteToppingMutationVariables,
  APITypes.DeleteToppingMutation
>;
export const updateCatalogItem = /* GraphQL */ `mutation UpdateCatalogItem(
  $condition: ModelCatalogItemConditionInput
  $input: UpdateCatalogItemInput!
) {
  updateCatalogItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCatalogItemMutationVariables,
  APITypes.UpdateCatalogItemMutation
>;
export const updateItemTopping = /* GraphQL */ `mutation UpdateItemTopping(
  $condition: ModelItemToppingConditionInput
  $input: UpdateItemToppingInput!
) {
  updateItemTopping(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateItemToppingMutationVariables,
  APITypes.UpdateItemToppingMutation
>;
export const updateMenu = /* GraphQL */ `mutation UpdateMenu(
  $condition: ModelMenuConditionInput
  $input: UpdateMenuInput!
) {
  updateMenu(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMenuMutationVariables,
  APITypes.UpdateMenuMutation
>;
export const updateMenuItem = /* GraphQL */ `mutation UpdateMenuItem(
  $condition: ModelMenuItemConditionInput
  $input: UpdateMenuItemInput!
) {
  updateMenuItem(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMenuItemMutationVariables,
  APITypes.UpdateMenuItemMutation
>;
export const updateTicketCounter = /* GraphQL */ `mutation UpdateTicketCounter(
  $condition: ModelTicketCounterConditionInput
  $input: UpdateTicketCounterInput!
) {
  updateTicketCounter(condition: $condition, input: $input) {
    counter
    createdAt
    expiresAt
    id
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTicketCounterMutationVariables,
  APITypes.UpdateTicketCounterMutation
>;
export const updateTopping = /* GraphQL */ `mutation UpdateTopping(
  $condition: ModelToppingConditionInput
  $input: UpdateToppingInput!
) {
  updateTopping(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateToppingMutationVariables,
  APITypes.UpdateToppingMutation
>;
