"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

const LanguageSwitcher = ({
  variant = "ghost",
  className,
}: LanguageSwitcherProps) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            "group h-9 gap-2 rounded-full border border-gray-200 bg-white px-3 text-[#372117] hover:border-[#f4bc58] hover:bg-[#f4bc58]/10 hover:text-[#372117] transition-all duration-200 ease-in-out shadow-sm cursor-pointer",
            className
          )}
        >
          <Globe className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#f4bc58]" />
          <span className="text-xs font-bold tracking-wide min-w-[2rem] text-center uppercase">
            {locale}
          </span>
          <ChevronDown className="h-3 w-3 text-gray-400 transition-transform duration-300 group-data-[state=open]:rotate-180 group-hover:text-[#f4bc58]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[120px] rounded-xl border-gray-100 bg-white p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95"
      >
        <DropdownMenuItem
          onClick={() => handleLocaleChange("th")}
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors focus:bg-[#f4bc58]/10 focus:text-[#372117]",
            locale === "th" && "bg-[#f4bc58]/5 text-[#372117]"
          )}
        >
          <span
            className={cn(
              "text-sm",
              locale === "th" ? "font-bold" : "font-medium"
            )}
          >
            ไทย
          </span>
          {locale === "th" && (
            <div className="h-1.5 w-1.5 rounded-full bg-[#f4bc58]" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleLocaleChange("en")}
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors focus:bg-[#f4bc58]/10 focus:text-[#372117]",
            locale === "en" && "bg-[#f4bc58]/5 text-[#372117]"
          )}
        >
          <span
            className={cn(
              "text-sm",
              locale === "en" ? "font-bold" : "font-medium"
            )}
          >
            English
          </span>
          {locale === "en" && (
            <div className="h-1.5 w-1.5 rounded-full bg-[#f4bc58]" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
