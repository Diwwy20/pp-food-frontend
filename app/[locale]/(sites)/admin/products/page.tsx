"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore } from "@/hooks/use-auth-store";
import { productService } from "@/services/product-service";
import { categoryService } from "@/services/category-service";
import { Product, Category } from "@/types";
import { getImageUrl, getLocalizedText, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import ProductOptionsForm, {
  ProductOption,
} from "@/components/ProductOptionsForm";
import ConfirmModal from "@/components/ConfirmModal";
import {
  Loader2,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  UploadCloud,
  Star,
  Package,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminProductsPage = () => {
  const { user, isInitialized } = useAuthStore();
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const tToast = useTranslations("Toast");
  const tMenu = useTranslations("Menu.categories");
  const locale = useLocale();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [recommendedFilter, setRecommendedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showError, setShowError] = useState(false);

  const [formData, setFormData] = useState({
    nameTh: "",
    nameEn: "",
    descriptionTh: "",
    descriptionEn: "",
    price: "",
    categoryId: "",
    isRecommended: false,
    isAvailable: true,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  useEffect(() => {
    if (isInitialized && user?.role === "ADMIN") {
      fetchData();
    }
  }, [
    searchQuery,
    categoryFilter,
    statusFilter,
    recommendedFilter,
    isInitialized,
    user,
  ]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(
          searchQuery,
          categoryFilter,
          statusFilter,
          recommendedFilter
        ),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const checkScroll = useCallback(() => {
    if (imageScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = imageScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  }, []);
  useEffect(() => {
    checkScroll();
    const container = imageScrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      setTimeout(checkScroll, 100);
    }
    return () => container?.removeEventListener("scroll", checkScroll);
  }, [previewUrls, editingProduct, imagesToDelete, checkScroll, isModalOpen]);
  const handleScroll = (direction: "left" | "right") => {
    if (imageScrollRef.current) {
      const scrollAmount = 200;
      imageScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);
  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    } else {
      toast.error("Only image files are allowed");
    }
  };
  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };
  const markImageForDeletion = (imgId: number) => {
    setImagesToDelete((prev) => [...prev, imgId]);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      nameTh: "",
      nameEn: "",
      descriptionTh: "",
      descriptionEn: "",
      price: "",
      categoryId: "",
      isRecommended: false,
      isAvailable: true,
    });
    setProductOptions([]);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setImagesToDelete([]);
    setShowError(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nameTh: product.nameTh || "",
      nameEn: product.nameEn || "",
      descriptionTh: product.descriptionTh || "",
      descriptionEn: product.descriptionEn || "",
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      isRecommended: product.isRecommended || false,
      isAvailable: product.isAvailable ?? true,
    });

    const mappedOptions =
      product.options?.map((opt) => ({
        nameTh: opt.nameTh,
        nameEn: opt.nameEn || "",
        isRequired: opt.isRequired,
        maxSelect: opt.maxSelect,
        choices: opt.choices.map((c) => ({
          nameTh: c.nameTh,
          nameEn: c.nameEn || "",
          price: Number(c.price),
        })),
      })) || [];
    setProductOptions(mappedOptions);

    setSelectedFiles([]);
    setPreviewUrls([]);
    setImagesToDelete([]);
    setShowError(false);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setProductToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.delete(productToDelete);
      toast.success(tToast("productDeleted"));
      fetchData();
      setProductToDelete(null);
    } catch (error) {
      toast.error(tToast("operationFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emptyGroups = productOptions.filter(
      (opt) => opt.choices.length === 0
    );
    if (emptyGroups.length > 0) {
      setShowError(true);
      toast.error(
        "Please add choices to all option groups or remove empty groups."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("nameTh", formData.nameTh);
      data.append("nameEn", formData.nameEn);
      data.append("descriptionTh", formData.descriptionTh);
      data.append("descriptionEn", formData.descriptionEn);
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);
      data.append("isRecommended", String(formData.isRecommended));
      data.append("isAvailable", String(formData.isAvailable));

      data.append("options", JSON.stringify(productOptions));

      const selectedCategory = categories.find(
        (c) => c.id.toString() === formData.categoryId
      );
      data.append(
        "categoryFolder",
        selectedCategory ? selectedCategory.nameEn : "uncategorized"
      );

      if (imagesToDelete.length > 0)
        data.append("deleteImageIds", JSON.stringify(imagesToDelete));
      selectedFiles.forEach((file) => data.append("images", file));

      if (editingProduct) {
        await productService.update(editingProduct.id, data);
        toast.success(tToast("productUpdated"));
      } else {
        await productService.create(data);
        toast.success(tToast("productCreated"));
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || tToast("operationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImages =
    (editingProduct?.images?.filter((img) => !imagesToDelete.includes(img.id))
      .length || 0) + previewUrls.length;

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#372117]">
            {t("allProducts")}
          </h2>
          <p className="text-gray-500 text-sm">{t("productDesc")}</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full px-6 shadow-sm cursor-pointer"
        >
          <Plus className="mr-2 h-5 w-5" /> {t("addProduct")}
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
        {isLoading && categories.length === 0 ? (
          <div className="animate-pulse flex flex-col xl:flex-row gap-4 justify-between">
            <Skeleton className="h-11 w-full xl:max-w-md rounded-full bg-gray-200" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-4 justify-between items-center animate-in fade-in zoom-in-95 duration-300">
            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={tCommon("search")}
                className="pl-10 h-11 border-gray-200 focus-visible:ring-[#f4bc58] rounded-full bg-gray-50/50 hover:bg-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 w-full xl:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 rounded-full border-dashed border-gray-300 bg-transparent px-4 min-w-[140px] cursor-pointer">
                  <SelectValue placeholder={tMenu("all")} />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  <SelectItem className="cursor-pointer" value="all">
                    {tMenu("all")}
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={cat.id}
                      value={cat.id.toString()}
                    >
                      {getLocalizedText(locale, cat.nameTh, cat.nameEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 rounded-full border-dashed border-gray-300 bg-transparent px-4 min-w-[140px] cursor-pointer">
                  <SelectValue placeholder={t("filter.statusAll")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="all">
                    {t("filter.statusAll")}
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="true">
                    {t("filter.active")}
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="false">
                    {t("filter.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={recommendedFilter}
                onValueChange={setRecommendedFilter}
              >
                <SelectTrigger className="h-10 rounded-full border-dashed border-gray-300 bg-transparent px-4 min-w-[150px] cursor-pointer">
                  <SelectValue placeholder={t("filter.recAll")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="all">
                    {t("filter.recAll")}
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="true">
                    {t("filter.onlyRec")}
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="false">
                    {t("filter.nonRec")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {(categoryFilter !== "all" ||
                statusFilter !== "all" ||
                recommendedFilter !== "all" ||
                searchQuery !== "") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setCategoryFilter("all");
                    setStatusFilter("all");
                    setRecommendedFilter("all");
                    setSearchQuery("");
                  }}
                  className="h-10 w-10 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {products.map((product) => (
            <div
              key={product.id}
              className={cn(
                "group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col transition-all duration-300",
                !product.isAvailable && "opacity-60 grayscale-[0.5]"
              )}
            >
              <div className="h-48 relative bg-gray-100">
                {product.isRecommended && (
                  <div className="absolute top-2 left-2 z-10 bg-[#f4bc58] text-[#372117] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#372117]" />{" "}
                    {tCommon("recommended")}
                  </div>
                )}
                {!product.isAvailable && (
                  <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    {tCommon("unavailable")}
                  </div>
                )}
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={getImageUrl(product.images[0].url)!}
                    alt={product.nameTh}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50">
                    <UploadCloud className="w-8 h-8 opacity-20" />
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-[#372117] line-clamp-1 text-base">
                    {getLocalizedText(locale, product.nameTh, product.nameEn)}
                  </h3>
                  <span className="bg-[#372117]/5 text-[#372117] text-[10px] px-2 py-1 rounded-md font-semibold capitalize shrink-0">
                    {product.category
                      ? getLocalizedText(
                          locale,
                          product.category.nameTh,
                          product.category.nameEn
                        )
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <p className="text-lg font-bold text-[#f4bc58]">
                    {tCommon("baht")}
                    {Number(product.price).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-[#f4bc58]/10 cursor-pointer"
                      onClick={() => openEditModal(product)}
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-red-50 cursor-pointer"
                      onClick={() => openDeleteModal(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!isLoading && products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
              <Package className="w-12 h-12 mb-2 opacity-20" />
              <p>{t("noProducts")}</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[85vh] p-0 flex flex-col bg-white gap-0 focus:outline-none rounded-xl">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 shrink-0">
            <DialogTitle className="text-2xl font-chivo text-[#372117]">
              {editingProduct ? t("editProduct") : t("addProduct")}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2">
                    {t("form.basicInfo")}
                  </h3>
                  <div className="space-y-2">
                    <Label>
                      {t("form.nameTh")} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.nameTh}
                      onChange={(e) =>
                        setFormData({ ...formData, nameTh: e.target.value })
                      }
                      required
                      className="focus-visible:ring-[#f4bc58]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.nameEn")}</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      className="focus-visible:ring-[#f4bc58]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.descTh")}</Label>
                    <Textarea
                      value={formData.descriptionTh}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionTh: e.target.value,
                        })
                      }
                      rows={2}
                      className="resize-none focus-visible:ring-[#f4bc58]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.descEn")}</Label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionEn: e.target.value,
                        })
                      }
                      rows={2}
                      className="resize-none focus-visible:ring-[#f4bc58]"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2">
                    {t("form.options")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        {t("form.price")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                        className="focus-visible:ring-[#f4bc58]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("form.category")}</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(val) =>
                          setFormData({ ...formData, categoryId: val })
                        }
                      >
                        <SelectTrigger className="focus:ring-[#f4bc58]">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {getLocalizedText(locale, cat.nameTh, cat.nameEn)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-4 py-2 bg-gray-50 p-3 rounded-lg border border-gray-100 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isRecommended}
                        onCheckedChange={(c) =>
                          setFormData({ ...formData, isRecommended: c })
                        }
                        className="data-[state=checked]:bg-[#f4bc58] cursor-pointer"
                      />
                      <Label className="text-xs cursor-pointer">
                        {t("form.isRecommended")}
                      </Label>
                    </div>
                    <div className="w-[1px] h-6 bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.isAvailable}
                        onCheckedChange={(c) =>
                          setFormData({ ...formData, isAvailable: c })
                        }
                        className="data-[state=checked]:bg-[#f4bc58] cursor-pointer"
                      />
                      <Label className="text-xs cursor-pointer">
                        {t("form.isActive")}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label>{t("form.images")}</Label>
                      <span className="text-[10px] text-gray-400">
                        {totalImages} {t("form.images")}
                      </span>
                    </div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:border-[#f4bc58] hover:bg-[#f4bc58]/5 cursor-pointer transition-colors bg-gray-50/50 h-24"
                    >
                      <UploadCloud className="w-6 h-6 mb-1" />
                      <span className="text-xs">{t("form.upload")}</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {totalImages > 0 && (
                      <div className="relative group">
                        {canScrollLeft && (
                          <button
                            type="button"
                            onClick={() => handleScroll("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md p-1.5 rounded-full text-gray-600 hover:text-[#372117] -ml-2 border border-gray-100"
                          >
                            <ChevronLeft size={16} />
                          </button>
                        )}
                        <div
                          ref={imageScrollRef}
                          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x"
                        >
                          {editingProduct?.images?.map((img) => {
                            const isDeleted = imagesToDelete.includes(img.id);
                            if (isDeleted) return null;
                            return (
                              <div
                                key={img.id}
                                className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border border-gray-200 snap-start"
                              >
                                <Image
                                  src={getImageUrl(img.url)!}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => markImageForDeletion(img.id)}
                                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md scale-90 hover:scale-100"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            );
                          })}
                          {previewUrls.map((url, i) => (
                            <div
                              key={i}
                              className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border border-gray-200 snap-start group/img"
                            >
                              <Image
                                src={url}
                                alt=""
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeSelectedFile(i)}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 scale-90 hover:scale-100"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                        {canScrollRight && (
                          <button
                            type="button"
                            onClick={() => handleScroll("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-md p-1.5 rounded-full text-gray-600 hover:text-[#372117] -mr-2 border border-gray-100"
                          >
                            <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 mt-4">
                <ProductOptionsForm
                  options={productOptions}
                  onChange={setProductOptions}
                  showError={showError}
                />
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold cursor-pointer"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tCommon("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t("confirmDelete")}
        description={t("confirmDelete")}
        confirmText={tCommon("delete")}
        cancelText={tCommon("cancel")}
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminProductsPage;
