import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export default function MenuPage() {
  return (
    <div className="container max-w-md mx-auto pb-20">
      <header className="sticky top-0 bg-white z-10 border-b">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">Pizza Express</h1>
          <Link href="/cart" className="relative">
            <span className="sr-only">Cart</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </header>

      <main className="p-4">
        <h2 className="text-2xl font-bold mb-4">Our Menu</h2>

        <div className="space-y-4">
          {pizzas.map((pizza) => (
            <Link key={pizza.id} href={`/pizza/${pizza.id}`}>
              <Card className="overflow-hidden">
                <div className="flex h-24">
                  <div className="w-1/3 relative">
                    <Image src={pizza.image || "/placeholder.svg"} alt={pizza.name} fill className="object-cover" />
                  </div>
                  <CardContent className="w-2/3 p-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{pizza.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{pizza.description}</p>
                      <p className="font-bold mt-1">${pizza.price.toFixed(2)}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
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
