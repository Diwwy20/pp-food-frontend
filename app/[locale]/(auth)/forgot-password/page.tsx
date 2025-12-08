"use client";

import Link from "next/link";
import { useState } from "react";
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
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getAuthErrorMessage } from "@/lib/error-mapping";

const ForgotPasswordPage = () => {
  const t = useTranslations("Auth");
  const tToast = useTranslations("Toast");
  const tError = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setIsSent(true);
      toast.success(tToast("resetLinkSent"));
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
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

  if (isSent) {
    return (
      <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#372117]">
            {t("checkEmail")}
          </CardTitle>
          <CardDescription>{t("sentLinkTo", { email })}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="text-sm font-medium text-[#f4bc58] hover:text-[#372117] flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t("backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white">
      <CardHeader className="text-center">
        <CardTitle
          className="text-2xl font-bold text-[#372117]"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {t("forgotPassword")}
        </CardTitle>
        <CardDescription>{t("resetInstructions")}</CardDescription>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full mt-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              t("resetBtn")
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-500 hover:text-[#372117] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("backToLogin")}
        </Link>
      </CardFooter>
    </Card>
  );
};
export default ForgotPasswordPage;
