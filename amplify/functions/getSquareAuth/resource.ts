import { defineFunction, secret } from '@aws-amplify/backend'

export const squareAuth = defineFunction({
  entry: './squareAuthHandler.ts',
  resourceGroupName: 'data',
  environment: {
    SQUARE_ENV: 'sandbox',
    SQUARE_APP_ID: secret('SQUARE_APPLICATION_ID'),
    OAUTH_STATE_SECRET: secret('OAUTH_STATE_SECRET'),
  },
})
