import { create } from "zustand";
import { Cart, CartItem } from "@/types";
import { cartService } from "@/services/cart-service";

interface CartState {
  cart: Cart | null;
  totalItems: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  setCart: (cart: Cart) => void;
  resetCart: () => void;
  updateQuantityOptimistically: (itemId: number, newQuantity: number) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  totalItems: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cartData = await cartService.getMyCart();
      const count =
        cartData?.items?.reduce(
          (acc: number, item: CartItem) => acc + item.quantity,
          0,
        ) || 0;
      set({ cart: cartData, totalItems: count, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch cart", error);
      set({ cart: null, totalItems: 0, isLoading: false });
    }
  },

  setCart: (cart: Cart) => {
    const count =
      cart?.items?.reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0,
      ) || 0;
    set({ cart, totalItems: count });
  },

  updateQuantityOptimistically: (itemId: number, newQuantity: number) => {
    const currentCart = get().cart;
    if (!currentCart) return;

    const newItems = currentCart.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );

    const newTotalItems = newItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    set({
      cart: { ...currentCart, items: newItems },
      totalItems: newTotalItems,
    });
  },

  resetCart: () => set({ cart: null, totalItems: 0 }),
}));
