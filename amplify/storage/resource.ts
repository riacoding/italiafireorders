import { defineStorage } from '@aws-amplify/backend'

export const storage = defineStorage({
  name: 'foodTruck',
  access: (allow) => ({
    'items/*': [allow.authenticated.to(['read', 'write']), allow.guest.to(['read'])],
  }),
})
