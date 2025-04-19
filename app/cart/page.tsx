"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { toast } = useToast()
  // In a real app, this would be fetched from a cart state or API
  const [cartItems, setCartItems] = useState<any[]>([])

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const removeItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }

  const placeOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would make an API call to process the order
    toast({
      title: "Order placed!",
      description: "Your order has been placed successfully.",
    })

    // Clear cart after order is placed
    setCartItems([])
  }

  return (
    <div className="container max-w-md mx-auto pb-20">
      <header className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-4">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Your Order</h1>
        </div>
      </header>

      <main className="p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious pizzas to get started!</p>
            <Link href="/">
              <Button>Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start">
                      <div className="w-16 h-16 relative mr-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-sm">
                            {item.customizations && item.customizations.length > 0 && (
                              <div className="text-xs text-muted-foreground">{item.customizations.join(", ")}</div>
                            )}
                          </div>
                          <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$3.99</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(calculateTotal() * 0.08).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(calculateTotal() + 3.99 + calculateTotal() * 0.08).toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button className="w-full" size="lg" onClick={placeOrder} disabled={cartItems.length === 0}>
          Place Order
        </Button>
      </div>
    </div>
  )
}
