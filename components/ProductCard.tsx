"use client";

import { Product } from "@/types";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImageUrl, getLocalizedText } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import AddToCartModal from "./AddToCartModal";

const ItemCard = ({ product }: { product: Product }) => {
  const locale = useLocale();
  const tCommon = useTranslations("Common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstImage =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0].url)
      : "/images/placeholder-food.jpg";

  return (
    <>
      <motion.div layout className="h-full">
        <Card className="p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-200 group bg-white">
          <div className="h-48 flex items-center justify-center relative overflow-hidden rounded-lg">
            {!product.isAvailable && (
              <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
                <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded-full">
                  {tCommon("unavailable")}
                </span>
              </div>
            )}

            <Image
              src={firstImage || ""}
              alt={product.nameTh}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300 p-2"
            />
          </div>

          <div className="flex flex-col items-center text-center grow">
            <h2
              className="text-xl font-bold text-[#372117] mb-1 line-clamp-1 group-hover:text-[#f4bc58] transition-colors"
              style={{ fontFamily: "var(--font-chivo)" }}
            >
              {getLocalizedText(locale, product.nameTh, product.nameEn)}
            </h2>

            <CardDescription className="text-sm text-gray-600 line-clamp-2 px-2">
              {getLocalizedText(
                locale,
                product.descriptionTh,
                product.descriptionEn
              ) || "-"}
            </CardDescription>
          </div>

          <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <CardTitle className="text-xl font-bold text-[#f4bc58]">
              {tCommon("baht")}
              {Number(product.price).toLocaleString()}
            </CardTitle>

            {product.isAvailable && (
              <Button
                size="icon"
                className="rounded-full bg-[#372117] text-white hover:bg-[#f4bc58] hover:text-[#372117] transition-colors h-8 w-8 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();

                  {
                  }
                  setIsModalOpen(true);
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ItemCard;
