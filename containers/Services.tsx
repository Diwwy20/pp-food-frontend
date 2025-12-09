"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ShoppingCart,
  CalendarDays,
  Clock,
  Armchair,
  Sparkles,
  ChefHat,
} from "lucide-react";

const Services = () => {
  const t = useTranslations("Home");
  const tFeat = useTranslations("Features");

  const features = [
    {
      key: "onlineOrder",
      icon: ShoppingCart,
      color: "text-orange-600 bg-orange-100",
    },
    {
      key: "preReservation",
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-100",
    },
    { key: "service247", icon: Clock, color: "text-green-600 bg-green-100" },
    {
      key: "organizedPlace",
      icon: Armchair,
      color: "text-purple-600 bg-purple-100",
    },
    { key: "cleanKitchen", icon: Sparkles, color: "text-cyan-600 bg-cyan-100" },
    { key: "superChefs", icon: ChefHat, color: "text-red-600 bg-red-100" },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 bg-[#f4bc58]/10 rounded-[40px] p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f4bc58]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
          <Image
            src="/images/chef-diw.png"
            alt="Chef Services"
            fill
            className="object-contain z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            unoptimized
          />

          <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-white/40 rounded-full z-0" />
        </div>

        <div className="space-y-10 md:pl-4 relative z-10">
          <div className="space-y-4">
            <h2
              className="text-3xl md:text-5xl font-bold text-[#372117] leading-tight"
              style={{ fontFamily: "var(--font-chivo)" }}
            >
              {t("serviceTitle")}
            </h2>

            <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed">
              {t("serviceDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {features.map((feat) => (
              <div
                key={feat.key}
                className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group"
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${feat.color} group-hover:scale-110 transition-transform`}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <p className="text-base text-[#372117] font-semibold group-hover:text-[#f4bc58] transition-colors">
                  {tFeat(feat.key as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Services;
