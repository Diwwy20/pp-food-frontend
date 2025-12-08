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
import { authService } from "@/services/auth-service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getAuthErrorMessage } from "@/lib/error-mapping";

const RegisterPage = () => {
  const router = useRouter();
  const t = useTranslations("Auth");
  const tToast = useTranslations("Toast");
  const tError = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.register(formData);
      toast.success(tToast("registerSuccess"));
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;

      if (validationErrors && Array.isArray(validationErrors)) {
        toast.error("Please check your input fields.");
      } else {
        const errorKey = getAuthErrorMessage(backendMessage);
        toast.error(
          tError.has(errorKey)
            ? tError(errorKey as any)
            : tToast("registerFailed")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white">
      <CardHeader className="space-y-1 text-center">
        <CardTitle
          className="text-2xl font-bold text-[#372117]"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {t("createAccount")}
        </CardTitle>
        <CardDescription>{t("enterInfo")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("firstName")}</Label>
              <Input
                id="firstName"
                placeholder="John"
                className="focus-visible:ring-[#f4bc58]"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("lastName")}</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="focus-visible:ring-[#f4bc58]"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
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
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              {t("passwordRule")}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full mt-4 cursor-pointer shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("createAccount")
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="font-semibold text-[#f4bc58] hover:text-[#372117]"
          >
            {t("signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
export default RegisterPage;
