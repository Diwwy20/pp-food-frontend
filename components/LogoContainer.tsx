"use client";

import Image from "next/image";

const LogoContainer = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={100}
        height={100}
        priority
        className="object-contain"
      />
      <h2
        className="font-bold text-[#372117] text-xl"
        style={{ fontFamily: "var(--font-chivo)" }}
      >
        PP Food
      </h2>
    </div>
  );
};
export default LogoContainer;
