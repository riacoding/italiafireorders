import { defineFunction, secret } from '@aws-amplify/backend'

export const twilioInbound = defineFunction({
  entry: './twilioInboundHandler.ts',
  resourceGroupName: 'data',
})
