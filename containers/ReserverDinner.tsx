"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import reservations from "/images/reservations.png";

import {
  ShoppingCart,
  CalendarDays,
  Clock,
  Armchair,
  Sparkles,
  ChefHat,
} from "lucide-react";

const ReserverDinner = () => {
  const t = useTranslations("Home");
  const tFeat = useTranslations("Features");

  const features = [
    {
      key: "onlineOrder",
      icon: ShoppingCart,
      color: "text-blue-500 bg-blue-50",
    },
    {
      key: "preReservation",
      icon: CalendarDays,
      color: "text-purple-500 bg-purple-50",
    },
    { key: "service247", icon: Clock, color: "text-green-500 bg-green-50" },
    {
      key: "organizedPlace",
      icon: Armchair,
      color: "text-orange-500 bg-orange-50",
    },
    { key: "cleanKitchen", icon: Sparkles, color: "text-cyan-500 bg-cyan-50" },
    { key: "superChefs", icon: ChefHat, color: "text-red-500 bg-red-50" },
  ];

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-6 md:px-12 py-16 max-w-7xl mx-auto">
      <div className="space-y-10 md:px-8 order-2 md:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
        <div className="space-y-4">
          <h2
            className="text-3xl md:text-5xl font-bold text-[#372117] leading-tight"
            style={{ fontFamily: "var(--font-chivo)" }}
          >
            {t("reserveTitle")}
          </h2>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {t("reserveDesc")}
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
          {features.map((feat) => (
            <div
              key={feat.key}
              className="flex items-center gap-4 group p-3 rounded-xl transition-all hover:bg-gray-50"
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 ${feat.color} group-hover:scale-110 transition-transform shadow-sm`}
              >
                <feat.icon className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <p className="text-base text-[#372117] font-bold leading-tight group-hover:text-[#f4bc58] transition-colors">
                  {tFeat(feat.key as any)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[350px] md:h-[550px] flex items-center justify-center order-1 md:order-2 animate-in fade-in zoom-in-95 duration-700 delay-200">
        <div className="absolute inset-0 bg-[#f4bc58]/5 rounded-full blur-3xl transform scale-90 z-0" />

        <Image
          src={reservations}
          alt="Reservation"
          fill
          className="object-contain z-10 drop-shadow-xl hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      </div>
    </section>
  );
};
export default ReserverDinner;
