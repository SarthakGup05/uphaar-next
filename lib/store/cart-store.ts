// store/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CouponState {
    code: string;
    discountAmount: number;
    discountType: "PERCENTAGE" | "FIXED";
}

interface CartStore {
  items: CartItem[];
  coupon: CouponState | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: 1 | -1) => void;
  applyCoupon: (coupon: CouponState) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  total: () => number;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      
      addItem: (newItem) => set((state) => {
        const existing = state.items.find((item) => item.id === newItem.id);
        if (existing) {
          return {
            items: state.items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          };
        }
        return { items: [...state.items, newItem] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateQuantity: (id, delta) => set((state) => ({
        items: state.items.map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        }),
      })),

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      subtotal: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      total: () => {
          const state = get();
          const sub = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
          if (state.coupon) {
              return Math.max(0, sub - state.coupon.discountAmount);
          }
          return sub;
      },
      
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: 'uphar-cart' } // Persist cart to localStorage so it survives refresh
  )
);