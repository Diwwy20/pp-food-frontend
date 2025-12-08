"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { User as UserType } from "@/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ProfileDropdownProps {
  user: UserType;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const tAuth = useTranslations("Auth");
  const tAdmin = useTranslations("Admin");
  const tToast = useTranslations("Toast");

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success(tToast("logoutSuccess"));
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error(tToast("operationFailed"));
    }
  };

  const displayName = user.nickName
    ? user.nickName
    : user.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user.email;

  const fallbackChar = user.nickName
    ? user.nickName.charAt(0).toUpperCase()
    : user.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "U";

  const avatarUrl = getImageUrl(user.profileImage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className="border-2 border-[#f4bc58]/50 h-10 w-10">
          <AvatarImage src={avatarUrl} className="object-cover" />
          <AvatarFallback className="bg-[#f4bc58] text-[#372117] font-bold">
            {fallbackChar}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-white border-gray-100 shadow-lg p-2"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none text-[#372117]">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user.role === "ADMIN" && (
          <>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-[#f4bc58]/20 focus:text-[#372117] rounded-md"
              onClick={() => router.push("/admin/products")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{tAdmin("productManagement")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          className="cursor-pointer focus:bg-[#f4bc58]/20 focus:text-[#372117] rounded-md"
          onClick={() => router.push("/profile")}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>{tAuth("profile")}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 rounded-md"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{tAuth("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
