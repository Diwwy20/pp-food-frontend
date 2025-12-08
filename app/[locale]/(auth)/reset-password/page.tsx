"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getAuthErrorMessage } from "@/lib/error-mapping";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const tAuth = useTranslations("Auth");
  const tToast = useTranslations("Toast");
  const tError = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(tError("invalidToken"));
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(tError("passwordMatch"));
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error(tAuth("passwordRule"));
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: passwords.newPassword,
      });
      toast.success(tToast("resetSuccess"));
      router.push("/login");
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      const errorKey = getAuthErrorMessage(backendMsg);
      toast.error(
        tError.has(errorKey) ? tError(errorKey as any) : tToast("resetFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white">
      <CardHeader className="text-center">
        <CardTitle
          className="text-2xl font-bold text-[#372117]"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {tAuth("setNewPassword")}
        </CardTitle>
        <CardDescription>{tAuth("passwordReq")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">{tAuth("setNewPassword")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-10 focus-visible:ring-[#f4bc58]"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {tAuth("setConfirmPassword")}
            </Label>{" "}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-9 pr-10 focus-visible:ring-[#f4bc58] ${
                  passwords.confirmPassword &&
                  passwords.newPassword !== passwords.confirmPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwords.confirmPassword &&
              passwords.newPassword !== passwords.confirmPassword && (
                <p className="text-[10px] text-red-500">
                  {tError("passwordMatch")}
                </p>
              )}
          </div>

          <p className="text-[10px] text-gray-500 mt-1">
            {tAuth("passwordRule")}
          </p>

          <Button
            type="submit"
            className="w-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full mt-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              tAuth("resetBtn")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#f4bc58]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};
export default ResetPasswordPage;
