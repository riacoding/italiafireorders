import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Menu: a
    .model({
      id: a.id().required(),
      name: a.string().required(), // "Friday Night Menu"
      locationId: a.string().required(), // e.g. "truck-west"
      squareItemIds: a.string().array().required(), // Square Catalog object IDs
      logo: a.string(), // S3 key or Cloudinary URL
      isActive: a.boolean().default(false), // Toggle for 'Menu of the Day'
      theme: a.json(), // Optional theme config
    })
    .authorization((allow) => [allow.groups(['admin']), allow.guest().to(['read'])]),
  MenuItem: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      image: a.string(),
      type: a.enum(['pizza', 'salad', 'drink', 'dessert']),
      itemToppings: a.hasMany('ItemTopping', 'menuItemId'),
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
