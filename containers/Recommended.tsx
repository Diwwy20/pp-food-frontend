"use client";

import ItemCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product-service";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const Recommended = () => {
  const t = useTranslations("Home");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchRec = async () => {
      try {
        const all = await productService.getAll();
        const rec = all
          .filter((p: Product) => p.isRecommended && p.isAvailable)
          .slice(0, 6);
        setProducts(rec);
      } catch (error) {
        console.error("Failed to fetch recommended products", error);
      }
    };
    fetchRec();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = window.innerWidth < 640 ? 280 : 336;
    const scrollAmount = cardWidth;

    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleResize = () => updateScrollButtons();

    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", handleResize);

    updateScrollButtons();

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section className="w-full flex flex-col items-start gap-6 py-8">
      <div className="w-full flex items-center justify-between gap-4 px-1 md:px-0">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#372117]"
          style={{ fontFamily: "var(--font-chivo)" }}
        >
          {t("recommendedTitle")} 🌟
        </h2>

        <div className="hidden sm:flex items-center justify-center gap-3">
          <Button
            size={"icon"}
            className="border-2 border-[#f4bc58] text-[#372117] bg-transparent hover:bg-[#f4bc58]/10 rounded-full w-10 h-10 disabled:opacity-30 disabled:cursor-not-allowed"
            variant={"outline"}
            disabled={!canScrollLeft}
            onClick={() => handleScroll("left")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            size={"icon"}
            className="border-2 border-[#f4bc58] text-[#372117] bg-transparent hover:bg-[#f4bc58]/10 rounded-full w-10 h-10 disabled:opacity-30 disabled:cursor-not-allowed"
            variant={"outline"}
            disabled={!canScrollRight}
            onClick={() => handleScroll("right")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto flex items-stretch justify-start gap-4 pb-6 -mb-6 scrollbar-hide snap-x snap-mandatory px-1 md:px-1"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-center shrink-0 w-[85vw] sm:w-[300px] md:w-[320px]"
          >
            <ItemCard product={product} />
          </div>
        ))}

        <div className="shrink-0 w-1" />
      </div>
    </section>
  );
};

export default Recommended;
