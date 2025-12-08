"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, MailCheck } from "lucide-react";
import { authService } from "@/services/auth-service";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getAuthErrorMessage } from "@/lib/error-mapping";
import { REGEXP_ONLY_DIGITS } from "input-otp"; // ✅ Import Regex

const VerifyContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const tAuth = useTranslations("Auth");
  const tToast = useTranslations("Toast");
  const tError = useTranslations("Errors");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      await authService.verifyEmail({ token: otp });
      toast.success(tToast("verifySuccess"));
      router.push("/login");
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      const errorKey = getAuthErrorMessage(backendMsg);
      toast.error(
        tError.has(errorKey) ? tError(errorKey as any) : tToast("verifyFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await authService.resendOTP({ email });
      toast.success(tToast("otpResent"));
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      const errorKey = getAuthErrorMessage(backendMsg);
      toast.error(
        tError.has(errorKey)
          ? tError(errorKey as any)
          : tToast("otpResendFailed")
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-gray-200 shadow-xl bg-white text-center">
      <CardHeader className="space-y-4 flex flex-col items-center">
        <div className="bg-[#f4bc58]/20 p-3 rounded-full">
          <MailCheck className="w-8 h-8 text-[#f4bc58]" />
        </div>
        <CardTitle
          className="text-2xl font-bold text-[#372117]"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {tAuth("verifyTitle")}
        </CardTitle>
        <CardDescription>
          {tAuth("codeSentTo")}{" "}
          <span className="font-medium text-[#372117]">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <InputOTPSlot
                key={idx}
                index={idx}
                className="border-[#f4bc58] focus:ring-[#f4bc58] h-10 w-10 md:h-12 md:w-12 text-lg font-bold"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="flex flex-col gap-3 w-full">
          <Button
            onClick={handleVerify}
            className="w-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full h-10 shadow-md transition-transform active:scale-95 cursor-pointer"
            disabled={isLoading || otp.length < 6}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              tAuth("verifyBtn")
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="text-xs text-gray-500 hover:text-[#f4bc58] cursor-pointer hover:bg-[#f4bc58]/10"
          >
            {isResending
              ? tAuth("sending")
              : tAuth("didntReceiveCode") + " " + tAuth("resendOTP")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const VerifyPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#f4bc58]" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
};
export default VerifyPage;
