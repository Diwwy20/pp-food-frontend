"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="border-gray-100 shadow-lg bg-white">
        <CardHeader className="text-center space-y-2 flex flex-col items-center">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </CardHeader>

        <CardContent className="space-y-8 mt-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Skeleton className="w-32 h-32 rounded-full" />
              <Skeleton className="absolute bottom-0 right-0 w-10 h-10 rounded-full border-2 border-white" />
            </div>
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSkeleton;
