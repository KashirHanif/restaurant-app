import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (item) => {
        const existingItem = get().cartItems.find(i => i.id === item.id);
        if (existingItem) {
          set({
            cartItems: get().cartItems.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          });
        } else {
          set({
            cartItems: [...get().cartItems, { ...item, quantity: 1 }]
          });
        }
      },

      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter(i => i.id !== id)
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
        } else {
          set({
            cartItems: get().cartItems.map(i =>
              i.id === id ? { ...i, quantity } : i
            )
          });
        }
      },

      clearCart: () => {
        set({ cartItems: [] });
        AsyncStorage.removeItem('user-cart-storage'); // Optional: Clean from storage too
      },
    }),
    {
      name: 'user-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
