"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Package, LayoutList } from "lucide-react";
import { useTranslations } from "next-intl";

const AdminNav = () => {
  const pathname = usePathname();
  const t = useTranslations("Admin");

  const navItems = [
    {
      label: t("productManagement"),
      href: "/admin/products",
      icon: <Package className="w-4 h-4" />,
    },
    {
      label: t("categoryManagement"),
      href: "/admin/categories",
      icon: <LayoutList className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 bg-gray-100/50 p-1 rounded-lg w-fit border border-gray-200">
      {navItems.map((item) => {
        const isActive = pathname.includes(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-white text-[#372117] shadow-sm font-bold border border-gray-100"
                : "text-gray-500 hover:text-[#372117] hover:bg-white/50"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default AdminNav;
