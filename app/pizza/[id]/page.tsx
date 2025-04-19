"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Minus, Plus, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface Topping {
  id: string
  name: string
  price: number
  default: boolean
}

interface Pizza {
  id: string
  name: string
  description: string
  price: number
  image: string
  toppings: Topping[]
}

export default function PizzaDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [pizza, setPizza] = useState<Pizza | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedToppings, setSelectedToppings] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const pizzaData = pizzas.find((p) => p.id === params.id)
    if (pizzaData) {
      setPizza(pizzaData)

      // Initialize selected toppings based on defaults
      const initialToppings: Record<string, boolean> = {}
      pizzaData.toppings.forEach((topping) => {
        initialToppings[topping.id] = topping.default
      })
      setSelectedToppings(initialToppings)
    }
    setIsLoading(false)
  }, [params.id])

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
    if (!pizza) return 0

    let total = pizza.price

    // Add price for selected toppings
    pizza.toppings.forEach((topping) => {
      // Only add price for non-default toppings that are selected
      // or subtract price for default toppings that are deselected
      if (!topping.default && selectedToppings[topping.id]) {
        total += topping.price
      } else if (topping.default && !selectedToppings[topping.id]) {
        total -= topping.price
      }
    })

    return total * quantity
  }

  const addToCart = () => {
    // In a real app, this would update a cart state or make an API call
    const selectedToppingsList = pizza?.toppings.filter((t) => selectedToppings[t.id]) || []

    toast({
      title: "Added to cart",
      description: `${quantity} ${pizza?.name} added to your order.`,
    })

    console.log("Added to cart:", {
      pizza,
      quantity,
      selectedToppings: selectedToppingsList,
      totalPrice: calculateTotalPrice(),
    })
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!pizza) {
    return <div className="flex justify-center items-center h-screen">Pizza not found</div>
  }

  return (
    <div className="container max-w-md mx-auto pb-20">
      <header className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-4">
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">{pizza.name}</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
          <Image src={pizza.image || "/placeholder.svg"} alt={pizza.name} fill className="object-cover" />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">{pizza.name}</h2>
          <p className="text-muted-foreground">{pizza.description}</p>
          <p className="text-xl font-bold mt-2">${pizza.price.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Customize Your Pizza</h3>
          <div className="space-y-2">
            {pizza.toppings.map((topping) => (
              <Card key={topping.id} className="overflow-hidden">
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{topping.name}</span>
                      {topping.price > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                          {selectedToppings[topping.id] ? `+$${topping.price.toFixed(2)}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={selectedToppings[topping.id] ? "default" : "outline"}
                    size="icon"
                    onClick={() => toggleTopping(topping.id)}
                  >
                    {selectedToppings[topping.id] ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Quantity</h3>
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4 text-xl font-medium w-8 text-center">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total:</span>
          <span className="text-xl font-bold">${calculateTotalPrice().toFixed(2)}</span>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button className="w-full" size="lg" onClick={addToCart}>
          Add to Order
        </Button>
      </div>
    </div>
  )
}

const pizzas = [
  {
    id: "margherita",
    name: "Margherita",
    description: "Classic tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    toppings: [
      { id: "basil", name: "Fresh Basil", price: 1.5, default: true },
      { id: "mozzarella", name: "Mozzarella", price: 2.0, default: true },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0, default: true },
      { id: "truffle-oil", name: "Truffle Oil", price: 3.5, default: false },
      { id: "mushrooms", name: "Mushrooms", price: 1.75, default: false },
    ],
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    description: "Tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=200",
    toppings: [
      { id: "pepperoni", name: "Pepperoni", price: 2.5, default: true },
      { id: "mozzarella", name: "Mozzarella", price: 2.0, default: true },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0, default: true },
      { id: "truffle-oil", name: "Truffle Oil", price: 3.5, default: false },
      { id: "mushrooms", name: "Mushrooms", price: 1.75, default: false },
    ],
  },
  {
    id: "vegetarian",
    name: "Vegetarian",
    description: "Tomato sauce, mozzarella, bell peppers, onions, and olives",
    price: 13.99,
    image: "/placeholder.svg?height=200&width=200",
    toppings: [
      { id: "bell-peppers", name: "Bell Peppers", price: 1.5, default: true },
      { id: "onions", name: "Onions", price: 1.0, default: true },
      { id: "olives", name: "Olives", price: 1.25, default: true },
      { id: "mozzarella", name: "Mozzarella", price: 2.0, default: true },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0, default: true },
      { id: "truffle-oil", name: "Truffle Oil", price: 3.5, default: false },
      { id: "mushrooms", name: "Mushrooms", price: 1.75, default: false },
    ],
  },
  {
    id: "hawaiian",
    name: "Hawaiian",
    description: "Tomato sauce, mozzarella, ham, and pineapple",
    price: 15.99,
    image: "/placeholder.svg?height=200&width=200",
    toppings: [
      { id: "ham", name: "Ham", price: 2.5, default: true },
      { id: "pineapple", name: "Pineapple", price: 1.75, default: true },
      { id: "mozzarella", name: "Mozzarella", price: 2.0, default: true },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0, default: true },
      { id: "truffle-oil", name: "Truffle Oil", price: 3.5, default: false },
      { id: "mushrooms", name: "Mushrooms", price: 1.75, default: false },
    ],
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    description: "Tomato sauce, mozzarella, pepperoni, sausage, bacon, and ham",
    price: 16.99,
    image: "/placeholder.svg?height=200&width=200",
    toppings: [
      { id: "pepperoni", name: "Pepperoni", price: 2.5, default: true },
      { id: "sausage", name: "Sausage", price: 2.5, default: true },
      { id: "bacon", name: "Bacon", price: 2.5, default: true },
      { id: "ham", name: "Ham", price: 2.5, default: true },
      { id: "mozzarella", name: "Mozzarella", price: 2.0, default: true },
      { id: "tomato-sauce", name: "Tomato Sauce", price: 0, default: true },
      { id: "truffle-oil", name: "Truffle Oil", price: 3.5, default: false },
      { id: "mushrooms", name: "Mushrooms", price: 1.75, default: false },
    ],
  },
]
