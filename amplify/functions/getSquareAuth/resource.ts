import { defineFunction, secret } from '@aws-amplify/backend'

export const squareAuth = defineFunction({
  entry: './squareAuthHandler.ts',
  resourceGroupName: 'data',
  environment: {
    APP_BASE_URL: 'http://localhost:3000',
    SQUARE_ENV: 'sandbox',
    SQUARE_APP_ID: 'sandbox-sq0idb-crOo3ZGdDI6T3ECPmRyjJQ',
    OAUTH_STATE_SECRET: secret('OAUTH_STATE_SECRET'),
  },
})
