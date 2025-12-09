"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Key, Shield, User } from "lucide-react";
import { toast } from "sonner";

const credentials = {
  admin: [
    { email: "admin1@gmail.com", pass: "123456Ab" },
    { email: "admin2@gmail.com", pass: "123456Ab" },
  ],
  user: [
    { email: "user1@gmail.com", pass: "123456Ab" },
    { email: "user2@gmail.com", pass: "123456Ab" },
    { email: "user3@gmail.com", pass: "123456Ab" },
  ],
};

const DemoCredentialModal = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success("Copied to clipboard!");

    setTimeout(() => setCopied(null), 2000);
  };

  const renderList = (items: typeof credentials.admin) => (
    <div className="space-y-3 mt-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-700">Email:</span>
              <span className="text-sm font-mono text-[#372117]">
                {item.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-700">Pass:</span>
              <span className="text-sm font-mono text-gray-500">
                {item.pass}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer hover:bg-white hover:shadow-sm"
              onClick={() => handleCopy(item.email)}
              title="Copy Email"
            >
              {copied === item.email ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-sm hover:bg-[#f4bc58]/10 border-gray-200 cursor-pointer"
          title="Demo Credentials"
        >
          <Key className="h-4 w-4 text-[#372117]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-[#372117]">
            Demo Accounts 🧪
          </DialogTitle>
          <DialogDescription className="text-center">
            Click copy button to use credentials
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex gap-2 cursor-pointer">
              <User className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex gap-2 cursor-pointer">
              <Shield className="w-4 h-4" /> Admins
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user">{renderList(credentials.user)}</TabsContent>
          <TabsContent value="admin">
            {renderList(credentials.admin)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DemoCredentialModal;
