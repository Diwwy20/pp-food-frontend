import { api } from "@/lib/axios";

export const paymentService = {
  generateQR: async (amount: number) => {
    const { data } = await api.post("/payments/qr", { amount });
    return data.data;
  },
};
