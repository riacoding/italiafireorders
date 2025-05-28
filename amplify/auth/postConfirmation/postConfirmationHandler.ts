import type { PostConfirmationTriggerHandler } from 'aws-lambda'
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../data/resource'
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime'
import { env } from '$amplify/env/postConfirmation'

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env)
Amplify.configure(resourceConfig, libraryOptions)
const amplifyClient = generateClient<Schema>()
const cognitoClient = new CognitoIdentityProviderClient()

export const handler: PostConfirmationTriggerHandler = async (event) => {
  console.log('postConfirmation event:', event)
  const sub = event.request.userAttributes.sub
  const email = event.request.userAttributes.email

  if (!sub || !email) {
    console.error('Missing sub or email in userAttributes', event.request.userAttributes)
    return event
  }

  try {
    // Create User model
    const { data: user, errors } = await amplifyClient.models.User.create(
      {
        id: sub,
        sub,
        email,
        owner: `${sub}::${sub}`,
        merchantId: 'pending', // Later updated during merchant creation flow
      },
      { authMode: 'iam' }
    )

    if (errors?.length) {
      console.error('User creation failed:', errors)
      throw new Error(errors.map((e) => e.message).join(', '))
    }

    // Add user to default group (e.g. admin group)
    try {
      const command = new AdminAddUserToGroupCommand({
        GroupName: env.GROUP_NAME,
        Username: event.userName,
        UserPoolId: event.userPoolId,
      })

      const response = await cognitoClient.send(command)
      console.log('User added to group:', response.$metadata.requestId)
    } catch (groupErr) {
      console.error('Failed to add user to group:', groupErr)
    }
  } catch (err) {
    console.error('PostConfirmation handler failed:', err)
  }

  return event
}
