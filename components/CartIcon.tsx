'use client'

import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/CartContext' // adjust path if needed

export default function CartIcon() {
  const router = useRouter()
  const { items } = useCart()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className='relative'>
      <button onClick={() => router.push('/cart')} aria-label='Cart' className='hover:text-gray-600 transition'>
        <ShoppingCart className='w-6 h-6' />
      </button>
      {itemCount > 0 && (
        <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
          {itemCount}
        </span>
      )}
    </div>
  )
}
