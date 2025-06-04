import { defineFunction, secret } from '@aws-amplify/backend'

export const twilioInbound = defineFunction({
  entry: './twilioInboundHandler.ts',
  resourceGroupName: 'data',
  environment: {
    SITE_URL: 'https://main.dgs4gp483bprx.amplifyapp.com/',
  },
})
