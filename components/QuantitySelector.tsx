"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface QuantitySelectorProps {
  quantity: number;
  itemId: number;
  onOptimisticUpdate: (newQty: number) => void;
  onApiUpdate: (newQty: number) => Promise<void>;
  disabled?: boolean;
}

const QuantitySelector = ({
  quantity,
  itemId,
  onOptimisticUpdate,
  onApiUpdate,
  disabled,
}: QuantitySelectorProps) => {
  const debouncedApiCall = useDebouncedCallback(async (val: number) => {
    await onApiUpdate(val);
  }, 800);

  const handleChange = (change: number) => {
    const newVal = quantity + change;
    if (newVal < 1) return;

    onOptimisticUpdate(newVal);

    debouncedApiCall(newVal);
  };

  return (
    <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-full border border-gray-200">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm cursor-pointer"
        disabled={disabled}
        onClick={() => handleChange(-1)}
      >
        <Minus className="w-3 h-3" />
      </Button>

      <span className="text-sm font-bold w-6 text-center text-[#372117]">
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm cursor-pointer"
        disabled={disabled}
        onClick={() => handleChange(1)}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
