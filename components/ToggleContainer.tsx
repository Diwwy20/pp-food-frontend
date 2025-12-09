"use client";

import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
  User as UserIcon,
  Globe,
  ChevronRight,
} from "lucide-react";
import NavBar from "./NavBar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/hooks/use-auth-store";
import { authService } from "@/services/auth-service";
import { getImageUrl, cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const ToggleContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { user, logout } = useAuthStore();
  const tAuth = useTranslations("Auth");
  const tToast = useTranslations("Toast");

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success(tToast("logoutSuccess"));
      router.replace("/login");
    } catch (error) {
      toast.error(tToast("operationFailed"));
    }
  };

  const changeLanguage = (lang: string) => {
    router.replace(pathname, { locale: lang });
  };

  const avatarUrl = getImageUrl(user?.profileImage);
  const displayName = user?.nickName || user?.firstName || "User";
  const fallbackChar = (user?.nickName || user?.firstName || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#372117] hover:bg-[#f4bc58]/10 h-10 w-10 rounded-full cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[85vw] sm:w-[400px] flex flex-col p-0 border-l border-gray-100 bg-white"
      >
        <SheetHeader className="px-6 py-6 bg-gradient-to-br from-[#f4bc58]/20 to-transparent text-left shrink-0">
          <SheetTitle className="text-2xl text-[#372117] font-bold font-chivo flex justify-start items-center gap-3">
            <div className="relative h-20 w-20 rounded-full">
              <Image
                src="/images/logo.png"
                alt="logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <h2
                className="font-bold text-[#372117] text-lg leading-none"
                style={{ fontFamily: "var(--font-chivo)" }}
              >
                PP Food
              </h2>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Restaurant App
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Avatar className="border-2 border-white shadow-sm h-12 w-12">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-[#f4bc58] text-[#372117] font-bold">
                  {fallbackChar}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-[#372117] text-base truncate">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <SheetClose asChild>
                <Link href="/login" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-gray-200 text-[#372117] h-11 font-bold hover:bg-gray-50 hover:text-[#372117] cursor-pointer"
                  >
                    {tAuth("login")}
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/register" className="w-full">
                  <Button className="w-full rounded-xl bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 h-11 font-bold shadow-sm cursor-pointer">
                    {tAuth("register")}
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>

        <Separator className="opacity-50" />

        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <NavBar isMobile />{" "}
        </div>

        <SheetFooter className="mt-auto px-6 py-6 bg-gray-50 flex flex-col gap-6 sm:flex-col sm:space-x-0 border-t border-gray-100 shrink-0">
          <div className="flex flex-col gap-3 w-full">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Language
            </span>
            <div className="grid grid-cols-2 gap-3 bg-white p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => changeLanguage("th")}
                className={cn(
                  "flex items-center justify-center py-2 rounded-lg text-sm transition-all cursor-pointer",
                  locale === "th"
                    ? "bg-[#f4bc58] text-[#372117] font-bold shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {locale === "th" ? "ไทย" : "Thai"}
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={cn(
                  "flex items-center justify-center py-2 rounded-lg text-sm transition-all cursor-pointer",
                  locale === "en"
                    ? "bg-[#f4bc58] text-[#372117] font-bold shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {locale === "en" ? "English" : "อังกฤษ"}
              </button>
            </div>
          </div>

          {user && (
            <div className="flex flex-col gap-2 pt-2">
              <SheetClose asChild>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-[#372117] hover:bg-white hover:shadow-sm h-12 rounded-xl border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center">
                      <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                      {tAuth("profile")}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </Button>
                </Link>
              </SheetClose>

              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 h-12 rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" /> {tAuth("logout")}
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ToggleContainer;
