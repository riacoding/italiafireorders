import { defineFunction } from '@aws-amplify/backend'

export const counter = defineFunction({
  entry: './counterHandler.ts',
  resourceGroupName: 'data',
})
