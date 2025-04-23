'use client'

import { useSearchParams } from 'next/navigation'

export default function ThankYouClient() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || 'N/A'

  return (
    <div className='flex items-center justify-center bg-gray-100 p-4'>
      <div className='border-4 border-black rounded-md p-8 text-center bg-white shadow-md'>
        <h1 className='text-3xl font-bold mb-4'>Thank you</h1>
        <p className='text-lg'>Your order number is:</p>
        <p className='text-3xl font-semibold mt-2'>{orderNumber}</p>
      </div>
    </div>
  )
}
