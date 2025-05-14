'use client'

import { useCart } from '@/components/CartContext'
import { ReceiptSimpleList } from '@/components/ReceiptItemList'
import { getSquareOrderByOrderNumber, updateOrderContact } from '@/lib/ssr-actions'
import { ReceiptItem } from '@/types'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ThankYouClient() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<ReceiptItem[] | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const orderNumber = searchParams.get('order') || 'N/A'
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [])

  useEffect(() => {
    async function fetchOrder() {
      const res = await getSquareOrderByOrderNumber(orderNumber)
      setOrder(res)
      setIsLoading(false)
    }

    fetchOrder()
  }, [])

  const handleContactSubmit = async () => {
    await updateOrderContact(phone, orderNumber)
    setSubmitted(true)
  }

  return (
    <div className='w-full flex items-center justify-center'>
      <div className='w-full max-w-md flex items-center justify-center bg-gray-100 p-4'>
        <div className='w-full border-4 border-black rounded-md p-8 text-center bg-white shadow-md'>
          <h1 className='text-3xl font-bold mb-4'>Thank you</h1>

          <p className='text-lg'>Your order number is:</p>
          <p className='text-3xl font-semibold mt-2 min-h-[2.5rem] break-words'>{orderNumber || '\u00A0'}</p>

          <div className='mt-4 min-h-[8rem]'>
            {isLoading && <p className='text-lg'>Loading order...</p>}
            {order && order.length > 0 && <ReceiptSimpleList items={order} />}
          </div>
        </div>
        <div>
          {!submitted && (
            <div className='mt-6 text-left space-y-3'>
              <h2 className='text-lg font-semibold'>Want a text when your order is ready?</h2>
              <Input placeholder='Phone number' value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button onClick={handleContactSubmit} className='mt-2' disabled={!phone}>
                Submit Info
              </Button>
            </div>
          )}

          {submitted && <p className='mt-6 text-green-600'>✅ You’ll get a text when it’s ready!</p>}
        </div>
      </div>
    </div>
  )
}
