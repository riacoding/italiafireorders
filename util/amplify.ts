import { type Schema } from '@/amplify/data/resource'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import outputs from '../amplify_outputs.json'
import { getCurrentUser } from 'aws-amplify/auth/server'
import { cookies } from 'next/headers'

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
})

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
})

// This page always dynamically renders per request
export const dynamic = 'force-dynamic'

export const getCurrentUserServer = async () => {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    })

    return { user: currentUser }
  } catch (error) {
    //console.log(error)
    return { user: null }
  }
}
