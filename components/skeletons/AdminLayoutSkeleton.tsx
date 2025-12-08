"use client";

import { Skeleton } from "@/components/ui/skeleton";

const AdminLayoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-12 py-8 max-w-7xl">
        <Skeleton className="h-8 w-48 mb-4 hidden md:block rounded-md" />

        <div className="flex items-center gap-2 mb-6 bg-gray-100/50 p-1 rounded-lg w-fit border border-gray-200">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>

        <div className="mt-6 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between">
            <Skeleton className="h-10 w-1/3 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutSkeleton;
