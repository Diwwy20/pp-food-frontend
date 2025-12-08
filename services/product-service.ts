import { api } from "@/lib/axios";

export const productService = {
  getAll: async (
    query = "",
    category = "all",
    isAvailable = "all",
    isRecommended = "all"
  ) => {
    const params = new URLSearchParams();
    if (query) params.append("query", query);

    if (category && category !== "all") params.append("category", category);

    if (isAvailable !== "all") params.append("isAvailable", isAvailable);
    if (isRecommended !== "all") params.append("isRecommended", isRecommended);

    const { data } = await api.get(`/products?${params.toString()}`);
    return data.data;
  },

  create: async (formData: FormData) => {
    const { data } = await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: number | string, formData: FormData) => {
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (id: number | string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  deleteImage: async (imgId: number) => {
    await api.delete(`/products/image/${imgId}`);
  },
};
