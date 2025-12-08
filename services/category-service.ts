import { api } from "@/lib/axios";
import { Category } from "@/types";

export const categoryService = {
  getAll: async () => {
    const { data } = await api.get("/categories");
    return data.data as Category[];
  },

  create: async (payload: { nameTh: string; nameEn: string }) => {
    const { data } = await api.post("/categories", payload);
    return data;
  },

  update: async (id: number, payload: { nameTh: string; nameEn: string }) => {
    const { data } = await api.put(`/categories/${id}`, payload);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};
