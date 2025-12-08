"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/hooks/use-cart-store";
import { useAuthStore } from "@/hooks/use-auth-store";
import { cartService } from "@/services/cart-service";
import { getImageUrl, getLocalizedText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight, Pencil } from "lucide-react";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import QuantitySelector from "@/components/QuantitySelector";
import { Skeleton } from "@/components/ui/skeleton";
import AddToCartModal from "@/components/AddToCartModal";
import { CartItem } from "@/types";

const CartPage = () => {
  const tCommon = useTranslations("Common");
  const tCart = useTranslations("Cart");
  const tToast = useTranslations("Toast");
  const locale = useLocale();
  const router = useRouter();

  const { user, isInitialized } = useAuthStore();
  const { cart, fetchCart, setCart, isLoading, updateQuantityOptimistically } =
    useCartStore();

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push("/login");
      } else {
        fetchCart();
      }
    }
  }, [user, isInitialized, fetchCart, router]);

  const handleOptimisticUpdate = (itemId: number, newQty: number) => {
    updateQuantityOptimistically(itemId, newQty);
  };

  const handleApiUpdate = async (itemId: number, newQty: number) => {
    try {
      const updatedCart = await cartService.updateItem(itemId, newQty);
      setCart(updatedCart);
    } catch (error) {
      toast.error(tCommon("operationFailed"));
      fetchCart();
    }
  };

  const openDeleteModal = (itemId: number) => {
    setItemToDelete(itemId);
  };

  const openEditModal = (item: CartItem) => {
    setEditingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const updatedCart = await cartService.removeItem(itemToDelete);
      setCart(updatedCart);
      toast.success(tToast("itemRemoved"));
      setItemToDelete(null);
    } catch (error) {
      toast.error(tCommon("operationFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  const subTotal =
    cart?.items?.reduce((acc, item) => {
      return acc + Number(item.product.price) * item.quantity;
    }, 0) || 0;

  if (isLoading || !isInitialized) {
    return (
      <div className="container mx-auto px-4 md:px-12 py-8 max-w-6xl">
        <Skeleton className="h-10 w-48 mb-8 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm items-start"
              >
                <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex justify-between items-end mt-2">
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-gray-50 p-6 rounded-full">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#372117]">
            {tCart("emptyTitle")}
          </h1>
          <p className="text-gray-500">{tCart("emptyDesc")}</p>
        </div>
        <Link href="/menu">
          <Button className="rounded-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold px-8 py-6 text-lg shadow-md cursor-pointer">
            {tCart("browseMenu")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-[#372117] mb-8 font-chivo">
        {tCart("title")} ({cart.items.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const noteOption = item.selectedOptions?.find(
              (o: any) => o.name === "Note"
            );
            const otherOptions =
              item.selectedOptions?.filter((o: any) => o.name !== "Note") || [];

            return (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm items-start transition-all hover:shadow-md group relative"
              >
                <div className="relative w-24 h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={
                      item.product.images?.[0]
                        ? getImageUrl(item.product.images[0].url)!
                        : "/images/placeholder-food.jpg"
                    }
                    alt={item.product.nameTh}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="pr-6">
                      <h3 className="font-bold text-[#372117] text-base leading-tight group-hover:text-[#f4bc58] transition-colors line-clamp-1">
                        {getLocalizedText(
                          locale,
                          item.product.nameTh,
                          item.product.nameEn
                        )}
                      </h3>

                      {otherOptions.length > 0 ? (
                        <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-1">
                          {otherOptions.map((opt: any, idx: number) => (
                            <span key={idx}>
                              {opt.value}
                              {Number(opt.price) > 0 && ` (+${opt.price})`}
                              {idx < otherOptions.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-300 mt-1 italic">
                          No options
                        </p>
                      )}

                      {noteOption && (
                        <p className="text-[#f4bc58] text-xs mt-1 flex items-start gap-1 font-medium line-clamp-1">
                          <span className="text-[10px]">📝</span>{" "}
                          {noteOption.value}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#372117] text-base">
                        {tCommon("baht")}{" "}
                        {(
                          Number(item.product.price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <QuantitySelector
                        itemId={item.id}
                        quantity={item.quantity}
                        onOptimisticUpdate={(newQty) =>
                          handleOptimisticUpdate(item.id, newQty)
                        }
                        onApiUpdate={(newQty) =>
                          handleApiUpdate(item.id, newQty)
                        }
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 text-gray-400 hover:text-[#f4bc58] transition-colors rounded-md hover:bg-[#f4bc58]/10 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(item);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-[#372117] mb-6">
              {tCart("summary")}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>{tCart("subtotal")}</span>
                <span>
                  {tCommon("baht")} {subTotal.toLocaleString()}
                </span>
              </div>
              {/* <div className="flex justify-between text-gray-600">
                <span>{tCart("deliveryFee")}</span>
                <span className="text-green-600">{tCart("free")}</span>
              </div> */}
              <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-bold text-[#372117]">
                <span>{tCart("total")}</span>
                <span>
                  {tCommon("baht")} {subTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              disabled
              className="w-full bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold h-12 rounded-xl text-lg shadow-md group cursor-pointer transition-all active:scale-95"
            >
              {tCart("checkout")}{" "}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="text-xs text-red-500 font-bold text-center mt-4">
              {tCart("checkoutUnavailable")}
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={tCommon("delete")}
        description={tCart("confirmRemove")}
        confirmText={tCommon("delete")}
        cancelText={tCommon("cancel")}
        variant="destructive"
        loading={isDeleting}
      />

      {editingItem && (
        <AddToCartModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          product={editingItem.product}
          existingItem={editingItem}
        />
      )}
    </div>
  );
};

export default CartPage;
