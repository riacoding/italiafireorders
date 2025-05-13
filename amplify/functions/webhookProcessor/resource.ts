import { defineFunction, secret } from '@aws-amplify/backend'

export const webhookProcessor = defineFunction({
  entry: './webhookProcessorHandler.ts',
  environment: {
    SQUARE_ACCESS_TOKEN: secret('SQUARE_ACCESS_TOKEN'),
    SQUARE_WEBHOOK_SECRET: secret('SQUARE_WEBHOOK_SECRET'),
    TWILIO_ACCOUNT_SID: secret('TWILIO_ACCOUNT_SID'),
    TWILIO_AUTH_TOKEN: secret('TWILIO_AUTH_TOKEN'),
    TWILIO_FROM: secret('TWILIO_PHONE_NUMBER'),
  },
  resourceGroupName: 'data',
})
