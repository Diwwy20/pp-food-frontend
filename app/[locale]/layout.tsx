import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ModalProvider from "@/providers/ModalProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { notFound } from "next/navigation";

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/images/logo.png",
  },
  title: "PP Food - Restaurant App",
  description: "Crafted by Diwwy",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${chivo.variable} antialiased`}>
        <NextIntlClientProvider>
          <ThemeProvider>
            <ModalProvider />
            <AuthProvider>{children}</AuthProvider>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
