'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/components/CartContext'
import CurrencyDisplay from '@/components/CurrencyDisplay'
import { useToast } from '@/hooks/use-toast'
import { StorageImage } from '@aws-amplify/ui-react-storage'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/types'

const locationId = process.env.NEXT_PUBLIC_LOCATION_ID

export default function CartPage() {
  const [hasHydrated, setHasHydrated] = useState(false)
  const { toast } = useToast()
  const { items: cartItems, removeItem, clearCart, menuSlug } = useCart()
  const [backLink, setBackLink] = useState('')
  console.log('items', cartItems)
  const router = useRouter()

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    const lastLoc = localStorage.getItem('lastMenuLoc')
    const link = lastLoc ? `/menu/${lastLoc}` : '/'
    setBackLink(link)
  }, [])

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0)
  }

  const getItemTotal = (item: CartItem): number => {
    const toppingsTotal = item.toppings.reduce((sum, t) => sum + t.price, 0)
    return (item.price + toppingsTotal) * item.quantity
  }

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to your cart before placing an order.',
        variant: 'destructive',
      })
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems, locationId, menuSlug }),
    })

    const data = await res.json()
    console.log('checkout link url', data)
    if (data.url) {
      window.location.href = data.url
      return
    } else {
      // Handle error
      console.error('Failed to create checkout link')
    }

    toast({
      title: 'Order placed!',
      description: 'Your order has been placed successfully.',
    })

    // Clear cart after order is placed
    clearCart()
  }

  if (!hasHydrated) return null

  return (
    <div className='container max-w-md mx-auto pb-20'>
      <header className='sticky top-0 bg-white z-10 border-b'>
        <div className='flex items-center p-4'>
          <Link href={backLink} className='mr-4'>
            <ChevronLeft className='h-6 w-6' />
          </Link>
          <h1 className='text-xl font-bold'>Your Order</h1>
        </div>
      </header>

      <main className='p-4'>
        {cartItems.length === 0 ? (
          <div className='text-center py-12'>
            <h2 className='text-xl font-semibold mb-2'>Your cart is empty</h2>
            <p className='text-muted-foreground mb-6'>Add some delicious pizzas to get started!</p>
            <Link href={backLink}>
              <Button>Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <>
            <div id='menuItems' className='space-y-4 mb-6'>
              {cartItems.map((item, index) => (
                <Card key={index} className='overflow-hidden'>
                  <CardContent className='p-3'>
                    <div className='flex items-start'>
                      <div className='w-16 h-16 relative mr-3'>
                        <StorageImage
                          className='w-full h-full object-cover rounded border'
                          path={`items/${item.catalogItemId}.jpg`}
                          alt='menu item'
                        />
                      </div>
                      <div className='flex-1'>
                        <div className='flex justify-between'>
                          <h3 className='font-medium'>{item.customName ?? item.name}</h3>
                          <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => removeItem(item.id)}>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                        <p className='text-sm text-muted-foreground'>Qty: {item.quantity}</p>
                        <div className='flex justify-between items-center mt-1'>
                          <div className='text-sm'>
                            {item.toppings && item.toppings.length > 0 && (
                              <div className='text-xs text-muted-foreground'>
                                {item.toppings.map((topping) => topping.name).join(', ')}
                              </div>
                            )}
                          </div>
                          <p className='font-bold'>
                            <CurrencyDisplay value={getItemTotal(item)} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className='my-6' />

            <div className='space-y-2 mb-6'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>
                  <CurrencyDisplay value={calculateTotal()} />
                </span>
              </div>

              <div className='flex justify-between'>
                <span>Tax</span>
                <span>
                  <CurrencyDisplay value={calculateTotal() * 0.0825} />
                </span>
              </div>

              <Separator className='my-2' />
              <div className='flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span>
                  <CurrencyDisplay value={calculateTotal() + calculateTotal() * 0.0825} />
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      <div className='p-4'>
        <Button className='w-full mt-6' size='lg' onClick={placeOrder} disabled={cartItems.length === 0}>
          Place Order
        </Button>
      </div>
    </div>
  )
}
