import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("Auth");
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50/50 relative">
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#372117] font-semibold hover:text-[#f4bc58] transition-colors text-sm md:text-base"
        >
          <ChevronLeft className="w-5 h-5" /> {t("backToHome")}
        </Link>
      </div>

      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-10">
        <LanguageSwitcher />
      </div>

      <div className="mb-8 flex flex-col items-center">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#372117]"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          PP Food 🍔
        </h1>
      </div>

      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
};
export default AuthLayout;
