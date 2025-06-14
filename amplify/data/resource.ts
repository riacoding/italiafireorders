import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { counter } from '../functions/Counter/resource'
import { squareAuth } from '../functions/getSquareAuth/resource'
import { webhookProcessor } from '../functions/webhookProcessor/resource'
import { postConfirmation } from '../auth/postConfirmation/resource'
import { twilioInbound } from '../functions/twilioInbound/resource'

const schema = a
  .schema({
    TicketResponse: a.customType({
      ticketNumber: a.string(),
    }),
    SquareAuthResponse: a.customType({
      url: a.string(),
      auth: a.string(),
    }),
    User: a
      .model({
        sub: a.string().required(), // Cognito sub
        email: a.string().required(),
        merchantId: a.id().required(),
        owner: a.string().required(),
      })
      .secondaryIndexes((index) => [index('sub')])
      .authorization((allow) => [allow.owner(), allow.groups(['admin'])]),

    Merchant: a
      .model({
        id: a.id().required(),
        handle: a.id().required(),
        squareMerchantId: a.string().required(),
        accessToken: a.string().required(),
        refreshToken: a.string(),
        tokenExpiresAt: a.datetime(),
        tokenrefreshedAt: a.datetime(),
        businessName: a.string().required(),
        locationIds: a.string().array(),
        s3ItemKey: a.string(),
        isLinked: a.boolean().default(false),
      })
      .secondaryIndexes((index) => [index('squareMerchantId'), index('handle')])
      .authorization((allow) => [
        allow.owner(),
        allow.guest().to(['read']),
        allow.authenticated().to(['create', 'read']),
        allow.groups(['admin']),
      ]),
    Order: a
      .model({
        merchantId: a.id().required(),
        referenceId: a.string(),
        orderId: a.string(),
        locationId: a.string().required(),
        status: a.string(), // "OPEN", "COMPLETED", etc.
        totalMoney: a.integer(),
        fulfillmentStatus: a.string(),
        rawData: a.json(),
      })
      .secondaryIndexes((index) => [index('referenceId'), index('merchantId')])
      .authorization((allow) => [
        allow.guest().to(['read']),
        allow.authenticated().to(['read']),
        allow.groups(['admin', 'vendor']),
      ]),
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
        catalogVariationId: a.string(),
        s3ItemKey: a.string(),
        merchantId: a.id().required(),
        catalogData: a.json().required(), // Full Square catalog JSON
      })
      .secondaryIndexes((index) => [index('squareItemId'), index('merchantId')])
      .authorization((allow) => [allow.groups(['vendor', 'admin']), allow.guest().to(['read'])]),

    Phone: a
      .model({
        id: a.id().required(),
        phone: a.string().required(),
        ticketNumber: a.string().required(),
        optIn: a.boolean().required(),
        clientUpdated: a.boolean().default(false).required(),
        expiresAt: a.integer(), // TTL field
      })
      .secondaryIndexes((index) => [index('ticketNumber')])
      .authorization((allow) => [allow.groups(['admin']), allow.guest(), allow.authenticated()]),

    Menu: a
      .model({
        id: a.id().required(),
        merchantId: a.id().required(),
        name: a.string().required(),
        squareLocationId: a.string(),
        locationId: a.string().required(),
        logo: a.string(),
        isActive: a.boolean().default(false),
        theme: a.json(),
        useImages: a.boolean().default(true),
        menuItems: a.hasMany('MenuItem', 'menuId'), // 🆕 one-to-many
      })
      .secondaryIndexes((index) => [index('locationId'), index('merchantId')])
      .authorization((allow) => [allow.owner(), allow.groups(['admin']), allow.guest().to(['read'])]),
    MenuItem: a
      .model({
        id: a.id().required(),
        merchantId: a.id().required(),
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
    getSquareAuthUrl: a
      .query()
      .arguments({ merchantId: a.string().required() })
      .returns(a.ref('SquareAuthResponse'))
      .authorization((allow) => [allow.guest(), allow.authenticated()])
      .handler(a.handler.function(squareAuth)),
    getTicket: a
      .query()
      .arguments({
        locationId: a.string().required(),
        timeZone: a.string().required(),
      })
      .returns(a.ref('TicketResponse'))
      .authorization((allow) => [allow.guest(), allow.authenticated()])
      .handler(a.handler.function(counter)),
  })
  .authorization((allow) => [
    allow.resource(counter),
    allow.resource(webhookProcessor),
    allow.resource(twilioInbound),
    allow.resource(postConfirmation),
  ])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
