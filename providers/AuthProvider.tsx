"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { authService } from "@/services/auth-service";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAuth, logout, setInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authService.getMe();
        if (response.success && response.data.user) {
          setAuth(response.data.user, response.data.accessToken || "");
        }
      } catch (error) {
        logout();
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [setAuth, logout, setInitialized]);

  return <>{children}</>;
}
