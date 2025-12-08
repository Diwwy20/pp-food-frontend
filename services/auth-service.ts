import { api } from "@/lib/axios";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types";

export const authService = {
  login: async (credentials: LoginRequest) => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  register: async (payload: RegisterRequest) => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  verifyEmail: async (payload: VerifyEmailRequest) => {
    const { data } = await api.post<AuthResponse>(
      "/auth/verify-email",
      payload
    );
    return data;
  },

  resendOTP: async (payload: { email: string }) => {
    const { data } = await api.post<AuthResponse>("/auth/resend-otp", payload);
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest) => {
    const { data } = await api.post<AuthResponse>(
      "/auth/forgot-password",
      payload
    );
    return data;
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    const { data } = await api.post<AuthResponse>(
      "/auth/reset-password",
      payload
    );
    return data;
  },

  updateProfile: async (formData: FormData) => {
    const { data } = await api.put<AuthResponse>("/auth/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  changePassword: async (payload: any) => {
    const { data } = await api.put<AuthResponse>(
      "/auth/me/change-password",
      payload
    );
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data;
  },

  logout: async () => {
    const { data } = await api.post<AuthResponse>("/auth/logout");
    return data;
  },
};
