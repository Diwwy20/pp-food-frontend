"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <Card className="p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full bg-white">
      <div className="h-48 relative rounded-md overflow-hidden bg-gray-50 mb-4">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-3/4 rounded-full" />
        <div className="w-full space-y-1">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-3 w-2/3 mx-auto rounded-full" />
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </Card>
  );
};

export default ProductSkeleton;
