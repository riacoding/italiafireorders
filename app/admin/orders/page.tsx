'use client'

import { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { SquareOrder } from '@/types'
import { cn } from '@/lib/utils'

const client = generateClient<Schema>()
type Order = Schema['Order']['type'] & { rawData: SquareOrder }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set())

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
              return aDate - bDate // oldest to newest — flip for newest first
            })
        )
      },
    })

    return () => sub.unsubscribe()
  }, [orders])

  return (
    <div className='container max-w-4xl py-8'>
      <h1 className='text-2xl font-bold mb-6'>Orders</h1>

      {orders.length === 0 ? (
        <p className='text-muted-foreground'>No orders yet.</p>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => {
            const raw = order.rawData
            const ticket = raw?.metadata?.ticketNumber ?? order.referenceId
            const createdAt = raw?.createdAt ? new Date(raw.createdAt) : undefined
            const total = Number(raw?.totalMoney?.amount ?? order.totalMoney ?? 0)
            const lineItems = raw?.lineItems ?? []
            const fulfillment = raw?.fulfillments?.[0]?.pickupDetails
            const recipient = fulfillment?.recipient

            return (
              <Card
                key={order.id}
                className={cn('transition-all border', newOrderIds.has(order.id) && 'border-yellow-500 animate-pulse')}
              >
                <CardContent className='p-4 space-y-2'>
                  <div className='flex justify-between'>
                    <div>
                      <h2 className='text-lg font-semibold'>Order #{ticket}</h2>
                      <p className='text-sm text-muted-foreground'>{createdAt ? format(createdAt, 'PPpp') : '—'}</p>
                      {recipient?.displayName && <p className='text-sm'>Customer: {recipient.displayName}</p>}
                      {fulfillment?.pickupAt && (
                        <p className='text-sm'>Pickup: {format(new Date(fulfillment.pickupAt), 'p')}</p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='text-sm'>Total: ${(total / 100).toFixed(2)}</p>
                      <p className='text-sm capitalize'>Status: {order.status ?? raw?.state ?? 'unknown'}</p>
                    </div>
                  </div>

                  {lineItems.length > 0 && (
                    <>
                      <Separator />
                      <ul className='text-sm pl-4 list-disc'>
                        {lineItems.map((item: any, idx: number) => (
                          <li key={idx}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
