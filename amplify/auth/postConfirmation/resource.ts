import { defineFunction } from '@aws-amplify/backend'

export const postConfirmation = defineFunction({
  name: 'postConfirmation',
  entry: './postConfirmationHandler.ts',
  environment: {
    GROUP_NAME: 'vendor',
  },
  resourceGroupName: 'auth',
})
