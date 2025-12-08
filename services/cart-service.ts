import { api } from "@/lib/axios";

export const cartService = {
  getMyCart: async () => {
    const { data } = await api.get("/cart");
    return data.data;
  },

  addToCart: async (payload: {
    productId: number;
    quantity: number;
    selectedOptions?: any[];
  }) => {
    const { data } = await api.post("/cart/items", payload);
    return data.data;
  },

  updateItem: async (
    itemId: number,
    quantity: number,
    selectedOptions?: any[]
  ) => {
    const { data } = await api.put(`/cart/items/${itemId}`, {
      quantity,
      selectedOptions,
    });
    return data.data;
  },

  removeItem: async (itemId: number) => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data.data;
  },
};
