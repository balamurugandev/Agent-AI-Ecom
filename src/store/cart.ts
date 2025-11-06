import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variant?: { id: string; color?: string; size?: string }, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

const generateCartItemId = (productId: string, variantId?: string): string => {
  return variantId ? `${productId}-${variantId}` : productId
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant, quantity = 1) => {
        const cartItemId = generateCartItemId(product.id, variant?.id)
        const existingItem = get().items.find(item => item.id === cartItemId)

        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }))
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            slug: product.slug,
            title: product.title,
            image: product.images[0],
            price: product.price,
            quantity,
            variant: variant ? {
              id: variant.id,
              color: variant.color,
              size: variant.size,
            } : undefined,
          }
          set(state => ({ items: [...state.items, newItem] }))
        }
      },
      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }))
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },
      clear: () => {
        set({ items: [] })
      },
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

