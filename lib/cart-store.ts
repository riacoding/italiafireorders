import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Topping {
  id: string
  name: string
  price: number
  default: boolean
}

interface CartItem {
  id: string
  pizzaId: string
  name: string
  price: number
  quantity: number
  image: string
  selectedToppings: Topping[]
  totalPrice: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getItemCount: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if item already exists
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.pizzaId === item.pizzaId &&
              JSON.stringify(i.selectedToppings) === JSON.stringify(item.selectedToppings),
          )

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += item.quantity
            updatedItems[existingItemIndex].totalPrice += item.totalPrice
            return { items: updatedItems }
          }

          // Add new item with unique ID
          return { items: [...state.items, { ...item, id: Date.now().toString() }] }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0)
      },
    }),
    {
      name: "pizza-cart-storage",
    },
  ),
)
