"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getAuthErrorMessage } from "@/lib/error-mapping";

const LoginPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const t = useTranslations("Auth");
  const tToast = useTranslations("Toast");
  const tError = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      if (response.data.user && response.data.accessToken) {
        setAuth(response.data.user, response.data.accessToken);
        toast.success(tToast("loginSuccess"));
        router.push("/home");
      }
    } catch (err: any) {
      const backendMsg = err.response?.data?.message || "";
      const errorKey = getAuthErrorMessage(backendMsg);

      toast.error(
        tError.has(errorKey)
          ? tError(errorKey as any)
          : tToast("operationFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-gray-200 shadow-xl bg-white">
      <CardHeader className="space-y-1 text-center">
        <CardTitle
          className="text-2xl font-bold text-[#372117]"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {t("welcomeBack")}
        </CardTitle>
        <CardDescription>{t("enterEmail")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-9 focus-visible:ring-[#f4bc58]"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#f4bc58] hover:text-[#372117]"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-9 pr-10 focus-visible:ring-[#f4bc58]"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full mt-4 cursor-pointer shadow-md transition-transform active:scale-95 "
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("signIn")
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {t("dontHaveAccount")}{" "}
          <Link
            href="/register"
            className="font-semibold text-[#f4bc58] hover:text-[#372117]"
          >
            {t("register")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
export default LoginPage;
