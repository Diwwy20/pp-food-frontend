"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Layers, AlertTriangle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export interface OptionChoice {
  nameTh: string;
  nameEn: string;
  price: number;
}

export interface ProductOption {
  nameTh: string;
  nameEn: string;
  isRequired: boolean;
  maxSelect: number;
  choices: OptionChoice[];
}

interface Props {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
  showError?: boolean;
}

const ProductOptionsForm = ({
  options,
  onChange,
  showError = false,
}: Props) => {
  const t = useTranslations("Admin.form");

  const addOptionGroup = () => {
    onChange([
      ...options,
      { nameTh: "", nameEn: "", isRequired: false, maxSelect: 1, choices: [] },
    ]);
  };

  const removeOptionGroup = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    onChange(newOptions);
  };

  const updateOptionGroup = (
    index: number,
    field: keyof ProductOption,
    value: any
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange(newOptions);
  };

  const addChoice = (groupIndex: number) => {
    const newOptions = [...options];
    newOptions[groupIndex].choices.push({ nameTh: "", nameEn: "", price: 0 });
    onChange(newOptions);
  };

  const removeChoice = (groupIndex: number, choiceIndex: number) => {
    const newOptions = [...options];
    newOptions[groupIndex].choices.splice(choiceIndex, 1);
    onChange(newOptions);
  };

  const updateChoice = (
    groupIndex: number,
    choiceIndex: number,
    field: keyof OptionChoice,
    value: any
  ) => {
    const newOptions = [...options];

    if (field === "price") {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        value = 0;
      } else {
        value = numValue;
      }
    }

    newOptions[groupIndex].choices[choiceIndex] = {
      ...newOptions[groupIndex].choices[choiceIndex],
      [field]: value,
    };
    onChange(newOptions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#f4bc58]" />
          <Label className="text-lg font-bold text-[#372117]">
            {t("optionsSection")}
          </Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOptionGroup}
          className="cursor-pointer border-dashed border-[#f4bc58] text-[#f4bc58] hover:bg-[#f4bc58]/10 hover:text-[#372117]"
        >
          <Plus className="w-4 h-4 mr-1" /> {t("addOptionGroup")}
        </Button>
      </div>

      {options.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-400">{t("noOptions")}</p>
        </div>
      )}

      {options.map((opt, groupIdx) => {
        const isError = showError && opt.choices.length === 0;

        return (
          <div
            key={groupIdx}
            className={`border rounded-xl bg-white shadow-sm overflow-hidden transition-all ${
              isError
                ? "border-orange-300 ring-2 ring-orange-100"
                : "border-gray-200"
            }`}
          >
            <div className="bg-gray-50/80 p-4 border-b border-gray-100 relative">
              <button
                type="button"
                onClick={() => removeOptionGroup(groupIdx)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                title="Remove Group"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                {t("groupLabel")}
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500">
                    {t("optionNameTh")}
                  </span>
                  <Input
                    value={opt.nameTh}
                    onChange={(e) =>
                      updateOptionGroup(groupIdx, "nameTh", e.target.value)
                    }
                    placeholder={t("placeholderOptionTh")}
                    className="bg-white h-9 focus-visible:ring-[#f4bc58]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500">
                    {t("optionNameEn")}
                  </span>
                  <Input
                    value={opt.nameEn}
                    onChange={(e) =>
                      updateOptionGroup(groupIdx, "nameEn", e.target.value)
                    }
                    placeholder={t("placeholderOptionEn")}
                    className="bg-white h-9 focus-visible:ring-[#f4bc58]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 items-center mt-4 pt-3 border-t border-gray-200/50">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={opt.isRequired}
                    onCheckedChange={(c) =>
                      updateOptionGroup(groupIdx, "isRequired", c)
                    }
                    className="data-[state=checked]:bg-[#f4bc58] cursor-pointer"
                  />
                  <Label className="text-xs cursor-pointer">
                    {t("mandatory")}
                  </Label>
                </div>

                <div className="w-[1px] h-4 bg-gray-300"></div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs whitespace-nowrap text-gray-600">
                    {t("maxSelect")}:
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    className="w-16 h-8 bg-white focus-visible:ring-[#f4bc58] text-center"
                    value={opt.maxSelect}
                    onChange={(e) =>
                      updateOptionGroup(
                        groupIdx,
                        "maxSelect",
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                {t("choices")} ({opt.choices.length})
              </Label>

              {isError && (
                <div className="flex flex-col items-center justify-center py-4 bg-orange-50 rounded-lg border border-dashed border-orange-200 mb-3 text-orange-600 animate-in fade-in zoom-in-95">
                  <AlertTriangle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Empty Group</span>
                  <span className="text-[10px] opacity-80">
                    Please add at least one choice
                  </span>
                </div>
              )}

              <div className="space-y-2">
                {opt.choices.map((choice, choiceIdx) => (
                  <div
                    key={choiceIdx}
                    className="flex flex-wrap md:flex-nowrap gap-2 items-center group"
                  >
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <Input
                        placeholder={t("placeholderChoiceTh")}
                        className="h-9 bg-gray-50 focus-visible:ring-[#f4bc58]"
                        value={choice.nameTh}
                        onChange={(e) =>
                          updateChoice(
                            groupIdx,
                            choiceIdx,
                            "nameTh",
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder={t("placeholderChoiceEn")}
                        className="h-9 bg-gray-50 focus-visible:ring-[#f4bc58]"
                        value={choice.nameEn}
                        onChange={(e) =>
                          updateChoice(
                            groupIdx,
                            choiceIdx,
                            "nameEn",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="relative w-28 shrink-0 flex items-center">
                      <Input
                        type="number"
                        min={0}
                        className={`h-9 pl-6 pr-8 focus-visible:ring-[#f4bc58] text-right ${
                          choice.price === 0
                            ? "text-gray-400 bg-gray-50"
                            : "text-[#372117] font-bold bg-white border-[#f4bc58]/50"
                        }`}
                        placeholder="0"
                        value={choice.price}
                        onChange={(e) =>
                          updateChoice(
                            groupIdx,
                            choiceIdx,
                            "price",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e")
                            e.preventDefault();
                        }}
                      />
                      <div className="absolute right-3 text-gray-400 text-xs">
                        ฿
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeChoice(groupIdx, choiceIdx)}
                      className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove Choice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addChoice(groupIdx)}
                className="mt-3 text-xs text-[#f4bc58] hover:text-[#372117] hover:bg-[#f4bc58]/10 h-8 px-3 rounded-full cursor-pointer"
              >
                <Plus className="w-3 h-3 mr-1" /> {t("addChoice")}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductOptionsForm;
