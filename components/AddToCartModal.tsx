"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product, ProductOption, ProductOptionChoice, CartItem } from "@/types";
import Image from "next/image";
import { getImageUrl, getLocalizedText } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, Loader2, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cartService } from "@/services/cart-service";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useRouter } from "@/i18n/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/hooks/use-cart-store";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  existingItem?: CartItem | null;
}

const AddToCartModal = ({
  isOpen,
  onClose,
  product,
  existingItem,
}: AddToCartModalProps) => {
  const tCommon = useTranslations("Common");
  const tAuth = useTranslations("Auth");
  const tCart = useTranslations("Cart");
  const tToast = useTranslations("Toast");
  const locale = useLocale();
  const { user } = useAuthStore();
  const router = useRouter();
  const { setCart } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [selections, setSelections] = useState<
    Record<string, ProductOptionChoice[]>
  >({});

  useEffect(() => {
    if (isOpen && product) {
      if (existingItem) {
        setQuantity(existingItem.quantity);
        const initialSelections: Record<string, ProductOptionChoice[]> = {};
        let initialNote = "";
        const savedOptions = (existingItem.selectedOptions as any[]) || [];

        savedOptions.forEach((savedOpt) => {
          if (savedOpt.name === "Note") {
            initialNote = savedOpt.value;
            return;
          }
          const group = product.options?.find(
            (opt) =>
              getLocalizedText("th", opt.nameTh, opt.nameEn) ===
                savedOpt.name ||
              getLocalizedText("en", opt.nameTh, opt.nameEn) === savedOpt.name
          );
          if (group) {
            const choice = group.choices.find(
              (c) =>
                getLocalizedText("th", c.nameTh, c.nameEn) === savedOpt.value ||
                getLocalizedText("en", c.nameTh, c.nameEn) === savedOpt.value
            );
            if (choice) {
              const groupKey = group.nameTh;
              if (!initialSelections[groupKey])
                initialSelections[groupKey] = [];
              initialSelections[groupKey].push(choice);
            }
          }
        });
        setSelections(initialSelections);
        setNote(initialNote);
      } else {
        setQuantity(1);
        setSelections({});
        setNote("");
      }
    }
  }, [isOpen, product, existingItem]);

  const pricePerUnit = useMemo(() => {
    if (!product) return 0;
    let base = Number(product.price);
    Object.values(selections)
      .flat()
      .forEach((choice) => {
        base += Number(choice.price || 0);
      });
    return base;
  }, [product, selections]);

  const totalPrice = pricePerUnit * quantity;

  if (!product) return null;

  const handleCheckboxChange = (
    option: ProductOption,
    choice: ProductOptionChoice,
    checked: boolean
  ) => {
    setSelections((prev) => {
      const groupName = option.nameTh;
      const currentChoices = prev[groupName] || [];
      if (checked) {
        if (currentChoices.length >= option.maxSelect) {
          toast.error(tCart("selectMax", { max: option.maxSelect }));
          return prev;
        }
        return { ...prev, [groupName]: [...currentChoices, choice] };
      } else {
        return {
          ...prev,
          [groupName]: currentChoices.filter((c) => c.nameTh !== choice.nameTh),
        };
      }
    });
  };

  const handleRadioChange = (
    option: ProductOption,
    choice: ProductOptionChoice
  ) => {
    setSelections((prev) => ({ ...prev, [option.nameTh]: [choice] }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error(tAuth("loginToOrder"));
      router.push("/login");
      return;
    }
    for (const opt of product.options || []) {
      if (opt.isRequired) {
        const selected = selections[opt.nameTh];
        if (!selected || selected.length === 0) {
          const optName = getLocalizedText(locale, opt.nameTh, opt.nameEn);
          toast.error(`${tCart("required")}: ${optName}`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const selectedOptionsArray = Object.entries(selections).flatMap(
        ([groupName, choices]) => {
          const optionDef = product.options?.find(
            (o) => o.nameTh === groupName
          );
          const finalGroupName = optionDef
            ? getLocalizedText(locale, optionDef.nameTh, optionDef.nameEn)
            : groupName;
          return choices.map((c) => ({
            name: finalGroupName,
            value: getLocalizedText(locale, c.nameTh, c.nameEn),
            price: Number(c.price),
          }));
        }
      );

      if (note.trim()) {
        selectedOptionsArray.push({
          name: "Note",
          value: note.trim(),
          price: 0,
        });
      }

      let updatedCart;
      if (existingItem) {
        updatedCart = await cartService.updateItem(
          existingItem.id,
          quantity,
          selectedOptionsArray
        );
        toast.success(tToast("cartUpdated") || "Cart updated");
      } else {
        updatedCart = await cartService.addToCart({
          productId: product.id,
          quantity: quantity,
          selectedOptions: selectedOptionsArray,
        });
        toast.success(tToast("addedToCart"));
      }

      setCart(updatedCart);
      onClose();
    } catch (error) {
      toast.error(tCommon("operationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-xl p-0 overflow-hidden max-h-[90vh] flex flex-col gap-0 border-none shadow-2xl">
        <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/80 p-2 text-gray-500 hover:text-black hover:bg-white transition-all shadow-sm cursor-pointer">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="relative w-full h-48 bg-gray-100 shrink-0">
          <Image
            src={
              product.images?.[0]
                ? getImageUrl(product.images[0].url)!
                : "/images/placeholder-food.jpg"
            }
            alt="product"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white pr-8">
            <DialogTitle className="font-chivo text-2xl font-bold shadow-sm leading-tight">
              {getLocalizedText(locale, product.nameTh, product.nameEn)}
            </DialogTitle>
            <p className="text-white/90 text-sm line-clamp-1 mt-1">
              {getLocalizedText(
                locale,
                product.descriptionTh,
                product.descriptionEn
              )}
            </p>
          </div>
        </div>

        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {product.options?.map((opt, idx) => {
            const isSingleSelect = opt.maxSelect === 1;
            const selectedChoices = selections[opt.nameTh] || [];

            return (
              <div
                key={idx}
                className="space-y-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#372117] text-base">
                      {getLocalizedText(locale, opt.nameTh, opt.nameEn)}
                    </h4>
                    {opt.isRequired && (
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {tCart("required")}
                      </span>
                    )}
                  </div>
                  {!opt.isRequired && (
                    <span className="text-xs text-gray-400">
                      {tCart("optional")}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {isSingleSelect ? (
                    <RadioGroup
                      value={
                        selectedChoices.length > 0
                          ? JSON.stringify(selectedChoices[0])
                          : undefined
                      }
                      onValueChange={(val) => {
                        if (!val) return;
                        handleRadioChange(opt, JSON.parse(val));
                      }}
                    >
                      {opt.choices.map((choice, cIdx) => {
                        const isSelected = selectedChoices.some(
                          (s) => s.nameTh === choice.nameTh
                        );
                        return (
                          <Label
                            key={cIdx}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#f4bc58] bg-[#f4bc58]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value={JSON.stringify(choice)}
                                id={`${opt.id}-${choice.id}`}
                                className="text-[#f4bc58] border-gray-400"
                              />
                              <span className="font-normal text-sm text-gray-700">
                                {getLocalizedText(
                                  locale,
                                  choice.nameTh,
                                  choice.nameEn
                                )}
                              </span>
                            </div>
                            {Number(choice.price) > 0 && (
                              <span className="text-sm font-medium text-[#372117]">
                                +{Number(choice.price)}
                              </span>
                            )}
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {opt.choices.map((choice, cIdx) => {
                        const isChecked = selectedChoices.some(
                          (s) => s.nameTh === choice.nameTh
                        );
                        return (
                          <div
                            key={cIdx}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              isChecked
                                ? "border-[#f4bc58] bg-[#f4bc58]/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() =>
                              handleCheckboxChange(opt, choice, !isChecked)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={isChecked}
                                className="data-[state=checked]:bg-[#f4bc58] data-[state=checked]:border-[#f4bc58]"
                              />
                              <Label className="cursor-pointer font-normal text-sm text-gray-700">
                                {getLocalizedText(
                                  locale,
                                  choice.nameTh,
                                  choice.nameEn
                                )}
                              </Label>
                            </div>
                            {Number(choice.price) > 0 && (
                              <span className="text-sm font-medium text-[#372117]">
                                +{Number(choice.price)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="space-y-2 pt-2">
            <Label className="font-bold text-[#372117] flex items-center gap-2">
              📝 {tCart("note")}
            </Label>
            <Textarea
              placeholder={tCart("notePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none bg-gray-50 focus-visible:ring-[#f4bc58]"
              maxLength={100}
            />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-white"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold w-6 text-center text-lg text-[#372117]">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-white"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button
              className="flex-1 bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full h-12 text-base shadow-md transition-transform active:scale-95"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="flex items-center justify-between w-full px-2">
                  <span>
                    {existingItem ? tCommon("save") : tCart("addToCart")}
                  </span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                    {tCommon("baht")} {totalPrice.toLocaleString()}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddToCartModal;
