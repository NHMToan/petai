import { create } from "zustand";
import type { ShopItem } from "@/types";

type ShopCartItem = {
  product: ShopItem;
  quantity: number;
};

type ShopState = {
  cart: ShopCartItem[];
  addToCart: (product: ShopItem, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

export const shopStore = create<ShopState>((set) => ({
  cart: [],
  addToCart: (product, quantity = 1) =>
    set((state) => {
      const nextQuantity = Math.max(1, Math.floor(quantity));
      const existing = state.cart.find((item) => item.product.id === product.id);

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + nextQuantity }
              : item,
          ),
        };
      }

      return {
        cart: [...state.cart, { product, quantity: nextQuantity }],
      };
    }),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, Math.floor(quantity)) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  clearCart: () => set({ cart: [] }),
}));

export type { ShopCartItem };
