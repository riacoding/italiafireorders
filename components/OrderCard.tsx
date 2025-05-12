import useOrderAge from '@/hooks/useOrderAge'
import { SquareOrder } from '@/types'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { cn } from '@/lib/utils'
import { Order } from '@/app/admin/orders/page'
import { Button } from './ui/button'
import OrderTimer from './OrderTimer'
import { format } from 'date-fns'

type Props = {
  order: Order
  newOrderIds: Set<string>
  handlePrepared: (order: Order) => void
}

export default function OrderCard({ order, newOrderIds, handlePrepared }: Props) {
  const age = useOrderAge(order.createdAt ?? '')
  const raw = order.rawData
  const ticket = raw?.metadata?.ticketNumber ?? order.referenceId
  const createdAt = raw?.createdAt ? new Date(raw.createdAt) : undefined
  const total = Number(raw?.totalMoney?.amount ?? order.totalMoney ?? 0)
  const lineItems = raw?.lineItems ?? []
  const fulfillment = raw?.fulfillments?.[0]?.pickupDetails
  const recipient = fulfillment?.recipient

  const statusLevel = age < 300 ? 'normal' : age < 600 ? 'warning' : 'urgent'

  return (
    <Card className={cn('transition-all border-4', newOrderIds.has(order.id) && 'border-blue-500 animate-pulse')}>
      <CardContent className='p-4 space-y-2'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-muted-foreground'>Time since order:</span>
          <OrderTimer createdAt={raw.createdAt!} statusLevel={statusLevel} />
        </div>
        <div className='flex justify-between'>
          <div>
            <h2 className='text-lg font-semibold'>Order #{ticket}</h2>
            <p className='text-sm text-muted-foreground'>{createdAt ? format(createdAt, 'PPpp') : '—'}</p>
            {recipient?.displayName && <p className='text-sm'>Customer: {recipient.displayName}</p>}
            {fulfillment?.pickupAt && <p className='text-sm'>Pickup: {format(new Date(fulfillment.pickupAt), 'p')}</p>}
          </div>
          <div className='text-right'>
            <p className='text-sm'>Total: ${(total / 100).toFixed(2)}</p>
            <p className='text-sm capitalize'>Status: {order.status ?? raw?.state ?? 'unknown'}</p>
          </div>
        </div>

        <ul className='text-sm pl-4 list-disc'>
          {lineItems.map((item: any, idx: number) => (
            <li key={idx} className='mb-1'>
              <div className='flex justify-between'>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className='text-sm text-muted-foreground'>
                  ${(Number(item.totalMoney?.amount ?? 0) / 100).toFixed(2)}
                </span>
              </div>

              {item.variationName && <div className='text-xs text-muted-foreground italic'>{item.variationName}</div>}

              {/* Render modifiers, if any */}
              {item.modifiers?.length > 0 && (
                <ul className='ml-4 text-xs text-muted-foreground list-disc'>
                  {item.modifiers.map((mod: any, i: number) => (
                    <li key={i}>
                      {mod.name} {mod.quantity && `× ${mod.quantity}`}
                      {mod.totalPriceMoney?.amount && <> — +${(Number(mod.totalPriceMoney.amount) / 100).toFixed(2)}</>}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className='pt-2'>
          <Button
            onClick={() => handlePrepared(order)}
            className={cn(
              'w-full mt-4 text-lg py-6 rounded-xl',
              statusLevel === 'warning' && 'bg-yellow-500 hover:bg-yellow-600',
              statusLevel === 'urgent' && 'bg-red-600 hover:bg-red-700 animate-pulse'
            )}
          >
            Prepared
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
