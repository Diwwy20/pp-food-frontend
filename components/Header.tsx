"use client";

import { Link } from "@/i18n/navigation";
import { ShoppingBasket } from "lucide-react";
import LogoContainer from "./LogoContainer";
import NavBar from "./NavBar";
import { Button } from "@/components/ui/button";
import ToggleContainer from "./ToggleContainer";
import ProfileDropdown from "./ProfileDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useCartStore } from "@/hooks/use-cart-store";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const Header = () => {
  const { user, isInitialized } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();
  const t = useTranslations("Auth");

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const renderAuthButtons = () => {
    if (!isInitialized) {
      return (
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      );
    }

    if (user) {
      return (
        <>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <Link href="/cart">
            <Button
              className="relative rounded-full border-2 border-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/10 cursor-pointer w-10 h-10 p-0"
              size={"icon"}
              variant={"outline"}
            >
              <ShoppingBasket size={20} />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>
          </Link>

          <div className="hidden md:block">
            <ProfileDropdown user={user} />
          </div>
        </>
      );
    }

    return (
      <div className="hidden md:flex items-center gap-3">
        <div className="mr-2">
          <LanguageSwitcher />
        </div>

        <Link href="/login">
          <Button
            variant="ghost"
            className="rounded-full border-2 border-[#f4bc58] text-[#372117] bg-transparent hover:bg-transparent hover:shadow-md transition-all ease-in-out duration-150 cursor-pointer"
          >
            {t("login")}
          </Button>
        </Link>
        <Link href="/register">
          <Button className="rounded-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 shadow-sm font-bold cursor-pointer">
            {t("register")}
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <header className="w-full px-4 md:px-12 py-4 md:py-6 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <LogoContainer />

      <div className="flex items-center justify-center space-x-4">
        <div className="hidden md:block">
          <NavBar />
        </div>

        {renderAuthButtons()}

        <ToggleContainer />
      </div>
    </header>
  );
};

export default Header;
