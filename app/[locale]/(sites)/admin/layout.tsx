"use client";

import { useAuthStore } from "@/hooks/use-auth-store";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import { useTranslations } from "next-intl";
import AdminLayoutSkeleton from "@/components/skeletons/AdminLayoutSkeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isInitialized } = useAuthStore();
  const router = useRouter();
  const t = useTranslations("Admin");

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user || user.role !== "ADMIN") {
      router.replace("/home");
    } else {
      setIsChecking(false);
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || isChecking) {
    return <AdminLayoutSkeleton />;
  }

  return (
    <div className="min-h-screen animate-in fade-in duration-300">
      <div className="container mx-auto px-4 md:px-12 py-8 max-w-7xl">
        <h1
          className="text-2xl font-bold text-[#372117] mb-4 hidden md:block"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {t("dashboard")}
        </h1>

        <AdminNav />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
