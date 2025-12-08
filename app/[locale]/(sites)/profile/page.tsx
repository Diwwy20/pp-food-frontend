"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { authService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, Save, User as UserIcon } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

const DEFAULT_AVATAR = "/images/placeholder-avatar.jpg";

const ProfilePage = () => {
  const { user, setUser, isInitialized } = useAuthStore();
  const tAuth = useTranslations("Auth");
  const tProfile = useTranslations("Profile");
  const tCommon = useTranslations("Common");
  const tToast = useTranslations("Toast");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickName: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nickName: user.nickName || "",
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return toast.error("Please upload an image file");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File size must be less than 5MB");

    setIsImageLoading(true);

    setTimeout(() => {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedFile(file);
      setIsImageLoading(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("nickName", formData.nickName);

      if (selectedFile) {
        data.append("avatar", selectedFile);
      }

      const response = await authService.updateProfile(data);

      if (response.success && response.data.user) {
        setUser(response.data.user);
        setSelectedFile(null);
        toast.success(tToast("profileUpdated"));
      }
    } catch (error: any) {
      console.error("Update failed", error);
      toast.error(error.response?.data?.message || tToast("operationFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isInitialized || !user) {
    return <ProfileSkeleton />;
  }

  const displayImage =
    previewUrl || getImageUrl(user?.profileImage) || DEFAULT_AVATAR;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl animate-in fade-in zoom-in-95 duration-500">
      <Card className="border-gray-100 shadow-lg bg-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle
            className="text-3xl font-bold text-[#372117]"
            style={{ fontFamily: "var(--font-chivo)" }}
          >
            {tProfile("title")}
          </CardTitle>
          <CardDescription>{tProfile("description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-[#f4bc58]/30 shadow-md cursor-pointer transition-transform duration-300 group-hover:scale-105">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 rounded-full backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  <AvatarImage
                    src={displayImage}
                    className="object-cover"
                    alt="Profile Avatar"
                  />
                  <AvatarFallback className="text-4xl bg-[#f4bc58] text-[#372117] font-bold">
                    {user.firstName?.charAt(0).toUpperCase() || (
                      <UserIcon className="w-10 h-10" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <Button
                  type="button"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-[#372117] text-white hover:bg-[#372117]/90 border-2 border-white shadow-lg transition-transform active:scale-95 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImageLoading || isSaving}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {tProfile("clickCamera")}
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="nickName"
                  className="text-[#372117] font-medium"
                >
                  {tProfile("nickname")}
                </Label>
                <Input
                  id="nickName"
                  value={formData.nickName}
                  onChange={(e) =>
                    setFormData({ ...formData, nickName: e.target.value })
                  }
                  className="focus-visible:ring-[#f4bc58] border-gray-200"
                  placeholder={tProfile("enterNickname")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#372117] font-medium">
                  {tAuth("firstName")}
                </Label>
                <Input
                  value={formData.firstName}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#372117] font-medium">
                  {tAuth("lastName")}
                </Label>
                <Input
                  value={formData.lastName}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-100"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-[#372117] font-medium">
                  {tAuth("email")}
                </Label>
                <Input
                  value={user.email || ""}
                  disabled
                  className="bg-gray-50 text-gray-500 cursor-not-allowed border-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
              <Button
                type="submit"
                className="bg-[#f4bc58] text-[#372117] hover:bg-[#f4bc58]/90 font-bold rounded-full px-8 transition-all shadow-sm active:scale-95 cursor-pointer"
                disabled={isSaving || isImageLoading}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {tCommon("loading")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> {tCommon("save")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
