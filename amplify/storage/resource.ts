import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'foodTruck',
  access: (allow) => ({
    'items/*': [allow.groups(['vendor', 'admin']).to(['read', 'write']), allow.guest.to(['read'])],
    'logos/*': [allow.groups(['vendor', 'admin']).to(['read', 'write']), allow.guest.to(['read'])],
  }),
})
