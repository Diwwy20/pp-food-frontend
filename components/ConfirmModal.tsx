"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  description,
  confirmText,
  cancelText,
  variant = "default",
}: ConfirmModalProps) => {
  const tCommon = useTranslations("Common");

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white rounded-xl border border-gray-100 shadow-xl max-w-[90vw] sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#372117] font-chivo text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={loading}
            onClick={onClose}
            className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-[#372117] cursor-pointer"
          >
            {cancelText || tCommon("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={`rounded-full font-bold shadow-sm cursor-pointer ${
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-[#f4bc58] hover:bg-[#f4bc58]/90 text-[#372117]"
            }`}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText || tCommon("save")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
