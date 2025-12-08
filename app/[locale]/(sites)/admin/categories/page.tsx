"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";
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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash2, PackageOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmModal from "@/components/ConfirmModal";

const AdminCategoriesPage = () => {
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const tToast = useTranslations("Toast");

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nameTh: "", nameEn: "" });

  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error(tToast("fetchCategoriesFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ nameTh: "", nameEn: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ nameTh: cat.nameTh, nameEn: cat.nameEn });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setCategoryToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await categoryService.delete(categoryToDelete);
      toast.success(tToast("categoryDeleted"));
      fetchCategories();
      setCategoryToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || tToast("operationFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        toast.success(tToast("categoryUpdated"));
      } else {
        await categoryService.create(formData);
        toast.success(tToast("categoryCreated"));
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || tToast("operationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#372117]">
            {t("categoryManagement")}
          </h2>
          <p className="text-gray-500 text-sm">{t("categoryDesc")}</p>
        </div>

        <Button
          onClick={openCreateModal}
          className="bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full px-6 shadow-sm cursor-pointer"
        >
          <Plus className="mr-2 h-5 w-5" /> {t("addCategory")}
        </Button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>{t("form.nameTh")}</TableHead>
              <TableHead>{t("form.nameEn")}</TableHead>
              <TableHead className="text-right pr-6">
                {tCommon("edit")}/{tCommon("delete")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell>
                    <Skeleton className="h-5 w-8 rounded-md bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 rounded-md bg-gray-200" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32 rounded-md bg-gray-200" />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <PackageOpen className="w-12 h-12 mb-2 opacity-20" />
                    <p>{t("noCategories")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <TableCell className="font-medium text-gray-500">
                    #{cat.id}
                  </TableCell>
                  <TableCell className="font-bold text-[#372117]">
                    {cat.nameTh}
                  </TableCell>
                  <TableCell>{cat.nameEn}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-[#f4bc58]/10 cursor-pointer"
                        onClick={() => openEditModal(cat)}
                      >
                        <Pencil className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-red-50 cursor-pointer"
                        onClick={() => openDeleteModal(cat.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#372117] font-chivo">
              {editingCategory ? t("editCategory") : t("addCategory")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                {t("form.nameTh")} <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.nameTh}
                onChange={(e) =>
                  setFormData({ ...formData, nameTh: e.target.value })
                }
                placeholder={t("form.placeholderNameTh")}
                className="focus-visible:ring-[#f4bc58]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>
                {t("form.nameEn")} <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.nameEn}
                onChange={(e) =>
                  setFormData({ ...formData, nameEn: e.target.value })
                }
                placeholder={t("form.placeholderNameEn")}
                className="focus-visible:ring-[#f4bc58]"
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold cursor-pointer"
                disabled={isSubmitting}
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
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t("confirmDeleteCategory")}
        description={t("confirmDeleteCategory")}
        confirmText={tCommon("delete")}
        cancelText={tCommon("cancel")}
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminCategoriesPage;
