import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { storage } from './storage/resource'
import { config } from '@dotenvx/dotenvx'
import { UserPool } from 'aws-cdk-lib/aws-cognito'

config({ path: '.env.local', override: false })

const backend = defineBackend({
  auth,
  data,
  storage,
})

const userPool = backend.auth.resources.userPool as UserPool

userPool.addGroup('Admin', {
  precedence: 0,
  description: 'Admin group',
  groupName: 'admin',
})

backend.data.resources.cfnResources.cfnGraphqlApi.name = 'PizzaMenu'
