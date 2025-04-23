'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/CartContext'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

type Topping = {
  id: string
  name: string
  price: number
  groupName: string
}

type Item = {
  id: string
  name: string
  description?: string
  price: number // cents
  image?: string
  toppings: Topping[]
}

export default function ItemDetail({ item }: { item: Item }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedToppings, setSelectedToppings] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const defaults: Record<string, boolean> = {}
    item.toppings.forEach((t) => {
      defaults[t.id] = false // or true if you later support default toppings
    })
    setSelectedToppings(defaults)
  }, [item])

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const calculateTotal = () => {
    const toppingTotal = item.toppings.reduce((sum, t) => {
      return selectedToppings[t.id] ? sum + t.price : sum
    }, 0)

    return ((item.price + toppingTotal) * quantity) / 100
  }

  const handleAddToCart = () => {
    const selected = item.toppings.filter((t) => selectedToppings[t.id])
    const cartItem = {
      id: item.id,
      name: item.name,
      basePrice: item.price,
      quantity,
      toppings: selected,
    }
    console.log('adding item to cart:', cartItem)
    addItem(cartItem)
    router.push('/cart')
  }

  return (
    <div className='p-4 max-w-md mx-auto space-y-4'>
      <header className='sticky top-0 bg-white z-10'>
        <div className='flex items-center p-4'>
          <Link href='/menu/op1' className='mr-4'>
            <ChevronLeft className='h-6 w-6' />
          </Link>
          <h1 className='text-xl font-bold'>Add To Order</h1>
        </div>
      </header>
      <h1 className='text-2xl font-bold'>{item.name}</h1>
      <p className='text-muted-foreground'>{item.description}</p>
      <p className='font-semibold text-lg'>${(item.price / 100).toFixed(2)}</p>

      {/* Toppings */}
      {item.toppings.length > 0 && (
        <div>
          <h2 className='font-semibold mt-4 mb-2'>Toppings</h2>
          <ul className='space-y-2'>
            {item.toppings.map((t) => (
              <li key={t.id} className='flex justify-between items-center'>
                <label className='flex gap-2 items-center'>
                  <input
                    type='checkbox'
                    checked={selectedToppings[t.id] || false}
                    onChange={() => toggleTopping(t.id)}
                  />
                  {t.name}
                </label>
                {t.price > 0 && <span className='text-sm text-gray-500'>+${(t.price / 100).toFixed(2)}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quantity */}
      <div className='flex items-center gap-4 mt-4'>
        <Button variant='outline' size='icon' onClick={() => setQuantity(Math.max(1, quantity - 1))}>
          <Minus className='w-4 h-4' />
        </Button>
        <span className='text-xl font-medium'>{quantity}</span>
        <Button variant='outline' size='icon' onClick={() => setQuantity(quantity + 1)}>
          <Plus className='w-4 h-4' />
        </Button>
      </div>

      {/* Total & Add */}
      <div className='flex justify-between items-center pt-4'>
        <span className='text-lg font-medium'>Total:</span>
        <span className='text-xl font-bold'>${calculateTotal().toFixed(2)}</span>
      </div>

      <Button className='w-full' onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  )
}
