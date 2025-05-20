'use client'

import { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { FulfillmentState, SquareOrder } from '@/types'
import OrderCard from '@/components/OrderCard'
import { updateSquareOrder } from '@/lib/ssr-actions'
import { useMarkPrepared } from '@/hooks/useMarkPrepared'
import { useQueryClient } from '@tanstack/react-query'

const client = generateClient<Schema>()
export type Order = Schema['Order']['type'] & { rawData: SquareOrder }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set())
  const { mutate: markPrepared } = useMarkPrepared()

  useEffect(() => {
    const sub = client.models.Order.observeQuery().subscribe({
      next: ({ items }) => {
        const incoming = new Set(items.map((o) => o.id))
        const newlyAdded = items.filter((o) => !orders.some((prev) => prev.id === o.id))

        if (newlyAdded.length > 0) {
          const ids = new Set(newlyAdded.map((o) => o.id))
          setNewOrderIds(ids)
          setTimeout(() => setNewOrderIds(new Set()), 4000)
        }

        setOrders(
          items
            .map((item) => ({
              ...item,
              rawData: typeof item.rawData === 'string' ? JSON.parse(item.rawData) : item.rawData,
            }))
            .sort((a, b) => {
              const aDate = new Date(a.rawData?.createdAt ?? 0).getTime()
              const bDate = new Date(b.rawData?.createdAt ?? 0).getTime()
              return bDate - aDate // oldest to newest — flip for newest first
            })
            .filter((o) => o.fulfillmentStatus === 'PROPOSED')
        )
      },
    })
    return () => sub.unsubscribe()
  }, [])

  return (
    <div className='container max-w-4xl py-8'>
      <h1 className='text-2xl font-bold mb-6'>Open Tickets</h1>

      {orders.length === 0 ? (
        <p className='text-muted-foreground'>No orders yet.</p>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => {
            return <OrderCard key={order.id} order={order} newOrderIds={newOrderIds} handlePrepared={markPrepared} />
          })}
        </div>
      )}
    </div>
  )
}
