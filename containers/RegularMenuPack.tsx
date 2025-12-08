"use client";

import { useState, useEffect } from "react";
import ItemCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cn, getLocalizedText } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { productService } from "@/services/product-service";
import { categoryService } from "@/services/category-service";
import { Product, Category } from "@/types";
import { UtensilsCrossed } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
const RegularMenuPack = () => {
  const t = useTranslations("Menu.categories");
  const tMenu = useTranslations("Menu");
  const locale = useLocale();

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);

        const activeProducts = productsData.filter(
          (p: Product) => p.isAvailable
        );

        setProducts(activeProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      router.replace("/menu", { scroll: false });
    } else {
      router.replace(`/menu?category=${categoryId}`, { scroll: false });
    }
  };

  const filteredProducts =
    currentCategory === "all"
      ? products
      : products.filter(
          (item) => item.categoryId.toString() === currentCategory
        );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center space-y-12">
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center md:justify-center gap-3 min-w-max px-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => handleCategoryChange("all")}
                className={cn(
                  "rounded-full border border-transparent px-6 py-2 transition-all capitalize font-medium text-gray-500 hover:text-[#372117] hover:bg-gray-100 cursor-pointer",
                  currentCategory === "all" &&
                    "bg-[#372117] text-[#f4bc58] hover:bg-[#372117]/90 hover:text-[#f4bc58] shadow-md border-[#372117]"
                )}
              >
                {t("all")}
              </Button>

              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant="ghost"
                  onClick={() => handleCategoryChange(cat.id.toString())}
                  className={cn(
                    "rounded-full border border-transparent px-6 py-2 transition-all capitalize font-medium text-gray-500 hover:text-[#372117] hover:bg-gray-100 cursor-pointer",
                    currentCategory === cat.id.toString() &&
                      "bg-[#372117] text-[#f4bc58] hover:bg-[#372117]/90 hover:text-[#f4bc58] shadow-md border-[#372117]"
                  )}
                >
                  {getLocalizedText(locale, cat.nameTh, cat.nameEn)}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={currentCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <ItemCard product={product} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-2xl w-full border-2 border-dashed border-gray-100"
            >
              <UtensilsCrossed className="w-12 h-12 mb-4 opacity-20" />
              <p>{tMenu("noItems")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
};

export default RegularMenuPack;
