import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { TCoreProduct } from '../../../utils/consts'

export type CartItem = {
  product: TCoreProduct
}

type CartState = {
  items: CartItem[]
  addItem: (product: TCoreProduct) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => ({
          items: [...state.items, { product }],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
