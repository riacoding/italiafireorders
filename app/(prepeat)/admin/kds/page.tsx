'use client'

import { useState, useEffect } from 'react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'
import { FulfillmentState, SquareOrder } from '@/types'
import OrderCard from '@/components/OrderCard'
import { updateSquareOrder } from '@/lib/ssr-actions'
import { useMarkPrepared } from '@/hooks/useMarkPrepared'
import { useQueryClient } from '@tanstack/react-query'
import { useMerchant } from '@/components/MerchantContext'
import { useOrders } from '@/hooks/useOrders'

const client = generateClient<Schema>()
export type Order = Schema['Order']['type'] & { rawData: SquareOrder }

export default function KDSPage() {
  const merchant = useMerchant()
  const [locationId, setLocationId] = useState(() => merchant.locationIds?.[0] || '')

  const { orders = [], newOrderIds } = useOrders(merchant.id, locationId)
  const { mutate: markPrepared } = useMarkPrepared(merchant.id)

  return (
    <div className='container max-w-4xl py-8'>
      <h1 className='text-2xl font-bold mb-6'>Open Tickets</h1>
      <p>location:{locationId}</p>
      {merchant.locationIds && merchant?.locationIds?.length > 1 && (
        <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className='border rounded p-2'>
          {Array.isArray(merchant.locationIds) &&
            merchant.locationIds
              .filter((id): id is string => typeof id === 'string' && id.length > 0)
              .map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
        </select>
      )}
      {orders?.length === 0 ? (
        <p className='text-muted-foreground'>No orders yet.</p>
      ) : (
        <div className='space-y-4'>
          {orders?.map((order) => {
            return <OrderCard key={order.id} order={order} newOrderIds={newOrderIds} handlePrepared={markPrepared} />
          })}
        </div>
      )}
    </div>
  )
}
