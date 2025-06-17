import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import type { SquareOrder } from '@/types'

const client = generateClient<Schema>()

type Order = Schema['Order']['type'] & { rawData: SquareOrder }

function normalizeOrders(items: Schema['Order']['type'][]): Order[] {
  return items
    .map((item) => ({
      ...item,
      rawData: typeof item.rawData === 'string' ? JSON.parse(item.rawData) : item.rawData,
    }))
    .sort((a, b) => {
      const aDate = new Date(a.rawData?.createdAt ?? 0).getTime()
      const bDate = new Date(b.rawData?.createdAt ?? 0).getTime()
      return bDate - aDate
    })
    .filter((o) => o.fulfillmentStatus === 'PROPOSED')
}

export function useOrders(merchantId: string, locationId: string) {
  //console.log('merchant and location', merchantId, locationId)
  const queryClient = useQueryClient()
  const queryKey = ['orders', merchantId, locationId]
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set())
  const prevIds = useRef<Set<string>>(new Set())

  // // Initial fetch
  // const query = useQuery({
  //   queryKey,
  //   queryFn: async () => {
  //     const { data, errors } = await client.models.Order.list({
  //       authMode: 'userPool',
  //       filter: {
  //         locationId: { eq: locationId },
  //         fulfillmentStatus: { eq: 'PROPOSED' },
  //       },
  //     })
  //     if (errors?.length) throw new Error(errors.map((e) => e.message).join(', '))
  //     return normalizeOrders(data)
  //   },
  // })

  // Realtime updates
  useEffect(() => {
    const sub = client.models.Order.observeQuery({
      authMode: 'userPool',
      filter: {
        locationId: { eq: locationId },
      },
    }).subscribe({
      next: ({ items }) => {
        const normalized = normalizeOrders(items)
        //console.log('normalized orders', normalized)
        setOrders(normalized)
        const currentIds = new Set(normalized.map((o) => o.id))
        const newIds = new Set<string>()

        for (const id of currentIds) {
          if (!prevIds.current.has(id)) newIds.add(id)
        }

        if (newIds.size > 0) {
          setNewOrderIds(newIds)
          setTimeout(() => setNewOrderIds(new Set()), 4000)
        }

        prevIds.current = currentIds
        queryClient.setQueryData(queryKey, normalized)
      },
      error: (err) => {
        console.error('observeQuery error:', err)
      },
    })

    return () => sub.unsubscribe()
  }, [merchantId, locationId])

  return { orders, newOrderIds }
}
