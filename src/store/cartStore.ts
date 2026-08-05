import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ColorVariant } from '@/types'
import { SHIPPING } from '@/lib/constants'

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (product: Product, quantity?: number, color?: ColorVariant) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  itemCount: () => number
  subtotal: () => number
  shipping: () => number
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, color) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.selected_color?.name === color?.name
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.selected_color?.name === color?.name
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.product.stock_count) }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { product, quantity, selected_color: color }],
          }
        })
        get().openCart()
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      shipping: () => {
        const sub = get().subtotal()
        return sub >= SHIPPING.freeAbove ? 0 : SHIPPING.flat
      },

      total: () => get().subtotal() + get().shipping(),
    }),
    {
      name: 'crochet-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)