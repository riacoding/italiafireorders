import { defineFunction, secret } from '@aws-amplify/backend'

export const webhookProcessor = defineFunction({
  entry: './webhookProcessorHandler.ts',
  environment: {
    SQUARE_ACCESS_TOKEN: secret('SQUARE_ACCESS_TOKEN'),
    SQUARE_WEBHOOK_SECRET: secret('SQUARE_WEBHOOK_SECRET'),
  },
  resourceGroupName: 'data',
})
