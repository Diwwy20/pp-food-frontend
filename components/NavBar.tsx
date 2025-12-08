"use client";

import { NavBarMenuItems } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const NavBar = ({ isMobile = false }: { isMobile?: boolean }) => {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  return (
    <nav className={cn("w-full", isMobile ? "px-2" : "")}>
      <ul
        className={cn(
          "flex items-center",
          isMobile ? "flex-col items-start space-y-4" : "space-x-8"
        )}
      >
        {NavBarMenuItems.map((item) => {
          const isActive = pathname.includes(item.link);

          return (
            <Link
              key={item.link}
              href={item.link}
              className={cn(
                "font-chivo font-semibold transition-all duration-200 ease-in-out relative group",
                isMobile
                  ? "text-lg w-full py-2 px-4 rounded-lg hover:bg-[#f4bc58]/10"
                  : "text-sm md:text-base hover:scale-105",
                isActive
                  ? "text-[#f4bc58]"
                  : "text-neutral-600 hover:text-[#372117]"
              )}
            >
              {t(item.label as any)}

              {!isMobile && (
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f4bc58] transition-all duration-300 group-hover:w-full",
                    isActive && "w-full"
                  )}
                />
              )}
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
