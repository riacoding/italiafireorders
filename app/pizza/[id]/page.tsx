'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Minus, Plus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { twMerge } from 'tailwind-merge'
import { menuItems } from '@/data/demoData'

interface Topping {
  id: string
  name: string
  price: number
}

interface ItemTopping {
  id: string
  menuItemId: string
  toppingId: string
  isDefault: boolean
  isLocked: boolean
  topping: Topping
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  type: 'pizza' | 'salad' | 'drink' | 'dessert'
  itemToppings?: ItemTopping[]
}

export default function MenuItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { toast } = useToast()
  const [MenuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedToppings, setSelectedToppings] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  console.log('selectedToppings:', selectedToppings)

  useEffect(() => {
    // In a real app, this would be an API call
    const MenuItemData = menuItems.find((p) => p.id === id)
    if (MenuItemData) {
      setMenuItem(MenuItemData)

      // Initialize selected toppings based on defaults
      const initialToppings: Record<string, boolean> = {}
      MenuItemData.itemToppings?.forEach((topping) => {
        initialToppings[topping.id] = topping.isDefault
      })
      setSelectedToppings(initialToppings)
    }
    setIsLoading(false)
  }, [id])

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) => ({
      ...prev,
      [toppingId]: !prev[toppingId],
    }))
  }

  const calculateTotalPrice = () => {
    if (!MenuItem) return 0

    let total = MenuItem.price

    // Add price for selected toppings
    MenuItem.itemToppings?.forEach((item) => {
      // Only add price for non-default toppings that are selected
      // or subtract price for default toppings that are deselected
      if (!item.isDefault && selectedToppings[item.topping.id]) {
        total += item.topping.price
      } else if (item.isDefault && !selectedToppings[item.topping.id]) {
        total -= item.topping.price
      }
    })

    return total * quantity
  }

  const addToCart = () => {
    // In a real app, this would update a cart state or make an API call
    const selectedToppingsList = MenuItem?.itemToppings?.filter((t) => selectedToppings[t.id]) || []

    toast({
      title: 'Added to cart',
      description: `${quantity} ${MenuItem?.name} added to your order.`,
    })

    console.log('Added to cart:', {
      MenuItem,
      quantity,
      selectedToppings: selectedToppingsList,
      totalPrice: calculateTotalPrice(),
    })
  }

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>
  }

  if (!MenuItem) {
    return <div className='flex justify-center items-center h-screen'>MenuItem not found</div>
  }

  return (
    <div className='container max-w-md mx-auto pb-20'>
      <header className='sticky top-0 bg-white z-10 border-b'>
        <div className='flex items-center p-4'>
          <Link href='/' className='mr-4'>
            <ChevronLeft className='h-6 w-6' />
          </Link>
          <h1 className='text-xl font-bold'>{MenuItem.name}</h1>
        </div>
      </header>

      <main className='p-4'>
        <div className='relative h-48 w-full mb-4 rounded-lg overflow-hidden'>
          <Image src={MenuItem.image || '/placeholder.svg'} alt={MenuItem.name} fill className='object-cover' />
        </div>

        <div className='mb-6'>
          <h2 className='text-2xl font-bold'>{MenuItem.name}</h2>
          <p className='text-muted-foreground'>{MenuItem.description}</p>
          <p className='text-xl font-bold mt-2'>${MenuItem.price.toFixed(2)}</p>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>{`Customize Your ${MenuItem.type}`}</h3>
          <div className='space-y-2'>
            {MenuItem.itemToppings?.map((item) => {
              const isSelected = selectedToppings[item.id]
              const isDefault = item.isDefault
              const price = item.topping.price

              const showAddButton = !isSelected
              const showRemoveButton = isSelected

              const showPriceChange = (isDefault && isSelected) || (!isDefault && !isSelected)

              const priceDelta =
                price > 0
                  ? isSelected && isDefault
                    ? `−$${price.toFixed(2)}`
                    : !isSelected && !isDefault
                      ? `+$${price.toFixed(2)}`
                      : ''
                  : ''

              return (
                <Card key={item.topping.id} className='overflow-hidden'>
                  <CardContent className='p-3 flex justify-between items-center'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{item.topping.name}</span>
                      {showPriceChange && priceDelta && (
                        <span className='text-sm text-muted-foreground'>{priceDelta}</span>
                      )}
                    </div>
                    {showAddButton && (
                      <button
                        onClick={() => toggleTopping(item.topping.id)}
                        className='flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition'
                      >
                        <Check className='h-4 w-4' />
                        <span>Add</span>
                      </button>
                    )}
                    {showRemoveButton && (
                      <button
                        onClick={() => toggleTopping(item.topping.id)}
                        className='flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition'
                      >
                        <X className='h-4 w-4 text-red-600' />
                        <span>Remove</span>
                      </button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>Quantity</h3>
          <div className='flex items-center'>
            <Button variant='outline' size='icon' onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
              <Minus className='h-4 w-4' />
            </Button>
            <span className='mx-4 text-xl font-medium w-8 text-center'>{quantity}</span>
            <Button variant='outline' size='icon' onClick={() => handleQuantityChange(1)}>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <Separator className='my-6' />

        <div className='flex justify-between items-center mb-4'>
          <span className='text-lg font-medium'>Total:</span>
          <span className='text-xl font-bold'>${calculateTotalPrice().toFixed(2)}</span>
        </div>
      </main>

      <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t'>
        <Button className='w-full' size='lg' onClick={addToCart}>
          Add to Order
        </Button>
      </div>
    </div>
  )
}
