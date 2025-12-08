"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string | null;
  amount: number;
}

const PaymentModal = ({
  isOpen,
  onClose,
  qrUrl,
  amount,
}: PaymentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-sm flex flex-col items-center justify-center p-6">
        <DialogHeader>
          <DialogTitle className="text-[#372117] font-chivo text-center text-xl">
            Scan to Pay 📲
          </DialogTitle>
        </DialogHeader>

        <div className="my-4 flex flex-col items-center gap-4">
          <div className="text-3xl font-bold text-[#f4bc58]">
            ฿{amount.toLocaleString()}
          </div>

          <div className="relative w-64 h-64 border-2 border-gray-100 rounded-lg overflow-hidden bg-white shadow-inner flex items-center justify-center">
            {qrUrl ? (
              <Image
                src={qrUrl}
                alt="Omise PromptPay QR"
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <Loader2 className="w-8 h-8 animate-spin text-[#f4bc58]" />
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">
            เปิดแอปธนาคารแล้วสแกนได้เลย (Test Mode)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
