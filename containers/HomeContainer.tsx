"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroCategories } from "@/lib/helpers";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const HomeContainer = () => {
  const t = useTranslations("Home");
  const tCat = useTranslations("HeroCategories");

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories in Hero", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCats();
  }, []);

  const getCategoryLink = (labelKey: string, defaultLink: string) => {
    if (isLoading) return "#";

    const targetNamePart =
      labelKey === "main"
        ? "Main"
        : labelKey === "drink"
        ? "Drink"
        : labelKey === "dessert"
        ? "Dessert"
        : labelKey === "appetizer"
        ? "Appetizer"
        : "";

    const matchedCat = categories.find((c) =>
      c.nameEn.toLowerCase().includes(targetNamePart.toLowerCase())
    );

    return matchedCat ? `/menu?category=${matchedCat.id}` : "/menu";
  };

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col justify-center space-y-6">
        <h2
          className="text-[45px] md:text-[55px] font-bold text-[#372117] leading-tight"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {t("heroTitle")}
        </h2>

        <p className="text-muted-foreground text-sm md:text-base">
          {t("heroDesc")}
        </p>

        <div className="flex items-center gap-4">
          <Link href="/menu">
            <Button
              size={"lg"}
              className="rounded-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 hover:shadow-md transition-all ease-in-out duration-150 cursor-pointer font-bold"
            >
              {t("explore")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
        <Image
          className="object-contain"
          src="/images/hero-food.png"
          width={400}
          height={400}
          priority
          alt="Delicious Restaurant Dish"
          unoptimized
        />

        <div className="absolute inset-y-0 right-0 md:flex flex-col items-center justify-center gap-6 hidden">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-36 h-12 rounded-full bg-gray-200/80 backdrop-blur-sm"
                />
              ))
            : HeroCategories.map((cat, idx) => {
                const dynamicHref = getCategoryLink(cat.label, cat.link);
                return (
                  <Link
                    href={dynamicHref}
                    key={idx}
                    className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center justify-start gap-3 w-36 shadow-lg shadow-neutral-100 hover:scale-105 transition-transform"
                  >
                    <Image
                      src={cat.imgSrc}
                      alt={cat.label}
                      width={24}
                      height={24}
                      className="object-contain"
                      unoptimized
                    />
                    <p className="font-semibold text-[#372117] text-sm capitalize">
                      {tCat(cat.label as any)}
                    </p>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
};
export default HomeContainer;
