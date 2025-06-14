import { useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'

const client = generateClient<Schema>()

export function useOrderUpdateSubscription(orderId: string | undefined, onStatusChange: (status: string) => void) {
  useEffect(() => {
    if (!orderId) return

    const sub = client.models.Order.onUpdate({
      filter: { id: { eq: orderId } },
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
