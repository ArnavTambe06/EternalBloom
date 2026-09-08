import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant } from '@/types'
import { SHIPPING } from '@/lib/constants'

export function getCartVariantKey(item: CartItem) {
  return item.selected_variant?.id
    || item.selected_variant?.name
    || item.selected_color?.name
    || ''
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  shippingFlat: number
  freeShippingAbove: number

  // Actions
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (productId: string, variantKey?: string) => void
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setShippingSettings: (settings: { flat: number; freeAbove: number }) => void

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
      shippingFlat: SHIPPING.flat,
      freeShippingAbove: SHIPPING.freeAbove,

      addItem: (product, quantity = 1, variant) => {
        const variantKey = variant?.id || variant?.name || ''
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && getCartVariantKey(i) === variantKey
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && getCartVariantKey(i) === variantKey
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.product.stock_count) }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { product, quantity, selected_variant: variant }],
          }
        })
        get().openCart()
      },

      removeItem: (productId, variantKey) =>
        set((state) => ({
          items: state.items.filter((i) =>
            i.product.id !== productId ||
            (variantKey !== undefined && getCartVariantKey(i) !== variantKey)
          ),
        })),

      updateQuantity: (productId, quantity, variantKey) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) =>
                  i.product.id !== productId ||
                  (variantKey !== undefined && getCartVariantKey(i) !== variantKey)
                )
              : state.items.map((i) =>
                  i.product.id === productId &&
                  (variantKey === undefined || getCartVariantKey(i) === variantKey)
                    ? { ...i, quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      setShippingSettings: ({ flat, freeAbove }) => set({
        shippingFlat: flat,
        freeShippingAbove: freeAbove,
      }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      shipping: () => {
        const sub = get().subtotal()
        return sub >= get().freeShippingAbove ? 0 : get().shippingFlat
      },

      total: () => get().subtotal() + get().shipping(),
    }),
    {
      name: 'chenille-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
