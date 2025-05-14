'use client'

import { useAuthenticator } from '@aws-amplify/ui-react'

export function useSafeAuthenticator() {
  try {
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus])
    return {
      user,
      authStatus,
    } as const
  } catch (err) {
    console.error('Not Authenticated', err)
    return {
      user: null,
      authStatus: 'unauthenticated',
    } as const
  }
}
