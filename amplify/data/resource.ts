import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  TicketCounter: a
    .model({
      id: a.id().required(),
      counter: a.integer().default(0),
      expiresAt: a.integer(), // TTL field
    })
    .authorization((allow) => [allow.guest().to(['read']), allow.authenticated().to(['read'])]),

  // 🆕 Standalone CatalogItem to sync Square catalog
  CatalogItem: a
    .model({
      id: a.id().required(),
      squareItemId: a.string().required(), // Square object ID
      catalogData: a.json().required(), // Full Square catalog JSON
    })
    .secondaryIndexes((index) => [index('squareItemId')])
    .authorization((allow) => [allow.groups(['admin']), allow.guest().to(['read'])]),

  Menu: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      locationId: a.string().required(),
      logo: a.string(),
      isActive: a.boolean().default(false),
      theme: a.json(),
      menuItems: a.hasMany('MenuItem', 'menuId'), // 🆕 one-to-many
    })
    .authorization((allow) => [allow.groups(['admin']), allow.guest().to(['read'])]),

  MenuItem: a
    .model({
      id: a.id().required(),
      menuId: a.id().required(), // link to Menu
      catalogItemId: a.id().required(), // link to CatalogItem
      s3ImageKey: a.string(), // optional custom image
      customName: a.string(), // optional name override
      isFeatured: a.boolean().default(false),
      sortOrder: a.integer(),
      menu: a.belongsTo('Menu', 'menuId'),
      toppings: a.hasMany('ItemTopping', 'menuItemId'),
    })
    .authorization((allow) => [allow.owner(), allow.groups(['admin']), allow.guest().to(['read'])]),

  Topping: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      price: a.float().required(),
      itemToppings: a.hasMany('ItemTopping', 'toppingId'),
    })
    .authorization((allow) => [allow.owner(), allow.groups(['admin']), allow.guest().to(['read'])]),

  ItemTopping: a
    .model({
      id: a.id().required(),
      isDefault: a.boolean().default(false),
      isLocked: a.boolean().default(false),
      menuItemId: a.id().required(),
      toppingId: a.id().required(),
      menuItem: a.belongsTo('MenuItem', 'menuItemId'),
      topping: a.belongsTo('Topping', 'toppingId'),
    })
    .authorization((allow) => [allow.owner(), allow.groups(['admin']), allow.guest().to(['read'])]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
