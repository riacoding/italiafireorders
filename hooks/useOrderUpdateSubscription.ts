import { useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type { Schema } from '@/amplify/data/resource'

const client = generateClient<Schema>()

export function useOrderUpdateSubscription(orderId: string | undefined, onStatusChange: (status: string) => void) {
  const [authMode, setAuthMode] = useState<'userPool' | 'identityPool'>()

  useEffect(() => {
    getCurrentUser()
      .then(({ userId }) => setAuthMode(userId ? 'userPool' : 'identityPool'))
      .catch(() => setAuthMode('identityPool'))
  }, [])

  useEffect(() => {
    if (!orderId) return

    const sub = client.models.Order.onUpdate({
      filter: { id: { eq: orderId } },
      authMode,
    }).subscribe({
      next: (data) => {
        const status = data?.fulfillmentStatus
        if (status) {
          onStatusChange(status)
        }
      },
      error: (err) => {
        console.error('Subscription error:', err)
      },
    })

    return () => sub.unsubscribe()
  }, [orderId, onStatusChange])
}
