'use client'

import { useEffect, useState } from 'react'
import { Hub } from 'aws-amplify/utils'
import { getCurrentUser } from 'aws-amplify/auth'

export function useSafeAuthenticator() {
  const [authStatus, setAuthStatus] = useState<'unauthenticated' | 'authenticated' | 'configuring'>('configuring')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let unsubscribe: () => void

    async function checkUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setAuthStatus('authenticated')
      } catch {
        setUser(null)
        setAuthStatus('unauthenticated')
      }
    }

    checkUser()

    unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn' || payload.event === 'tokenRefresh') {
        checkUser()
      }
      if (payload.event === 'signedOut') {
        setUser(null)
        setAuthStatus('unauthenticated')
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return { user, authStatus } as const
}
